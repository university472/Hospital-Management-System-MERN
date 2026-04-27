const express = require('express')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const { authLimiter } = require('../middleware/security')

const router = express.Router()

/**
 * Signup validation:
 * - firstName and lastName are always required
 * - At least one of email or phone must be provided
 * - If email is provided, it must be valid
 * - If phone is provided, it must be a valid Pakistani/international format
 * - Password: min 8 chars, 1 uppercase, 1 number
 */
const signupValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .escape(),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .escape(),

  // Email is optional but must be valid if provided
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),

  // Phone is optional but must match a reasonable format if provided
  // Accepts: 03XXXXXXXXX, +923XXXXXXXXX, international formats
  body('phone')
    .optional({ checkFalsy: true })
    .matches(/^(\+92|0092|0)?[0-9]{10,11}$/)
    .withMessage(
      'Please enter a valid phone number (e.g. 03001234567 or +923001234567)'
    ),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
]

// POST /api/signup
router.post('/', authLimiter, signupValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg })
  }

  const { firstName, lastName, email, phone, password } = req.body

  // Must have at least one contact method
  if (!email && !phone) {
    return res
      .status(400)
      .json({ error: 'Please provide either an email address or phone number' })
  }

  try {
    // Check for duplicate email (if provided)
    if (email) {
      const existingEmail = await User.findOne({ email })
      if (existingEmail) {
        return res
          .status(400)
          .json({ error: 'This email address is already registered' })
      }
    }

    // Check for duplicate phone (if provided)
    if (phone) {
      const normalised = normalisePhone(phone)
      const existingPhone = await User.findOne({ phone: normalised })
      if (existingPhone) {
        return res
          .status(400)
          .json({ error: 'This phone number is already registered' })
      }
    }

    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email || undefined,
      phone: phone ? normalisePhone(phone) : undefined,
      password,
      role: 'patient'
    })
    await user.save()

    res.status(201).json({
      message: 'Account created successfully. Please log in.'
    })
  } catch (err) {
    if (err.code === 11000) {
      // MongoDB duplicate key
      const field = Object.keys(err.keyPattern || {})[0]
      if (field === 'email')
        return res.status(400).json({ error: 'Email already in use' })
      if (field === 'phone')
        return res.status(400).json({ error: 'Phone number already in use' })
      return res.status(400).json({ error: 'Account already exists' })
    }
    console.error('Signup error:', err)
    res.status(400).json({ error: err.message })
  }
})

/**
 * Normalise phone number to +92XXXXXXXXXX format for storage.
 * 03001234567 → +923001234567
 */
function normalisePhone(phone) {
  let p = phone.toString().trim().replace(/\s+/g, '')
  if (p.startsWith('0092')) p = '+92' + p.slice(4)
  else if (p.startsWith('92') && !p.startsWith('+')) p = '+' + p
  else if (p.startsWith('0')) p = '+92' + p.slice(1)
  else if (!p.startsWith('+')) p = '+92' + p
  return p
}

module.exports = router
