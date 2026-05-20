import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name:    String,
  rating:  { type: Number, min: 1, max: 5 },
  comment: String,
}, { timestamps: true })

const doctorSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  specialty:   { type: String, required: true },
  experience:  { type: String, required: true },
  rating:      { type: Number, default: 4.8 },
  patients:    { type: String, default: '1k+' },
  fee:         { type: Number, default: 500 },
  img:         { type: String, required: true },
  about:       { type: String, default: '' },
  education:   { type: String, default: '' },
  languages:   [String],
  timings:     [String],
  reviews:     [reviewSchema],
}, { timestamps: true })

export default mongoose.model('Doctor', doctorSchema)
