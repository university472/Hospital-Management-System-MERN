/**
 * routes/admin.js — complete updated version
 *
 * NEW endpoints:
 *   PATCH /api/admin/doctor/:id/deactivate   — soft-deactivate a doctor
 *   PATCH /api/admin/doctor/:id/activate     — re-activate a doctor
 *   GET   /api/admin/doctor/:id              — get single doctor full detail
 *   GET   /api/admin/stats                   — single stats call for dashboard
 */

const express = require('express')
const { body, param, validationResult } = require('express-validator')

const Doctor = require('../models/Doctor')
const Admin = require('../models/Admin')
const User = require('../models/User')
const Appointment = require('../models/Appointment')
const { auth, requireRole } = require('../middleware/auth')
const { calcMaxPatients } = require('../utils/queueHelper')
const { sendDoctorWelcomeEmail } = require('../utils/notifications')

const router = express.Router()
const adminOnly = [auth, requireRole('admin')]

const validate = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg })
    return false
  }
  return true
}

// ── GET /api/admin/profile ────────────────────────────────────────────────────
router.get('/profile', ...adminOnly, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id)
    if (!admin) return res.status(404).json({ error: 'Admin not found' })
    res.json(admin)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── PUT /api/admin/profile ────────────────────────────────────────────────────
router.put(
  '/profile',
  ...adminOnly,
  [
    body('firstName').trim().notEmpty().escape(),
    body('lastName').trim().notEmpty().escape(),
    body('email').isEmail().normalizeEmail()
  ],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const admin = await Admin.findById(req.user.id)
      if (!admin) return res.status(404).json({ error: 'Admin not found' })
      admin.firstName = req.body.firstName
      admin.lastName = req.body.lastName
      admin.email = req.body.email
      await admin.save()
      res.json({ message: 'Profile updated', admin })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
// Single endpoint that returns all dashboard stats efficiently
router.get('/stats', ...adminOnly, async (req, res) => {
  try {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)

    const [
      totalDoctors,
      activeDoctors,
      totalPatients,
      todayAppts,
      completedToday
    ] = await Promise.all([
      Doctor.countDocuments(),
      Doctor.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'patient' }),
      Appointment.countDocuments({
        date: { $gte: today, $lt: tomorrow },
        status: { $nin: ['cancelled'] }
      }),
      Appointment.countDocuments({
        date: { $gte: today, $lt: tomorrow },
        status: 'completed'
      })
    ])

    res.json({
      totalDoctors,
      activeDoctors,
      totalPatients,
      todayAppts,
      completedToday
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── POST /api/admin/add-doctor ────────────────────────────────────────────────
router.post(
  '/add-doctor',
  ...adminOnly,
  [
    body('firstName').trim().notEmpty().escape(),
    body('lastName').trim().notEmpty().escape(),
    body('email').isEmail().normalizeEmail(),
    body('specialty').trim().notEmpty().escape(),
    body('licenseNumber').trim().notEmpty().escape(),
    body('phoneNumber').trim().notEmpty(),
    body('password').isLength({ min: 8 }),
    body('workingHours.start')
      .optional()
      .matches(/^\d{2}:\d{2}$/),
    body('workingHours.end')
      .optional()
      .matches(/^\d{2}:\d{2}$/),
    body('minutesPerPatient').optional().isInt({ min: 5, max: 120 })
  ],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const {
        firstName,
        lastName,
        email,
        specialty,
        licenseNumber,
        phoneNumber,
        password,
        workingHours,
        minutesPerPatient,
        followUpDiscountPercent,
        followUpFree,
        followUpWindowDays
      } = req.body

      const plainPassword = password

      const doctor = new Doctor({
        firstName,
        lastName,
        email,
        specialty,
        licenseNumber,
        phoneNumber,
        password,
        workingHours: workingHours || { start: '10:00', end: '17:00' },
        minutesPerPatient: minutesPerPatient || 30,
        followUpDiscountPercent: followUpDiscountPercent || 0,
        followUpFree: followUpFree || false,
        followUpWindowDays: followUpWindowDays || 30,
        isActive: true
      })

      doctor.maxPatientsPerDay = calcMaxPatients(doctor)
      await doctor.save()

      sendDoctorWelcomeEmail({ doctor, plainPassword }).catch((err) =>
        console.error('Welcome email failed (non-fatal):', err.message)
      )

      res.status(201).json({ message: 'Doctor added successfully', doctor })
    } catch (err) {
      if (err.code === 11000) {
        return res
          .status(400)
          .json({ error: 'Email or license number already exists' })
      }
      res.status(400).json({ error: err.message })
    }
  }
)

// ── PUT /api/admin/doctor/:id/schedule ───────────────────────────────────────
router.put(
  '/doctor/:id/schedule',
  ...adminOnly,
  [
    param('id').isMongoId(),
    body('workingHours.start')
      .optional()
      .matches(/^\d{2}:\d{2}$/),
    body('workingHours.end')
      .optional()
      .matches(/^\d{2}:\d{2}$/),
    body('minutesPerPatient').optional().isInt({ min: 5, max: 120 }),
    body('followUpDiscountPercent').optional().isInt({ min: 0, max: 100 }),
    body('followUpFree').optional().isBoolean(),
    body('followUpWindowDays').optional().isInt({ min: 1, max: 365 })
  ],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const doctor = await Doctor.findById(req.params.id)
      if (!doctor) return res.status(404).json({ error: 'Doctor not found' })

      const fields = [
        'minutesPerPatient',
        'followUpDiscountPercent',
        'followUpFree',
        'followUpWindowDays'
      ]
      fields.forEach((f) => {
        if (req.body[f] !== undefined) doctor[f] = req.body[f]
      })
      if (req.body.workingHours) {
        if (req.body.workingHours.start)
          doctor.workingHours.start = req.body.workingHours.start
        if (req.body.workingHours.end)
          doctor.workingHours.end = req.body.workingHours.end
      }

      doctor.maxPatientsPerDay = calcMaxPatients(doctor)
      await doctor.save()
      res.json({ message: 'Doctor schedule updated', doctor })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── GET /api/admin/doctor/:id ─────────────────────────────────────────────────
// Full detail for a single doctor including appointment counts
router.get(
  '/doctor/:id',
  ...adminOnly,
  [param('id').isMongoId()],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const doctor = await Doctor.findById(req.params.id).select('-password')
      if (!doctor) return res.status(404).json({ error: 'Doctor not found' })

      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)

      const [totalPatients, totalCompleted, todayCount] = await Promise.all([
        Appointment.distinct('patientId', { doctorId: doctor._id }).then(
          (ids) => ids.length
        ),
        Appointment.countDocuments({
          doctorId: doctor._id,
          status: 'completed'
        }),
        Appointment.countDocuments({
          doctorId: doctor._id,
          date: { $gte: today, $lt: tomorrow },
          status: { $nin: ['cancelled'] }
        })
      ])

      res.json({
        ...doctor.toJSON(),
        totalPatients,
        totalCompleted,
        todayCount
      })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── PATCH /api/admin/doctor/:id/deactivate ────────────────────────────────────
// Soft-deactivate: doctor can no longer log in or receive new bookings.
// Existing appointments are NOT deleted — they remain for records.
router.patch(
  '/doctor/:id/deactivate',
  ...adminOnly,
  [param('id').isMongoId()],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const doctor = await Doctor.findById(req.params.id)
      if (!doctor) return res.status(404).json({ error: 'Doctor not found' })
      if (!doctor.isActive)
        return res.status(400).json({ error: 'Doctor is already deactivated' })

      doctor.isActive = false
      await doctor.save()
      res.json({
        message: `Dr. ${doctor.firstName} ${doctor.lastName} has been deactivated`
      })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── PATCH /api/admin/doctor/:id/activate ─────────────────────────────────────
router.patch(
  '/doctor/:id/activate',
  ...adminOnly,
  [param('id').isMongoId()],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const doctor = await Doctor.findById(req.params.id)
      if (!doctor) return res.status(404).json({ error: 'Doctor not found' })
      if (doctor.isActive)
        return res.status(400).json({ error: 'Doctor is already active' })

      doctor.isActive = true
      await doctor.save()
      res.json({
        message: `Dr. ${doctor.firstName} ${doctor.lastName} has been re-activated`
      })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── GET /api/admin/doctors ────────────────────────────────────────────────────
router.get('/doctors', ...adminOnly, async (req, res) => {
  try {
    const doctors = await Doctor.find().select('-password')
    res.json(doctors)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── POST /api/admin/add-admin ─────────────────────────────────────────────────
router.post(
  '/add-admin',
  ...adminOnly,
  [
    body('firstName').trim().notEmpty().escape(),
    body('lastName').trim().notEmpty().escape(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 })
  ],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const { firstName, lastName, email, password } = req.body
      const admin = new Admin({ firstName, lastName, email, password })
      await admin.save()
      res.status(201).json({ message: 'Admin added successfully' })
    } catch (err) {
      if (err.code === 11000)
        return res.status(400).json({ error: 'Email already exists' })
      res.status(400).json({ error: err.message })
    }
  }
)

// ── GET /api/admin/total-doctors ──────────────────────────────────────────────
router.get('/total-doctors', ...adminOnly, async (req, res) => {
  try {
    res.json({ totalDoctors: await Doctor.countDocuments() })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET /api/admin/total-patients ─────────────────────────────────────────────
router.get('/total-patients', ...adminOnly, async (req, res) => {
  try {
    res.json({ totalPatients: await User.countDocuments({ role: 'patient' }) })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET /api/admin/doctor-overview ───────────────────────────────────────────
router.get('/doctor-overview', ...adminOnly, async (req, res) => {
  try {
    const doctors = await Doctor.find().select(
      'firstName lastName specialty maxPatientsPerDay workingHours minutesPerPatient isActive'
    )
    const overview = await Promise.all(
      doctors.map(async (d) => {
        const uniquePatients = await Appointment.distinct('patientId', {
          doctorId: d._id
        })
        return {
          id: d._id,
          name: `${d.firstName} ${d.lastName}`,
          specialty: d.specialty,
          patients: uniquePatients.length,
          maxPatientsPerDay: d.maxPatientsPerDay,
          workingHours: d.workingHours,
          minutesPerPatient: d.minutesPerPatient,
          isActive: d.isActive !== false // default true for old records
        }
      })
    )
    res.json(overview)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET /api/admin/patient-overview ──────────────────────────────────────────
router.get('/patient-overview', ...adminOnly, async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select(
      'firstName lastName email phone'
    )
    const overview = await Promise.all(
      patients.map(async (p) => {
        const count = await Appointment.countDocuments({ patientId: p._id })
        return {
          id: p._id,
          name: `${p.firstName} ${p.lastName}`,
          contact: p.email || p.phone,
          appointments: count
        }
      })
    )
    res.json(overview)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET /api/admin/queue/:doctorId/:date ──────────────────────────────────────
router.get('/queue/:doctorId/:date', ...adminOnly, async (req, res) => {
  try {
    const { doctorId, date } = req.params
    const dateStart = new Date(date)
    dateStart.setUTCHours(0, 0, 0, 0)
    const dateEnd = new Date(dateStart)
    dateEnd.setUTCDate(dateEnd.getUTCDate() + 1)

    const appointments = await Appointment.find({
      doctorId,
      date: { $gte: dateStart, $lt: dateEnd },
      status: { $nin: ['cancelled'] }
    })
      .populate('patientId', 'firstName lastName')
      .sort({ queueNumber: 1 })

    const inProgress = appointments.find((a) => a.status === 'in-progress')
    const waiting = appointments.filter(
      (a) => a.status === 'waiting' || a.status === 'scheduled'
    )

    res.json({
      current: inProgress
        ? {
            queueNumber: inProgress.queueNumber,
            tokenCode: inProgress.tokenCode,
            patientName: `${inProgress.patientId.firstName} ${inProgress.patientId.lastName}`
          }
        : null,
      next: waiting[0]
        ? {
            queueNumber: waiting[0].queueNumber,
            tokenCode: waiting[0].tokenCode
          }
        : null,
      allToday: appointments
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
