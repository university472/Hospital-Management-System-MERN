const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set.')
  process.exit(1)
}

// ── Core token verifier ──────────────────────────────────────────────────────
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.replace('Bearer ', '').trim()
  if (!token) return res.status(401).json({ error: 'No token provided' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'hms-api'
    })
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ error: 'Token expired. Please log in again.' })
    }
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// ── Role guard factory ────────────────────────────────────────────────────────
const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'Access denied: insufficient permissions' })
    }
    next()
  }

// ── Ownership guard: patient can only access their own data ───────────────────
const requireOwnership =
  (paramKey = 'id') =>
  (req, res, next) => {
    if (req.user.role === 'admin' || req.user.role === 'doctor') return next()
    if (req.params[paramKey] && req.params[paramKey] !== req.user.id) {
      return res.status(403).json({ error: 'Access denied: not your resource' })
    }
    next()
  }

module.exports = { auth, requireRole, requireOwnership }
