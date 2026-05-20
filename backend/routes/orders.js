import express from 'express'
import Order from '../models/Order.js'
import protect from '../middleware/auth.js'

const router = express.Router()

// POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { items, address, phone, total, paymentMethod } = req.body
    const order = await Order.create({
      user: req.user._id, items, address, phone, total, paymentMethod
    })
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/orders/mine
router.get('/mine', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
