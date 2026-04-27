/**
 * routes/patient.js  — complete updated version
 *
 * NEW endpoints added:
 *   PATCH /api/patient/appointments/:id/cancel  — patient cancels their own future appointment
 *   GET   /api/patient/doctors/search           — search doctors by name / specialty
 *   GET   /api/patient/stats                    — patient's own visit statistics
 */

const express = require('express')
const { body, param, query, validationResult } = require('express-validator')

const User = require('../models/User')
const Appointment = require('../models/Appointment')
const Doctor = require('../models/Doctor')
const Prescription = require('../models/Prescription')
const MedicalRecord = require('../models/MedicalRecord')
const { auth, requireRole } = require('../middleware/auth')
const { upload, uploadLimiter } = require('../middleware/security')
const { getAvailableSlots, isFollowUpVisit } = require('../utils/queueHelper')
const { sendAppointmentSMS } = require('../utils/notifications')

const router = express.Router()
const patientAuth = [auth, requireRole('patient')]

const validate = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg })
    return false
  }
  return true
}

// ── GET /api/patient/profile ──────────────────────────────────────────────────
router.get('/profile', ...patientAuth, async (req, res) => {
  try {
    const patient = await User.findById(req.user.id)
    if (!patient) return res.status(404).json({ error: 'Patient not found' })
    res.json(patient)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── PUT /api/patient/profile ──────────────────────────────────────────────────
router.put(
  '/profile',
  ...patientAuth,
  [
    body('firstName').trim().notEmpty().escape(),
    body('lastName').trim().notEmpty().escape(),
    body('email').optional({ checkFalsy: true }).isEmail().normalizeEmail(),
    body('phone')
      .optional({ checkFalsy: true })
      .matches(/^(\+92|0092|0)?[0-9]{10,11}$/)
      .withMessage('Invalid phone number format')
  ],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const patient = await User.findById(req.user.id)
      if (!patient) return res.status(404).json({ error: 'Patient not found' })

      const {
        firstName,
        lastName,
        email,
        dateOfBirth,
        gender,
        bloodGroup,
        phone,
        address,
        allergies,
        chronicConditions,
        emergencyContact
      } = req.body

      Object.assign(patient, { firstName, lastName })
      if (email !== undefined) patient.email = email || undefined
      if (phone !== undefined) patient.phone = phone || undefined
      if (dateOfBirth !== undefined) patient.dateOfBirth = dateOfBirth
      if (gender !== undefined) patient.gender = gender
      if (bloodGroup !== undefined) patient.bloodGroup = bloodGroup
      if (address !== undefined) patient.address = address
      if (allergies !== undefined) patient.allergies = allergies
      if (chronicConditions !== undefined)
        patient.chronicConditions = chronicConditions
      if (emergencyContact !== undefined)
        patient.emergencyContact = emergencyContact

      await patient.save()
      res.json(patient)
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── GET /api/patient/available-slots ─────────────────────────────────────────
router.get('/available-slots', ...patientAuth, async (req, res) => {
  try {
    const { doctorId, date } = req.query
    if (!doctorId || !date)
      return res.status(400).json({ error: 'doctorId and date required' })
    const doctor = await Doctor.findById(doctorId)
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' })
    const slots = await getAvailableSlots(doctor, date)
    res.json(slots)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET /api/patient/doctors/search ──────────────────────────────────────────
// Search/filter doctors by name or specialty. Also returns today's availability count.
router.get(
  '/doctors/search',
  ...patientAuth,
  [
    query('q').optional().trim().escape(),
    query('specialty').optional().trim().escape(),
    query('date').optional().isISO8601()
  ],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const { q, specialty, date } = req.query
      const filter = {}

      if (specialty) {
        filter.specialty = { $regex: specialty, $options: 'i' }
      }
      if (q) {
        filter.$or = [
          { firstName: { $regex: q, $options: 'i' } },
          { lastName: { $regex: q, $options: 'i' } },
          { specialty: { $regex: q, $options: 'i' } }
        ]
      }

      const doctors = await Doctor.find(filter).select(
        'firstName lastName specialty workingHours minutesPerPatient maxPatientsPerDay'
      )

      // If date provided, also return available slot count for each doctor
      let results = doctors.map((d) => ({
        _id: d._id,
        firstName: d.firstName,
        lastName: d.lastName,
        specialty: d.specialty,
        workingHours: d.workingHours,
        minutesPerPatient: d.minutesPerPatient,
        maxPatientsPerDay: d.maxPatientsPerDay,
        availableSlots: null
      }))

      if (date) {
        results = await Promise.all(
          results.map(async (d) => {
            const slots = await getAvailableSlots(
              {
                _id: d._id,
                workingHours: d.workingHours,
                minutesPerPatient: d.minutesPerPatient,
                maxPatientsPerDay: d.maxPatientsPerDay
              },
              date
            )
            return { ...d, availableSlots: slots.length }
          })
        )
      }

      res.json(results)
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── POST /api/patient/book-appointment ────────────────────────────────────────
router.post(
  '/book-appointment',
  ...patientAuth,
  [
    body('doctorId').isMongoId(),
    body('date').isISO8601(),
    body('queueNumber').isInt({ min: 1 }),
    body('estimatedTime').matches(/^\d{2}:\d{2}$/),
    body('tokenCode').trim().notEmpty(),
    body('reason').trim().notEmpty().escape()
  ],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const { doctorId, date, queueNumber, estimatedTime, tokenCode, reason } =
        req.body

      const dateStart = new Date(date)
      dateStart.setUTCHours(0, 0, 0, 0)
      const dateEnd = new Date(dateStart)
      dateEnd.setUTCDate(dateEnd.getUTCDate() + 1)

      const conflict = await Appointment.findOne({
        doctorId,
        date: { $gte: dateStart, $lt: dateEnd },
        queueNumber,
        status: { $nin: ['cancelled'] }
      })
      if (conflict)
        return res
          .status(409)
          .json({ error: 'This slot was just taken. Please select another.' })

      const alreadyBooked = await Appointment.findOne({
        patientId: req.user.id,
        doctorId,
        date: { $gte: dateStart, $lt: dateEnd },
        status: { $nin: ['cancelled'] }
      })
      if (alreadyBooked)
        return res
          .status(409)
          .json({
            error: 'You already have an appointment with this doctor today.'
          })

      const doctor = await Doctor.findById(doctorId)
      const followUp = await isFollowUpVisit(
        req.user.id,
        doctorId,
        doctor.followUpWindowDays
      )

      const appt = new Appointment({
        patientId: req.user.id,
        doctorId,
        date: dateStart,
        time: estimatedTime,
        reason,
        queueNumber,
        estimatedTime,
        tokenCode,
        visitType: followUp ? 'follow-up' : 'new',
        discountApplied: followUp ? doctor.followUpDiscountPercent : 0,
        isFree: followUp && doctor.followUpFree
      })
      await appt.save()

      // SMS confirmation (non-blocking)
      const patient = await User.findById(req.user.id)
      if (patient.phone) {
        sendAppointmentSMS(patient.phone, {
          tokenCode,
          queueNumber,
          estimatedTime,
          doctorName: `${doctor.firstName} ${doctor.lastName}`,
          date: dateStart,
          visitType: appt.visitType,
          isFree: appt.isFree,
          discountApplied: appt.discountApplied
        }).catch((err) => console.error('SMS failed (non-fatal):', err.message))
      }

      res.status(201).json({
        message: 'Appointment booked',
        appointment: appt,
        queueInfo: {
          queueNumber,
          tokenCode,
          estimatedTime,
          visitType: appt.visitType,
          isFree: appt.isFree,
          discountApplied: appt.discountApplied
        }
      })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── PATCH /api/patient/appointments/:id/cancel ────────────────────────────────
// Patient can cancel their OWN future or scheduled appointments only.
// Cannot cancel appointments that are already in-progress or completed.
router.patch(
  '/appointments/:id/cancel',
  ...patientAuth,
  [param('id').isMongoId()],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const appt = await Appointment.findOne({
        _id: req.params.id,
        patientId: req.user.id // ownership guard — only their own
      }).populate('doctorId', 'firstName lastName')

      if (!appt) return res.status(404).json({ error: 'Appointment not found' })

      // Cannot cancel if already started, completed, or already cancelled
      if (
        ['in-progress', 'completed', 'cancelled', 'no-show'].includes(
          appt.status
        )
      ) {
        return res.status(400).json({
          error: `Cannot cancel an appointment that is already ${appt.status}`
        })
      }

      // Must be a future appointment (appointment date >= today)
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      if (new Date(appt.date) < today) {
        return res
          .status(400)
          .json({ error: 'Cannot cancel a past appointment' })
      }

      appt.status = 'cancelled'
      appt.cancelledAt = new Date()
      appt.cancelledBy = 'patient'
      await appt.save()

      res.json({
        message: 'Appointment cancelled successfully',
        appointment: appt
      })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── GET /api/patient/appointments  (today's) ──────────────────────────────────
router.get('/appointments', ...patientAuth, async (req, res) => {
  try {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)

    const appointments = await Appointment.find({
      patientId: req.user.id,
      date: { $gte: today, $lt: tomorrow },
      status: { $nin: ['cancelled'] }
    })
      .populate('doctorId', 'firstName lastName specialty')
      .sort({ queueNumber: 1 })
    res.json(appointments)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET /api/patient/appointments/all ─────────────────────────────────────────
router.get('/appointments/all', ...patientAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate('doctorId', 'firstName lastName specialty')
      .sort({ date: -1 })
    res.json(appointments)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET /api/patient/stats ────────────────────────────────────────────────────
// Patient's own visit statistics for their dashboard
router.get('/stats', ...patientAuth, async (req, res) => {
  try {
    const patientId = req.user.id

    const [
      totalAppointments,
      completedVisits,
      cancelledCount,
      upcomingCount,
      totalPrescriptions,
      totalRecords,
      doctorCount,
      lastVisitDoc
    ] = await Promise.all([
      Appointment.countDocuments({ patientId }),
      Appointment.countDocuments({ patientId, status: 'completed' }),
      Appointment.countDocuments({ patientId, status: 'cancelled' }),
      Appointment.countDocuments({
        patientId,
        status: { $in: ['scheduled', 'waiting'] },
        date: { $gte: new Date() }
      }),
      Prescription.countDocuments({ patientId, active: true }),
      MedicalRecord.countDocuments({ patientId }),
      Appointment.distinct('doctorId', { patientId }).then((ids) => ids.length),
      Appointment.findOne({ patientId, status: 'completed' })
        .sort({ completedAt: -1 })
        .populate('doctorId', 'firstName lastName specialty')
    ])

    res.json({
      totalAppointments,
      completedVisits,
      cancelledCount,
      upcomingCount,
      totalPrescriptions,
      totalRecords,
      doctorsSeenCount: doctorCount,
      lastVisit: lastVisitDoc
        ? {
            date: lastVisitDoc.completedAt || lastVisitDoc.date,
            doctor: lastVisitDoc.doctorId
              ? `Dr. ${lastVisitDoc.doctorId.firstName} ${lastVisitDoc.doctorId.lastName}`
              : 'Unknown',
            specialty: lastVisitDoc.doctorId?.specialty || ''
          }
        : null
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET /api/patient/queue-status/:appointmentId ──────────────────────────────
router.get(
  '/queue-status/:appointmentId',
  ...patientAuth,
  [param('appointmentId').isMongoId()],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const appt = await Appointment.findOne({
        _id: req.params.appointmentId,
        patientId: req.user.id
      })
      if (!appt) return res.status(404).json({ error: 'Appointment not found' })

      const dateStart = new Date(appt.date)
      dateStart.setUTCHours(0, 0, 0, 0)
      const dateEnd = new Date(dateStart)
      dateEnd.setUTCDate(dateEnd.getUTCDate() + 1)

      const inProgress = await Appointment.findOne({
        doctorId: appt.doctorId,
        date: { $gte: dateStart, $lt: dateEnd },
        status: 'in-progress'
      })
      const completedCount = await Appointment.countDocuments({
        doctorId: appt.doctorId,
        date: { $gte: dateStart, $lt: dateEnd },
        status: 'completed'
      })

      const currentQueue = inProgress ? inProgress.queueNumber : completedCount
      const patientsAhead = Math.max(0, appt.queueNumber - currentQueue - 1)

      res.json({
        myQueueNumber: appt.queueNumber,
        myTokenCode: appt.tokenCode,
        estimatedTime: appt.estimatedTime,
        currentlyServing: inProgress ? inProgress.queueNumber : completedCount,
        patientsAhead,
        status: appt.status,
        visitType: appt.visitType,
        isFree: appt.isFree,
        discountApplied: appt.discountApplied
      })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── POST /api/patient/upload-report/:appointmentId ────────────────────────────
router.post(
  '/upload-report/:appointmentId',
  ...patientAuth,
  uploadLimiter,
  [param('appointmentId').isMongoId()],
  upload.array('reports', 5),
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const appt = await Appointment.findOne({
        _id: req.params.appointmentId,
        patientId: req.user.id
      })
      if (!appt) return res.status(404).json({ error: 'Appointment not found' })
      if (!req.files || req.files.length === 0)
        return res.status(400).json({ error: 'No files uploaded' })

      const newFiles = req.files.map((f) => ({
        filename: f.filename,
        originalName: f.originalname,
        mimetype: f.mimetype,
        size: f.size,
        url: `/uploads/${f.filename}`
      }))
      appt.reports.push(...newFiles)
      await appt.save()
      res.json({ message: 'Reports uploaded successfully', files: newFiles })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── GET /api/patient/care-team ────────────────────────────────────────────────
router.get('/care-team', ...patientAuth, async (req, res) => {
  try {
    const doctorIds = await Appointment.distinct('doctorId', {
      patientId: req.user.id
    })
    const careTeam = await Doctor.find({ _id: { $in: doctorIds } }).select(
      'firstName lastName specialty phoneNumber workingHours'
    )
    res.json(careTeam)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET /api/patient/prescriptions ───────────────────────────────────────────
router.get('/prescriptions', ...patientAuth, async (req, res) => {
  try {
    const rxs = await Prescription.find({ patientId: req.user.id })
      .populate('doctorId', 'firstName lastName specialty')
      .sort({ createdAt: -1 })
    res.json(rxs)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET /api/patient/medical-records ─────────────────────────────────────────
router.get('/medical-records', ...patientAuth, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user.id })
      .populate('doctorId', 'firstName lastName specialty')
      .sort({ visitDate: -1 })
    res.json(records)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
