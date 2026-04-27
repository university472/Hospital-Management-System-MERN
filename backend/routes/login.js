// /**
//  * routes/login.js — updated
//  * Blocks login for deactivated doctor accounts.
//  * Supports email OR phone for patients.
//  */

// const express = require('express')
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const { body, validationResult } = require('express-validator')

// const User = require('../models/User')
// const Doctor = require('../models/Doctor')
// const Admin = require('../models/Admin')
// const { authLimiter } = require('../middleware/security')

// const router = express.Router()
// const JWT_SECRET = process.env.JWT_SECRET

// const loginValidation = [
//   body('identifier')
//     .trim()
//     .notEmpty()
//     .withMessage('Email or phone number is required'),
//   body('password').isLength({ min: 1 }).withMessage('Password is required'),
//   body('role')
//     .isIn(['patient', 'doctor', 'admin'])
//     .withMessage('Invalid role selected')
// ]

// router.post('/', authLimiter, loginValidation, async (req, res) => {
//   const errors = validationResult(req)
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ error: errors.array()[0].msg })
//   }

//   const { identifier, password, role } = req.body

//   try {
//     let user = null

//     if (role === 'doctor') {
//       user = await Doctor.findOne({ email: identifier.toLowerCase() }).select(
//         '+password'
//       )
//       // Block deactivated doctors before password check (still generic error)
//       if (user && user.isActive === false) {
//         return res.status(401).json({ error: 'Invalid credentials' })
//       }
//     } else if (role === 'admin') {
//       user = await Admin.findOne({ email: identifier.toLowerCase() }).select(
//         '+password'
//       )
//     } else {
//       const isPhone = /^(\+|0092|0)[0-9]+$/.test(identifier.replace(/\s/g, ''))
//       if (isPhone) {
//         let phone = identifier.trim().replace(/\s+/g, '')
//         if (phone.startsWith('0092')) phone = '+92' + phone.slice(4)
//         else if (phone.startsWith('92') && !phone.startsWith('+'))
//           phone = '+' + phone
//         else if (phone.startsWith('0')) phone = '+92' + phone.slice(1)
//         else if (!phone.startsWith('+')) phone = '+92' + phone
//         user = await User.findOne({ phone, role: 'patient' }).select(
//           '+password'
//         )
//       } else {
//         user = await User.findOne({
//           email: identifier.toLowerCase(),
//           role: 'patient'
//         }).select('+password')
//       }
//     }

//     if (!user) return res.status(401).json({ error: 'Invalid credentials' })

//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })

//     const token = jwt.sign(
//       { id: user._id.toString(), role: user.role },
//       JWT_SECRET,
//       { expiresIn: '8h', algorithm: 'HS256', issuer: 'hms-api' }
//     )

//     res.json({ token, role: user.role })
//   } catch (err) {
//     console.error('Login error:', err)
//     res.status(500).json({ error: 'Server error' })
//   }
// })

// module.exports = router

/**
 * routes/login.js — updated
 * Blocks login for deactivated doctor accounts.
 * Supports email OR phone for patients.
 */

const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')

const User = require('../models/User')
const Doctor = require('../models/Doctor')
const Admin = require('../models/Admin')
const { authLimiter } = require('../middleware/security')

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

const loginValidation = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Email or phone number is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
  body('role')
    .isIn(['patient', 'doctor', 'admin'])
    .withMessage('Invalid role selected')
]

router.post('/', authLimiter, loginValidation, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg })
  }

  const { identifier, password, role } = req.body

  try {
    let user = null

    if (role === 'doctor') {
      user = await Doctor.findOne({ email: identifier.toLowerCase() }).select(
        '+password'
      )
      // Block deactivated doctors before password check (still generic error)
      if (user && user.isActive === false) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }
    } else if (role === 'admin') {
      user = await Admin.findOne({ email: identifier.toLowerCase() }).select(
        '+password'
      )
    } else {
      const isPhone = /^(\+|0092|0)[0-9]+$/.test(identifier.replace(/\s/g, ''))
      if (isPhone) {
        let phone = identifier.trim().replace(/\s+/g, '')
        if (phone.startsWith('0092')) phone = '+92' + phone.slice(4)
        else if (phone.startsWith('92') && !phone.startsWith('+'))
          phone = '+' + phone
        else if (phone.startsWith('0')) phone = '+92' + phone.slice(1)
        else if (!phone.startsWith('+')) phone = '+92' + phone
        user = await User.findOne({ phone, role: 'patient' }).select(
          '+password'
        )
      } else {
        user = await User.findOne({
          email: identifier.toLowerCase(),
          role: 'patient'
        }).select('+password')
      }
    }

    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: '8h', algorithm: 'HS256', issuer: 'hms-api' }
    )

    res.json({ token, role: user.role })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
