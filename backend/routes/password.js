/**
 * routes/password.js
 *
 * Password change for all three roles.
 * POST /api/password/change
 *
 * Requires valid JWT. User confirms old password, sets new one.
 * The model is identified from req.user.role injected by auth middleware.
 *
 * No password reset / forgot-password flow here — add that separately
 * with a time-limited token sent to email/phone when needed.
 */

const express = require('express')
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator')

const User = require('../models/User')
const Doctor = require('../models/Doctor')
const Admin = require('../models/Admin')
const { auth } = require('../middleware/auth')
const { authLimiter } = require('../middleware/security')

const router = express.Router()

const validation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('New password must contain an uppercase letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain a number'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Please confirm your new password')
]

// POST /api/password/change
router.post('/change', auth, authLimiter, validation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg })
  }

  const { currentPassword, newPassword, confirmPassword } = req.body

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match' })
  }
  if (currentPassword === newPassword) {
    return res
      .status(400)
      .json({ error: 'New password must be different from current password' })
  }

  try {
    // Load the correct model based on role
    let user
    if (req.user.role === 'doctor') {
      user = await Doctor.findById(req.user.id).select('+password')
    } else if (req.user.role === 'admin') {
      user = await Admin.findById(req.user.id).select('+password')
    } else {
      user = await User.findById(req.user.id).select('+password')
    }

    if (!user) return res.status(404).json({ error: 'Account not found' })

    // Verify old password — same generic error to avoid info leakage
    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    // Hash and save
    user.password = newPassword // pre-save hook re-hashes
    user.markModified('password')
    await user.save()

    res.json({
      message:
        'Password changed successfully. Please log in again with your new password.'
    })
  } catch (err) {
    console.error('Password change error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
