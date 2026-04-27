/**
 * models/Doctor.js — updated with isActive field
 *
 * isActive: false = doctor deactivated by admin.
 * The auth middleware must check this field on login.
 * See updated login.js below for the check.
 */

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const doctorSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true, minlength: 8 },
    specialty: { type: String, required: true },
    licenseNumber: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    role: { type: String, default: 'doctor' },

    // ── Active status (admin can deactivate) ─────────────────────────────
    isActive: { type: Boolean, default: true },

    // ── Queue / scheduling settings ──────────────────────────────────────
    workingHours: {
      start: { type: String, default: '10:00' },
      end: { type: String, default: '17:00' }
    },
    minutesPerPatient: { type: Number, default: 30, min: 5, max: 120 },
    maxPatientsPerDay: { type: Number, default: 14 },

    // ── Follow-up policy ─────────────────────────────────────────────────
    followUpDiscountPercent: { type: Number, default: 0, min: 0, max: 100 },
    followUpFree: { type: Boolean, default: false },
    followUpWindowDays: { type: Number, default: 30 }
  },
  { timestamps: true }
)

doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

doctorSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

const Doctor = mongoose.model('Doctor', doctorSchema)
module.exports = Doctor
