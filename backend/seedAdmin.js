import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'

dotenv.config()

await mongoose.connect(process.env.MONGO_URI)
console.log('✅ Connected to MongoDB')

const existing = await User.findOne({ email: 'admin@ayurcare.com' })
if (existing) {
  existing.role = 'admin'
  existing.name = 'AyurCare Admin'
  await existing.save()
  console.log('✅ Admin role updated for existing user')
} else {
  await User.create({
    name: 'AyurCare Admin',
    email: 'admin@ayurcare.com',
    password: 'Admin@123',
    role: 'admin',
  })
  console.log('✅ Admin user created')
}

console.log('📧 Email:    admin@ayurcare.com')
console.log('🔑 Password: Admin@123')

await mongoose.disconnect()
process.exit(0)
