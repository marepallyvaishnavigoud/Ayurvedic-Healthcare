import mongoose from 'mongoose'

const treatmentBookingSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  treatment:   { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment', required: true },
  date:        { type: String, required: true },
  timeSlot:    { type: String, required: true },
  patientName: { type: String, required: true },
  patientPhone:{ type: String, required: true },
  center:      { type: String, default: 'AyurCare Main Center' },
  status:      { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Confirmed' },
  price:       { type: Number, required: true },
  // Store selected image explicitly so booking UI can match the Treatments page
  treatmentImg:{ type: String },
}, { timestamps: true })


export default mongoose.model('TreatmentBooking', treatmentBookingSchema)
