import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  // For local login this is required. For Google login it may be undefined.
  password: { type: String, default: '' },

  phone:    { type: String, default: '' },
  address:  { type: String, default: '' },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  isBlocked:{ type: Boolean, default: false },
  resetPasswordToken:   { type: String },
  resetPasswordExpires: { type: Date },

  // Google OAuth fields
  googleId: { type: String, unique: true, sparse: true },
  profilePicture: { type: String, default: '' },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  // Only hash password for local auth.
  // For Google users password may be undefined.
  if (!this.isModified('password')) return next()
  if (!this.password) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password)
}

export default mongoose.model('User', userSchema)
