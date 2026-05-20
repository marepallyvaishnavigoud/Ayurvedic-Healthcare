import mongoose from 'mongoose'

const medicineSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  desc:     { type: String, required: true },
  price:    { type: Number, required: true },
  original: { type: Number, required: true },
  tag:      { type: String, default: null },
  img:      { type: String, required: true },
  category: { type: String, default: 'General' },
  inStock:  { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Medicine', medicineSchema)
