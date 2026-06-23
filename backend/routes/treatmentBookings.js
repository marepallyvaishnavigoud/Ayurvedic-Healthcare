import express from 'express'
import TreatmentBooking from '../models/TreatmentBooking.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, async (req, res) => {
  try {
    const { treatment, date, timeSlot, patientName, patientPhone, center, price, treatmentImg } = req.body
    const booking = await TreatmentBooking.create({
      user: req.user._id, treatment, treatmentImg, date, timeSlot, patientName, patientPhone, center, price
    })
    const populated = await booking.populate('treatment', 'name img duration')
    res.status(201).json(populated)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.get('/mine', protect, async (req, res) => {
  try {
    const bookings = await TreatmentBooking.find({ user: req.user._id })
      .populate('treatment', 'name img duration benefit')
      .sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await TreatmentBooking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Not found' })
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' })
    booking.status = 'Cancelled'
    await booking.save()
    res.json({ message: 'Booking cancelled' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

export default router
