const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

/**
 * User.js (Patient model)
 *
 * CHANGE: Patients can register with either email OR phone number.
 * At least one of `email` or `phone` is required.
 * The unique index is conditional — email is unique when provided,
 * phone is unique when provided.
 *
 * Login: patient submits whichever they registered with.
 * JWT payload still uses `id` and `role`.
 */
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    // Either email or phone is required (validated in pre-save hook below)
    email: {
      type: String,
      sparse: true, // allows multiple null values in unique index
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      sparse: true, // allows multiple null values in unique index
      unique: true,
      trim: true
    },

    password: { type: String, required: true, minlength: 8 },
    role: { type: String, required: true, default: 'patient' },

    // ── Patient medical profile ──────────────────────────────────────────
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other', ''] },
    bloodGroup: { type: String },
    address: { type: String },
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String }
    }
  },
  { timestamps: true }
)

// ── Validation: require at least one of email or phone ────────────────────────
userSchema.pre('validate', function (next) {
  if (!this.email && !this.phone) {
    return next(new Error('At least one of email or phone number is required'))
  }
  next()
})

// ── Hash password before save ─────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ── Strip password from JSON responses ───────────────────────────────────────
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

const User = mongoose.model('User', userSchema)
module.exports = User
