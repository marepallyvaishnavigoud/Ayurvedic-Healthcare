import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRouter from './routes/auth.js'
import doctorsRouter from './routes/doctors.js'
import medicinesRouter from './routes/medicines.js'
import treatmentsRouter from './routes/treatments.js'
import appointmentsRouter from './routes/appointments.js'
import ordersRouter from './routes/orders.js'
import treatmentBookingsRouter from './routes/treatmentBookings.js'
import aiRouter from './routes/ai.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true)
    const allowed = [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.FRONTEND_URL,
    ].filter(Boolean)
    if (allowed.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true)
    }
    return callback(null, true) // allow all during initial deployment
  },
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/doctors', doctorsRouter)
app.use('/api/medicines', medicinesRouter)
app.use('/api/treatments', treatmentsRouter)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/treatment-bookings', treatmentBookingsRouter)
app.use('/api/ai', aiRouter)

app.get('/', (req, res) => res.send('AyurCare Backend Running ✅'))

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
