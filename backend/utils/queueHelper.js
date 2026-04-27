/**
 * queueHelper.js
 * Core logic for the patient queue / token system.
 */

const Appointment = require('../models/Appointment')

/**
 * Parse "HH:MM" string → total minutes from midnight.
 */
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

/**
 * Total minutes → "HH:MM" string.
 */
function minutesToTime(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Format "HH:MM" 24-h → "h:MM AM/PM" for display.
 */
function formatTime12h(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

/**
 * Calculate max patients per day from doctor's working hours + minutesPerPatient.
 */
function calcMaxPatients(doctor) {
  const startMin = timeToMinutes(doctor.workingHours.start)
  const endMin = timeToMinutes(doctor.workingHours.end)
  const totalMin = endMin - startMin
  if (totalMin <= 0) return 0
  return Math.floor(totalMin / doctor.minutesPerPatient)
}

/**
 * Get the next available queue number for a doctor on a given date (YYYY-MM-DD).
 * Returns { queueNumber, estimatedTime, tokenCode } or null if fully booked.
 */
async function getNextQueueSlot(doctor, dateStr) {
  // Normalise to start-of-day UTC
  const dateStart = new Date(dateStr)
  dateStart.setUTCHours(0, 0, 0, 0)
  const dateEnd = new Date(dateStart)
  dateEnd.setUTCDate(dateEnd.getUTCDate() + 1)

  const maxPatients = calcMaxPatients(doctor)

  // Fetch all active bookings for that doctor on that day
  const existing = await Appointment.find({
    doctorId: doctor._id,
    date: { $gte: dateStart, $lt: dateEnd },
    status: { $nin: ['cancelled'] }
  }).sort({ queueNumber: 1 })

  if (existing.length >= maxPatients) return null // Fully booked

  const nextQueue = existing.length + 1

  // Estimated start = workingHours.start + (queueNumber-1) * minutesPerPatient
  const startMin = timeToMinutes(doctor.workingHours.start)
  const estMin = startMin + (nextQueue - 1) * doctor.minutesPerPatient
  const estimatedTime = minutesToTime(estMin)

  // Token code: A-01, A-02, ... A-99, B-01 ...
  const letter = String.fromCharCode(65 + Math.floor((nextQueue - 1) / 99))
  const num = String(((nextQueue - 1) % 99) + 1).padStart(2, '0')
  const tokenCode = `${letter}-${num}`

  return { queueNumber: nextQueue, estimatedTime, tokenCode }
}

/**
 * Determine if a visit is a follow-up (patient has had a completed appointment
 * with this doctor within the doctor's followUpWindowDays).
 */
async function isFollowUpVisit(patientId, doctorId, followUpWindowDays) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - followUpWindowDays)

  const prev = await Appointment.findOne({
    patientId,
    doctorId,
    status: 'completed',
    completedAt: { $gte: cutoff }
  })
  return !!prev
}

/**
 * Get all available queue slots remaining for a doctor on a date.
 * Returns array of { queueNumber, estimatedTime, tokenCode, estimatedTime12h }.
 */
async function getAvailableSlots(doctor, dateStr) {
  const dateStart = new Date(dateStr)
  dateStart.setUTCHours(0, 0, 0, 0)
  const dateEnd = new Date(dateStart)
  dateEnd.setUTCDate(dateEnd.getUTCDate() + 1)

  const maxPatients = calcMaxPatients(doctor)

  const existing = await Appointment.find({
    doctorId: doctor._id,
    date: { $gte: dateStart, $lt: dateEnd },
    status: { $nin: ['cancelled'] }
  }).select('queueNumber')

  const bookedNumbers = new Set(existing.map((a) => a.queueNumber))
  const startMin = timeToMinutes(doctor.workingHours.start)
  const slots = []

  for (let q = 1; q <= maxPatients; q++) {
    if (bookedNumbers.has(q)) continue
    const estMin = startMin + (q - 1) * doctor.minutesPerPatient
    const estimatedTime = minutesToTime(estMin)
    const letter = String.fromCharCode(65 + Math.floor((q - 1) / 99))
    const num = String(((q - 1) % 99) + 1).padStart(2, '0')
    slots.push({
      queueNumber: q,
      estimatedTime,
      estimatedTime12h: formatTime12h(estimatedTime),
      tokenCode: `${letter}-${num}`
    })
  }
  return slots
}

module.exports = {
  calcMaxPatients,
  getNextQueueSlot,
  getAvailableSlots,
  isFollowUpVisit,
  timeToMinutes,
  minutesToTime,
  formatTime12h
}
