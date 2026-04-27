const mongoose = require('mongoose')

/**
 * Prescription.js
 *
 * Stores medication prescriptions issued by a doctor for a patient.
 * The `active` flag lets doctors deactivate old prescriptions without deleting them.
 * The `notes` field holds dosage instructions, warnings, or other free-text guidance.
 */
const prescriptionSchema = new mongoose.Schema(
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
    medication: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    frequency: { type: String, required: true, trim: true },

    // Optional free-text field (instructions, warnings, etc.)
    notes: { type: String, default: '', trim: true },

    // Soft-disable old prescriptions instead of deleting them
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
)

// Fast lookups by patient or doctor
prescriptionSchema.index({ patientId: 1, createdAt: -1 })
prescriptionSchema.index({ doctorId: 1, patientId: 1 })

const Prescription = mongoose.model('Prescription', prescriptionSchema)
module.exports = Prescription