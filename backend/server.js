// // const express = require('express')
// // const mongoose = require('mongoose')
// // const dotenv = require('dotenv')
// // const cors = require('cors') // Add this line

// // dotenv.config()

// // const app = express()
// // const PORT = process.env.PORT || 5000

// // // Middleware
// // app.use(cors())
// // app.use(express.json())

// // // MongoDB connection
// // mongoose
// //   .connect(process.env.MONGO_URI)
// //   .then(() => console.log('✅ Connected to MongoDB'))
// //   .catch((err) => console.error('❌ MongoDB connection error:', err))
// //   .then(() => console.log('Connected to MongoDB'))
// //   .catch((err) => console.error('Could not connect to MongoDB', err))

// // // Routes
// // app.use('/api/signup', require('./routes/signup'))
// // app.use('/api/login', require('./routes/login'))
// // app.use('/api/admin', require('./routes/admin'))
// // app.use('/api/doctor', require('./routes/doctor'))
// // app.use('/api/patient', require('./routes/patient'))

// // // Root route
// // app.get('/', (req, res) => {
// //   res.send('Welcome to the Hospital Management System API')
// // })

// // app.listen(PORT, () => {
// //   console.log(`Server is running on port ${PORT}`)
// // })

// require('dotenv').config()
// const dns = require('dns') // ← yeh add
// dns.setServers(['1.1.1.1', '8.8.8.8'])
// const express = require('express')
// const mongoose = require('mongoose')
// const cors = require('cors')
// const path = require('path')
// const {
//   helmetMiddleware,
//   apiLimiter,
//   sanitize,
//   xssClean
// } = require('./middleware/security')

// // ── Validate required env vars ────────────────────────────────────────────────
// const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET']
// REQUIRED_ENV.forEach((k) => {
//   if (!process.env[k]) {
//     console.error(`FATAL: ${k} not set`)
//     process.exit(1)
//   }
// })

// const app = express()
// const PORT = process.env.PORT || 5000

// // ── Security headers ──────────────────────────────────────────────────────────
// app.use(helmetMiddleware)

// // ── CORS ──────────────────────────────────────────────────────────────────────
// const allowedOrigins = (
//   process.env.ALLOWED_ORIGINS || 'http://localhost:3000'
// ).split(',')
// app.use(
//   cors({
//     origin: (origin, cb) => {
//       if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
//       cb(new Error('Not allowed by CORS'))
//     },
//     credentials: true
//   })
// )

// // ── Body parsing ──────────────────────────────────────────────────────────────
// app.use(express.json({ limit: '1mb' }))
// app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// // ── Sanitization ──────────────────────────────────────────────────────────────
// app.use(sanitize)
// app.use(xssClean)

// // ── Global rate limit ─────────────────────────────────────────────────────────
// app.use('/api/', apiLimiter)

// // ── Static uploads (serve uploaded files) ─────────────────────────────────────
// // Only authenticated users should access this in production (add auth middleware here)
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// // ── Routes ────────────────────────────────────────────────────────────────────
// app.use('/api/signup', require('./routes/signup'))
// app.use('/api/login', require('./routes/login'))
// app.use('/api/admin', require('./routes/admin'))
// app.use('/api/doctor', require('./routes/doctor'))
// app.use('/api/patient', require('./routes/patient'))
// app.use('/api/queue', require('./routes/queue'))

// // ── Root ──────────────────────────────────────────────────────────────────────
// app.get('/', (req, res) =>
//   res.json({ message: 'Hospital Management System API', status: 'running' })
// )

// // ── 404 ───────────────────────────────────────────────────────────────────────
// app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

// // ── Global error handler ──────────────────────────────────────────────────────
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err.message)
//   // Never leak stack traces to client
//   res
//     .status(err.status || 500)
//     .json({ error: err.message || 'Internal server error' })
// })

// // ── MongoDB connection ────────────────────────────────────────────────────────
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('✅ Connected to MongoDB')
//     app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
//   })
//   .catch((err) => {
//     console.error('❌ MongoDB connection error:', err)
//     process.exit(1)
//   })

// module.exports = app

require('dotenv').config()
const dns = require('dns')
dns.setServers(['1.1.1.1', '8.8.8.8'])
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const {
  helmetMiddleware,
  apiLimiter,
  sanitize,
  xssClean
} = require('./middleware/security')

const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET']
REQUIRED_ENV.forEach((k) => {
  if (!process.env[k]) {
    console.error(`FATAL: ${k} not set`)
    process.exit(1)
  }
})

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmetMiddleware)

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || 'http://localhost:3000'
).split(',')
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
      cb(new Error('Not allowed by CORS'))
    },
    credentials: true
  })
)

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(sanitize)
app.use(xssClean)
app.use('/api/', apiLimiter)

// Uploads — add auth middleware here before going to production
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/signup', require('./routes/signup'))
app.use('/api/login', require('./routes/login'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/doctor', require('./routes/doctor'))
app.use('/api/patient', require('./routes/patient'))
app.use('/api/queue', require('./routes/queue'))
app.use('/api/password', require('./routes/password')) // ← NEW

app.get('/', (req, res) =>
  res.json({ message: 'Hospital Management System API', status: 'running' })
)

app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message)
  res
    .status(err.status || 500)
    .json({ error: err.message || 'Internal server error' })
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB')
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  })

module.exports = app
