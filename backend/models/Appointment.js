import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor:    { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  date:      { type: String, required: true },
  timeSlot:  { type: String, required: true },
  patientName:  { type: String, required: true },
  patientAge:   { type: String, required: true },
  patientPhone: { type: String, required: true },
  concern:      { type: String, default: '' },
  status:    { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Confirmed' },
  fee:       { type: Number, required: true },
}, { timestamps: true })

export default mongoose.model('Appointment', appointmentSchema)
