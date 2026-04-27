const mongoose = require('mongoose')

const medicalRecordSchema = new mongoose.Schema(
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
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },

    visitDate: { type: Date, required: true, default: Date.now },
    visitType: { type: String, enum: ['new', 'follow-up'], default: 'new' },
    chiefComplaint: { type: String },
    diagnosis: { type: String },
    treatment: { type: String },
    notes: { type: String },

    vitalSigns: {
      bloodPressure: { type: String },
      heartRate: { type: Number },
      temperature: { type: Number },
      weight: { type: Number },
      height: { type: Number },
      oxygenSaturation: { type: Number }
    },

    // Files uploaded by patient OR doctor for this visit
    attachments: [
      {
        filename: { type: String, required: true },
        originalName: { type: String },
        mimetype: { type: String },
        size: { type: Number },
        uploadedBy: { type: String, enum: ['patient', 'doctor'] },
        uploadedAt: { type: Date, default: Date.now },
        url: { type: String, required: true }
      }
    ]
  },
  { timestamps: true }
)

medicalRecordSchema.index({ patientId: 1, visitDate: -1 })
medicalRecordSchema.index({ doctorId: 1, patientId: 1 })

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema)
module.exports = MedicalRecord
