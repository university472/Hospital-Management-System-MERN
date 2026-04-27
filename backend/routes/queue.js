/**
 * /api/queue  – Public endpoint for the display screen outside the doctor's room.
 * No authentication required (it's a public screen).
 * Rate-limited to prevent abuse.
 */
const express = require('express')
const rateLimit = require('express-rate-limit')
const Appointment = require('../models/Appointment')
const Doctor = require('../models/Doctor')

const router = express.Router()

const screenLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 sec
  max: 30,
  message: { error: 'Too many requests' }
})

// GET /api/queue/:doctorId  – live queue for display screen
router.get('/:doctorId', screenLimiter, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId).select(
      'firstName lastName specialty workingHours'
    )
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' })

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)

    const appointments = await Appointment.find({
      doctorId: req.params.doctorId,
      date: { $gte: today, $lt: tomorrow },
      status: { $nin: ['cancelled'] }
    })
      .sort({ queueNumber: 1 })
      .select('queueNumber tokenCode status estimatedTime patientId')

    const inProgress = appointments.find((a) => a.status === 'in-progress')
    const completed = appointments.filter((a) => a.status === 'completed')
    const waiting = appointments.filter((a) =>
      ['waiting', 'scheduled'].includes(a.status)
    )

    res.json({
      doctor: {
        name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        specialty: doctor.specialty,
        hours: `${doctor.workingHours.start} – ${doctor.workingHours.end}`
      },
      current: inProgress
        ? {
            queueNumber: inProgress.queueNumber,
            tokenCode: inProgress.tokenCode
          }
        : null,
      next: waiting[0]
        ? {
            queueNumber: waiting[0].queueNumber,
            tokenCode: waiting[0].tokenCode,
            estimatedTime: waiting[0].estimatedTime
          }
        : null,
      completedCount: completed.length,
      remainingCount: waiting.length,
      totalToday: appointments.length
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
