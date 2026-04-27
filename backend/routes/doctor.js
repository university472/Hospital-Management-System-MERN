// const express = require('express');
// const Doctor = require('../models/Doctor');
// const jwt = require('jsonwebtoken');
// const Appointment = require('../models/Appointment');
// const User = require('../models/User');
// const Prescription = require('../models/Prescription');

// const router = express.Router();

// const auth = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');

//   if (!token) {
//     return res.status(401).send({ error: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, 'your_jwt_secret');
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).send({ error: 'Invalid token' });
//   }
// };

// router.get('/profile', auth, async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.user.id).select('-password');
//     if (!doctor) {
//       return res.status(404).send({ error: 'Doctor not found' });
//     }
//     res.json(doctor);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: 'Server error' });
//   }
// });

// router.put('/profile', auth, async (req, res) => {
//   try {
//     const { firstName, lastName, email, specialty, licenseNumber, phoneNumber } = req.body;
//     const doctor = await Doctor.findById(req.user.id);
//     if (!doctor) {
//       return res.status(404).send({ error: 'Doctor not found' });
//     }
//     doctor.firstName = firstName;
//     doctor.lastName = lastName;
//     doctor.email = email;
//     doctor.specialty = specialty;
//     doctor.licenseNumber = licenseNumber;
//     doctor.phoneNumber = phoneNumber;
//     await doctor.save();
//     const doctorWithoutPassword = doctor.toObject();
//     delete doctorWithoutPassword.password;
//     res.json(doctorWithoutPassword);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: 'Server error' });
//   }
// });

// router.get('/all', async (req, res) => {
//   try {
//     const doctors = await Doctor.find().select('firstName lastName specialty');
//     res.json(doctors);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ error: 'Server error' });
//   }
// });

// router.get('/patients-with-appointments', auth, async (req, res) => {
//   try {
//     const doctorId = req.user.id;
//     const appointments = await Appointment.find({ doctorId }).sort({ date: 1 });
//     const patientIds = [...new Set(appointments.map(app => app.patientId.toString()))];

//     const patients = await User.find({ _id: { $in: patientIds }, role: 'patient' });

//     const patientsWithAppointments = patients.map(patient => {
//       const patientAppointments = appointments.filter(app => app.patientId.toString() === patient._id.toString());
//       const lastVisit = patientAppointments.find(app => new Date(app.date) < new Date());
//       const nextAppointment = patientAppointments.find(app => new Date(app.date) >= new Date());

//       return {
//         ...patient.toObject(),
//         lastVisit: lastVisit ? lastVisit.date : null,
//         nextAppointment: nextAppointment ? nextAppointment.date : null
//       };
//     });

//     res.json(patientsWithAppointments);
//   } catch (error) {
//     console.error('Error fetching patients with appointments:', error);
//     res.status(500).send({ error: 'Server error' });
//   }
// });

// router.get('/available-slots', auth, async (req, res) => {
//   try {
//     const { patientId, date } = req.query;
//     const doctorId = req.user.id; // Assuming the doctor is making the request

//     // Fetch booked appointments for the given doctor and date
//     const bookedAppointments = await Appointment.find({ doctorId, date });
//     const bookedTimes = bookedAppointments.map(app => app.time);

//     // Define all possible time slots
//     const allTimeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

//     // Filter out the booked time slots
//     const availableSlots = allTimeSlots.filter(slot => !bookedTimes.includes(slot));

//     res.json(availableSlots);
//   } catch (error) {
//     console.error('Error fetching available slots:', error);
//     res.status(500).send({ error: 'Server error' });
//   }
// });

// router.post('/schedule-appointment', auth, async (req, res) => {
//   try {
//     const { patientId, date, time, reason } = req.body;
//     const doctorId = req.user.id; // Assuming the doctor is making the request

//     const appointment = new Appointment({
//       patientId,
//       doctorId,
//       date,
//       time,
//       reason
//     });

//     await appointment.save();
//     res.status(201).json({ message: 'Appointment scheduled successfully', appointment });
//   } catch (error) {
//     console.error('Error scheduling appointment:', error);
//     res.status(500).send({ error: 'Server error' });
//   }
// });

// router.post('/prescribe-medication', auth, async (req, res) => {
//   try {
//     const { patientId, medication, dosage, frequency } = req.body;
//     const doctorId = req.user.id; // Assuming the doctor is making the request

//     console.log('Request body:', req.body);
//     console.log('Doctor ID:', doctorId);

//     const prescription = new Prescription({
//       patientId,
//       doctorId,
//       medication,
//       dosage,
//       frequency
//     });

//     const savedPrescription = await prescription.save();
//     console.log('Saved prescription:', savedPrescription);

//     res.status(201).json({ message: 'Medication prescribed successfully', prescription: savedPrescription });
//   } catch (error) {
//     // console.error('Error prescribing medication:', error);
//     // res.status(500).send({ error: 'Server error' });
//   }
// });

// // Get all prescriptions
// router.get('/prescriptions', auth, async (req, res) => {
//   try {
//     const prescriptions = await Prescription.find({ doctorId: req.user.id });
//     res.json(prescriptions);
//   } catch (error) {
//     console.error('Error fetching prescriptions:', error);
//     res.status(500).send({ error: 'Server error' });
//   }
// });

// // Update a prescription
// router.put('/prescriptions/:id', auth, async (req, res) => {
//   try {
//     const { medication, dosage, frequency } = req.body;
//     const prescription = await Prescription.findOneAndUpdate(
//       { _id: req.params.id, doctorId: req.user.id },
//       { medication, dosage, frequency },
//       { new: true }
//     );
//     if (!prescription) {
//       return res.status(404).send({ error: 'Prescription not found' });
//     }
//     res.json(prescription);
//   } catch (error) {
//     console.error('Error updating prescription:', error);
//     res.status(500).send({ error: 'Server error' });
//   }
// });

// // Delete a prescription
// router.delete('/prescriptions/:id', auth, async (req, res) => {
//   try {
//     const prescription = await Prescription.findOneAndDelete({ _id: req.params.id, doctorId: req.user.id });
//     if (!prescription) {
//       return res.status(404).send({ error: 'Prescription not found' });
//     }
//     res.json({ message: 'Prescription deleted successfully' });
//   } catch (error) {
//     // console.error('Error deleting prescription:', error);
//     // res.status(500).send({ error: 'Server error', details: error.message });
//   }
// });

// // Get all prescriptions by patient ID
// router.get('/prescriptions/:patientId', auth, async (req, res) => {
//   try {
//     const prescriptions = await Prescription.find({
//       doctorId: req.user.id,
//       patientId: req.params.patientId
//     });
//     res.json(prescriptions);
//   } catch (error) {
//     console.error('Error fetching prescriptions:', error);
//     res.status(500).send({ error: 'Server error' });
//   }
// });

// router.get('/appointments', auth, async (req, res) => {
//   try {
//     const doctorId = req.user.id;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);  // Set to start of day

//     const appointments = await Appointment.find({
//       doctorId,
//       date: {
//         $gte: today,
//         $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) // End of day
//       }
//     })
//       .populate('patientId', 'firstName lastName')
//       .sort({ time: 1 });

//     res.json(appointments);
//   } catch (error) {
//     console.error('Error fetching appointments:', error);
//     res.status(500).send({ error: 'Server error' });
//   }
// });

// module.exports = router;

const express = require('express')
const path = require('path')
const { body, param, validationResult } = require('express-validator')

const Doctor = require('../models/Doctor')
const Appointment = require('../models/Appointment')
const User = require('../models/User')
const Prescription = require('../models/Prescription')
const MedicalRecord = require('../models/MedicalRecord')
const { auth, requireRole } = require('../middleware/auth')
const { upload, uploadLimiter } = require('../middleware/security')
const { getAvailableSlots, isFollowUpVisit } = require('../utils/queueHelper')

const router = express.Router()
const doctorAuth = [auth, requireRole('doctor')]

const validate = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg })
    return false
  }
  return true
}

// ── GET /api/doctor/profile ───────────────────────────────────────────────────
router.get('/profile', ...doctorAuth, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id)
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' })
    res.json(doctor)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── PUT /api/doctor/profile ───────────────────────────────────────────────────
router.put(
  '/profile',
  ...doctorAuth,
  [
    body('firstName').trim().notEmpty().escape(),
    body('lastName').trim().notEmpty().escape(),
    body('email').isEmail().normalizeEmail(),
    body('specialty').trim().notEmpty().escape(),
    body('licenseNumber').trim().notEmpty().escape(),
    body('phoneNumber').trim().notEmpty()
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
        phoneNumber
      } = req.body
      const doctor = await Doctor.findById(req.user.id)
      if (!doctor) return res.status(404).json({ error: 'Doctor not found' })
      Object.assign(doctor, {
        firstName,
        lastName,
        email,
        specialty,
        licenseNumber,
        phoneNumber
      })
      await doctor.save()
      res.json(doctor)
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── GET /api/doctor/all  (public – patients need to list doctors) ─────────────
router.get('/all', async (req, res) => {
  try {
    const doctors = await Doctor.find().select(
      'firstName lastName specialty workingHours minutesPerPatient maxPatientsPerDay'
    )
    res.json(doctors)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET /api/doctor/available-slots?doctorId=&date= ──────────────────────────
// Used by patients when booking (auth required via patient token too)
router.get('/available-slots', auth, async (req, res) => {
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

// ── GET /api/doctor/appointments  (today's) ───────────────────────────────────
router.get('/appointments', ...doctorAuth, async (req, res) => {
  try {
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)

    const appointments = await Appointment.find({
      doctorId: req.user.id,
      date: { $gte: today, $lt: tomorrow },
      status: { $nin: ['cancelled'] }
    })
      .populate('patientId', 'firstName lastName phone bloodGroup allergies')
      .sort({ queueNumber: 1 })

    res.json(appointments)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── GET /api/doctor/appointments/all ─────────────────────────────────────────
router.get('/appointments/all', ...doctorAuth, async (req, res) => {
  try {
    const { from, to, status } = req.query
    const filter = { doctorId: req.user.id }
    if (from || to) {
      filter.date = {}
      if (from) {
        const d = new Date(from)
        d.setUTCHours(0, 0, 0, 0)
        filter.date.$gte = d
      }
      if (to) {
        const d = new Date(to)
        d.setUTCHours(23, 59, 59, 999)
        filter.date.$lte = d
      }
    }
    if (status) filter.status = status

    const appointments = await Appointment.find(filter)
      .populate('patientId', 'firstName lastName email phone')
      .sort({ date: -1, queueNumber: 1 })
    res.json(appointments)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── PATCH /api/doctor/appointment/:id/status ──────────────────────────────────
// Doctor advances patient status: scheduled→waiting→in-progress→completed
router.patch(
  '/appointment/:id/status',
  ...doctorAuth,
  [
    param('id').isMongoId(),
    body('status').isIn([
      'waiting',
      'in-progress',
      'completed',
      'no-show',
      'cancelled'
    ])
  ],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const appt = await Appointment.findOne({
        _id: req.params.id,
        doctorId: req.user.id
      })
      if (!appt) return res.status(404).json({ error: 'Appointment not found' })

      appt.status = req.body.status
      if (req.body.status === 'in-progress') appt.checkedInAt = new Date()
      if (req.body.status === 'completed') appt.completedAt = new Date()
      if (req.body.doctorNotes !== undefined)
        appt.doctorNotes = req.body.doctorNotes
      await appt.save()
      res.json(appt)
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── GET /api/doctor/patients-with-appointments ───────────────────────────────
router.get('/patients-with-appointments', ...doctorAuth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id }).sort(
      { date: 1 }
    )
    const patientIds = [
      ...new Set(appointments.map((a) => a.patientId.toString()))
    ]
    const patients = await User.find({
      _id: { $in: patientIds },
      role: 'patient'
    })

    const result = patients.map((patient) => {
      const patientAppts = appointments.filter(
        (a) => a.patientId.toString() === patient._id.toString()
      )
      const lastVisit = [...patientAppts]
        .reverse()
        .find((a) => new Date(a.date) < new Date())
      const nextAppt = patientAppts.find((a) => new Date(a.date) >= new Date())
      const totalCompleted = patientAppts.filter(
        (a) => a.status === 'completed'
      ).length
      return {
        ...patient.toJSON(),
        lastVisit: lastVisit ? lastVisit.date : null,
        nextAppointment: nextAppt ? nextAppt.date : null,
        totalCompleted
      }
    })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// ── POST /api/doctor/schedule-appointment ─────────────────────────────────────
router.post(
  '/schedule-appointment',
  ...doctorAuth,
  [
    body('patientId').isMongoId(),
    body('date').isISO8601(),
    body('queueNumber').isInt({ min: 1 }),
    body('estimatedTime').matches(/^\d{2}:\d{2}$/),
    body('tokenCode').trim().notEmpty(),
    body('reason').trim().notEmpty().escape()
  ],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const { patientId, date, queueNumber, estimatedTime, tokenCode, reason } =
        req.body

      // Check for duplicate queue slot
      const dateStart = new Date(date)
      dateStart.setUTCHours(0, 0, 0, 0)
      const dateEnd = new Date(dateStart)
      dateEnd.setUTCDate(dateEnd.getUTCDate() + 1)
      const conflict = await Appointment.findOne({
        doctorId: req.user.id,
        date: { $gte: dateStart, $lt: dateEnd },
        queueNumber,
        status: { $nin: ['cancelled'] }
      })
      if (conflict)
        return res
          .status(409)
          .json({ error: 'That queue slot is already taken' })

      const doctor = await Doctor.findById(req.user.id)
      const followUp = await isFollowUpVisit(
        patientId,
        req.user.id,
        doctor.followUpWindowDays
      )

      const appt = new Appointment({
        patientId,
        doctorId: req.user.id,
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
      res
        .status(201)
        .json({ message: 'Appointment scheduled', appointment: appt })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── Prescriptions ─────────────────────────────────────────────────────────────
router.post(
  '/prescribe-medication',
  ...doctorAuth,
  [
    body('patientId').isMongoId(),
    body('medication').trim().notEmpty().escape(),
    body('dosage').trim().notEmpty().escape(),
    body('frequency').trim().notEmpty().escape()
  ],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const { patientId, medication, dosage, frequency, notes } = req.body
      const rx = new Prescription({
        patientId,
        doctorId: req.user.id,
        medication,
        dosage,
        frequency,
        notes: notes || ''
      })
      await rx.save()
      res
        .status(201)
        .json({ message: 'Prescription created', prescription: rx })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

router.get('/prescriptions', ...doctorAuth, async (req, res) => {
  try {
    const rxs = await Prescription.find({ doctorId: req.user.id }).populate(
      'patientId',
      'firstName lastName'
    )
    res.json(rxs)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

router.get(
  '/prescriptions/:patientId',
  ...doctorAuth,
  [param('patientId').isMongoId()],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const rxs = await Prescription.find({
        doctorId: req.user.id,
        patientId: req.params.patientId
      })
      res.json(rxs)
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

router.put(
  '/prescriptions/:id',
  ...doctorAuth,
  [param('id').isMongoId()],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const { medication, dosage, frequency, notes, active } = req.body
      const rx = await Prescription.findOneAndUpdate(
        { _id: req.params.id, doctorId: req.user.id },
        { medication, dosage, frequency, notes, active },
        { new: true }
      )
      if (!rx) return res.status(404).json({ error: 'Prescription not found' })
      res.json(rx)
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

router.delete(
  '/prescriptions/:id',
  ...doctorAuth,
  [param('id').isMongoId()],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const rx = await Prescription.findOneAndDelete({
        _id: req.params.id,
        doctorId: req.user.id
      })
      if (!rx) return res.status(404).json({ error: 'Prescription not found' })
      res.json({ message: 'Prescription deleted' })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── Medical Records ───────────────────────────────────────────────────────────
router.get(
  '/medical-records/:patientId',
  ...doctorAuth,
  [param('patientId').isMongoId()],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const records = await MedicalRecord.find({
        patientId: req.params.patientId,
        doctorId: req.user.id
      }).sort({ visitDate: -1 })
      res.json(records)
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// Doctor can see all records of their patient (all doctors combined) for full history
router.get(
  '/patient-full-history/:patientId',
  ...doctorAuth,
  [param('patientId').isMongoId()],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      // Only allow if there's at least one appointment between this doctor and patient
      const hasRelationship = await Appointment.exists({
        doctorId: req.user.id,
        patientId: req.params.patientId
      })
      if (!hasRelationship)
        return res
          .status(403)
          .json({ error: 'No appointment relationship found' })

      const records = await MedicalRecord.find({
        patientId: req.params.patientId
      })
        .populate('doctorId', 'firstName lastName specialty')
        .sort({ visitDate: -1 })

      const prescriptions = await Prescription.find({
        patientId: req.params.patientId
      })
        .populate('doctorId', 'firstName lastName')
        .sort({ createdAt: -1 })

      // Get upcoming appointment reports
      const upcomingAppts = await Appointment.find({
        doctorId: req.user.id,
        patientId: req.params.patientId,
        date: { $gte: new Date() },
        status: { $nin: ['cancelled'] }
      }).sort({ date: 1 })

      res.json({ records, prescriptions, upcomingAppointments: upcomingAppts })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

router.post(
  '/medical-records',
  ...doctorAuth,
  [
    body('patientId').isMongoId(),
    body('diagnosis').optional().trim().escape(),
    body('treatment').optional().trim().escape(),
    body('notes').optional().trim().escape()
  ],
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const {
        patientId,
        appointmentId,
        chiefComplaint,
        diagnosis,
        treatment,
        notes,
        vitalSigns,
        visitType
      } = req.body
      const record = new MedicalRecord({
        patientId,
        doctorId: req.user.id,
        appointmentId,
        chiefComplaint,
        diagnosis,
        treatment,
        notes,
        vitalSigns,
        visitType: visitType || 'new'
      })
      await record.save()

      // Mark appointment as completed if appointmentId provided
      if (appointmentId) {
        await Appointment.findByIdAndUpdate(appointmentId, {
          status: 'completed',
          completedAt: new Date(),
          doctorNotes: notes || ''
        })
      }
      res.status(201).json({ message: 'Record saved', record })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── Upload file to appointment ────────────────────────────────────────────────
router.post(
  '/upload-report/:appointmentId',
  ...doctorAuth,
  uploadLimiter,
  [param('appointmentId').isMongoId()],
  upload.array('reports', 5),
  async (req, res) => {
    if (!validate(req, res)) return
    try {
      const appt = await Appointment.findOne({
        _id: req.params.appointmentId,
        doctorId: req.user.id
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
      res.json({ message: 'Files uploaded', files: newFiles })
    } catch (err) {
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// ── Stats: how many patients treated ─────────────────────────────────────────
router.get('/stats', ...doctorAuth, async (req, res) => {
  try {
    const totalTreated = await Appointment.countDocuments({
      doctorId: req.user.id,
      status: 'completed'
    })
    const totalPatients = (
      await Appointment.distinct('patientId', { doctorId: req.user.id })
    ).length
    const totalToday = await (async () => {
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
      return Appointment.countDocuments({
        doctorId: req.user.id,
        date: { $gte: today, $lt: tomorrow },
        status: { $nin: ['cancelled'] }
      })
    })()
    res.json({ totalTreated, totalPatients, totalToday })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
