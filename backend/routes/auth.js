import express from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import { OAuth2Client } from 'google-auth-library'


const router = express.Router()

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already registered' })
    const user = await User.create({ name, email, password })
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      token: generateToken(user._id)
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' })
    res.json({
      _id: user._id, name: user.name, email: user.email,
      token: generateToken(user._id)
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'No account found with this email' })

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const token = crypto.createHash('sha256').update(otp).digest('hex')

    user.resetPasswordToken = token
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000 // 15 minutes
    await user.save()

    // In production you'd send email — here we return OTP directly
    res.json({ message: 'OTP generated successfully', otp, email })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: 'All fields required' })
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const token = crypto.createHash('sha256').update(otp).digest('hex')
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' })

    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.json({ message: 'Password reset successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/google
// Body: { token } where token is Google Identity token (id_token)
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body
    if (!token) return res.status(400).json({ message: 'Google token is required' })

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)


    // Verify token and extract user info
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) return res.status(401).json({ message: 'Invalid Google token' })

    const googleId = payload.sub
    const email = payload.email
    const name = payload.name || ''
    const picture = payload.picture || ''

    if (!googleId || !email)
      return res.status(401).json({ message: 'Google token missing required fields' })

    // Find existing user by googleId.
    // If it doesn't exist, create a new Google user.
    // (We intentionally do NOT auto-link local email/password accounts.)
    let user = await User.findOne({ googleId })

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture,
        authProvider: 'google',
        // password left undefined
      })
    } else {
      // Ensure fields are up to date
      user.googleId = user.googleId || googleId
      user.profilePicture = picture || user.profilePicture
      user.authProvider = user.authProvider || 'google'
      user.email = user.email || email
      user.name = user.name || name
      await user.save()
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      authProvider: user.authProvider,
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(401).json({ message: err?.message || 'Google authentication failed' })
  }
})

export default router
