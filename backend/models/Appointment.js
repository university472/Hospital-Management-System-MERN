// const mongoose = require('mongoose');

// const appointmentSchema = new mongoose.Schema({
//   patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
//   date: { type: Date, required: true },
//   time: { type: String, required: true },
//   reason: { type: String, required: true },
//   status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' }
// }, { timestamps: true });

// const Appointment = mongoose.model('Appointment', appointmentSchema);

// module.exports = Appointment;

const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true
    },

    date: { type: Date, required: true },
    time: { type: String, required: true }, // "HH:MM" 24-h
    reason: { type: String, required: true, trim: true },

    // ── Queue / token system ─────────────────────────────────────────────
    queueNumber: { type: Number }, // position for that doctor on that date (1-based)
    estimatedTime: { type: String }, // "HH:MM" 24-h — computed on booking
    tokenCode: { type: String }, // short display code, e.g. "A-07"

    // ── Status ───────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: [
        'scheduled',
        'waiting',
        'in-progress',
        'completed',
        'cancelled',
        'no-show'
      ],
      default: 'scheduled'
    },

    // ── Visit type / billing ─────────────────────────────────────────────
    visitType: { type: String, enum: ['new', 'follow-up'], default: 'new' },
    discountApplied: { type: Number, default: 0 }, // percentage
    isFree: { type: Boolean, default: false },

    // ── Uploaded reports by the patient ──────────────────────────────────
    reports: [
      {
        filename: { type: String },
        originalName: { type: String },
        mimetype: { type: String },
        size: { type: Number },
        uploadedAt: { type: Date, default: Date.now },
        url: { type: String } // relative path or S3 URL
      }
    ],

    // ── Doctor notes added during/after consultation ──────────────────────
    doctorNotes: { type: String, default: '' },

    checkedInAt: { type: Date },
    completedAt: { type: Date }
  },
  { timestamps: true }
)

// Compound index: fast lookup by doctor + date
appointmentSchema.index({ doctorId: 1, date: 1, queueNumber: 1 })
appointmentSchema.index({ patientId: 1, date: -1 })

const Appointment = mongoose.model('Appointment', appointmentSchema)
module.exports = Appointment
