import mongoose from 'mongoose'

const treatmentSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  desc:     { type: String, required: true },
  duration: { type: String, required: true },
  benefit:  { type: String, required: true },
  price:    { type: Number, default: 1500 },
  img:      { type: String, required: true },
  benefits: [String],
  procedure:[String],
  faqs:     [{ question: String, answer: String }],
}, { timestamps: true })

export default mongoose.model('Treatment', treatmentSchema)
