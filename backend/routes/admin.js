import express from 'express'
import { protect, adminOnly } from '../middleware/auth.js'
import User from '../models/User.js'
import Doctor from '../models/Doctor.js'
import Medicine from '../models/Medicine.js'
import Treatment from '../models/Treatment.js'
import Order from '../models/Order.js'
import Appointment from '../models/Appointment.js'
import TreatmentBooking from '../models/TreatmentBooking.js'

const router = express.Router()
const guard = [protect, adminOnly]

// ── DASHBOARD STATS ──────────────────────────────────────────
router.get('/stats', guard, async (req, res) => {
  try {
    const [users, doctors, medicines, treatments, orders, appointments, bookings] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Doctor.countDocuments(),
      Medicine.countDocuments(),
      Treatment.countDocuments(),
      Order.countDocuments(),
      Appointment.countDocuments(),
      TreatmentBooking.countDocuments(),
    ])
    const revenue = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(5)
    const recentAppointments = await Appointment.find().populate('user', 'name').populate('doctor', 'name').sort({ createdAt: -1 }).limit(5)
    res.json({
      users, doctors, medicines, treatments, orders, appointments, bookings,
      revenue: revenue[0]?.total || 0,
      recentOrders, recentAppointments,
    })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── ORDERS ───────────────────────────────────────────────────
router.get('/orders', guard, async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/orders/:id', guard, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('user', 'name email')
    res.json(order)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── APPOINTMENTS ─────────────────────────────────────────────
router.get('/appointments', guard, async (req, res) => {
  try {
    const appts = await Appointment.find().populate('user', 'name email').populate('doctor', 'name specialty img').sort({ createdAt: -1 })
    res.json(appts)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/appointments/:id', guard, async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('user', 'name email').populate('doctor', 'name specialty')
    res.json(appt)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── TREATMENT BOOKINGS ────────────────────────────────────────
router.get('/treatment-bookings', guard, async (req, res) => {
  try {
    const bookings = await TreatmentBooking.find().populate('user', 'name email').populate('treatment', 'name img duration').sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/treatment-bookings/:id', guard, async (req, res) => {
  try {
    const booking = await TreatmentBooking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('user', 'name email').populate('treatment', 'name')
    res.json(booking)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── USERS ─────────────────────────────────────────────────────
router.get('/users', guard, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/users/:id/block', guard, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: req.body.isBlocked }, { new: true }).select('-password')
    res.json(user)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/users/:id', guard, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── DOCTORS ───────────────────────────────────────────────────
router.post('/doctors', guard, async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body)
    res.status(201).json(doctor)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/doctors/:id', guard, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(doctor)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/doctors/:id', guard, async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id)
    res.json({ message: 'Doctor deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── MEDICINES ─────────────────────────────────────────────────
router.post('/medicines', guard, async (req, res) => {
  try {
    const med = await Medicine.create(req.body)
    res.status(201).json(med)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/medicines/:id', guard, async (req, res) => {
  try {
    const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(med)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/medicines/:id', guard, async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id)
    res.json({ message: 'Medicine deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

// ── TREATMENTS ────────────────────────────────────────────────
router.post('/treatments', guard, async (req, res) => {
  try {
    const treatment = await Treatment.create(req.body)
    res.status(201).json(treatment)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/treatments/:id', guard, async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(treatment)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/treatments/:id', guard, async (req, res) => {
  try {
    await Treatment.findByIdAndDelete(req.params.id)
    res.json({ message: 'Treatment deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

export default router
