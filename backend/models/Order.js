import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
  name:     String,
  img:      String,
  price:    Number,
  qty:      Number,
})

const orderSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items:    [orderItemSchema],
  address:  { type: String, required: true },
  phone:    { type: String, required: true },
  total:    { type: Number, required: true },
  status:   { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  paymentMethod: { type: String, default: 'COD' },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
