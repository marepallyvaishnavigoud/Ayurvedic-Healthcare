import express from 'express'
import Appointment from '../models/Appointment.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/', protect, async (req, res) => {
  try {
    const { doctor, date, timeSlot, patientName, patientAge, patientPhone, concern, fee } = req.body
    const appt = await Appointment.create({
      user: req.user._id, doctor, date, timeSlot,
      patientName, patientAge, patientPhone, concern, fee
    })
    const populated = await appt.populate('doctor', 'name specialty img fee')
    res.status(201).json(populated)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.get('/mine', protect, async (req, res) => {
  try {
    const appts = await Appointment.find({ user: req.user._id })
      .populate('doctor', 'name specialty img fee')
      .sort({ createdAt: -1 })
    res.json(appts)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id)
    if (!appt) return res.status(404).json({ message: 'Not found' })
    if (appt.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' })
    appt.status = 'Cancelled'
    await appt.save()
    res.json({ message: 'Appointment cancelled' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

export default router
