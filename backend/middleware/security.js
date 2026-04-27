const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const fs = require('fs')

// ── Helmet headers ────────────────────────────────────────────────────────────
const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
})

// ── Rate limiters ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  message: { error: 'Too many login attempts. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
})

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 100,
  message: { error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false
})

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many file uploads. Please wait.' }
})

// ── Mongo injection sanitize ──────────────────────────────────────────────────
const sanitize = mongoSanitize({ replaceWith: '_' })

// ── XSS clean ────────────────────────────────────────────────────────────────
const xssClean = xss()

// ── File upload (multer) ──────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const ALLOWED_MIMETYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf'
]

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex')
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${uniqueSuffix}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      new Error(
        'Only images (JPEG, PNG, GIF, WebP) and PDF files are allowed.'
      ),
      false
    )
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 } // 10 MB per file, max 5 files
})

module.exports = {
  helmetMiddleware,
  authLimiter,
  apiLimiter,
  uploadLimiter,
  sanitize,
  xssClean,
  upload
}
