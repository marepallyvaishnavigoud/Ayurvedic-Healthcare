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

// POST /api/auth/google  (handles both ID token and access-token profile flows)
router.post('/google', async (req, res) => {
  try {
    let googleId, email, name, picture

    if (req.body.token) {
      // ── ID token flow (credential from GoogleLogin component) ──
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
      const ticket = await client.verifyIdToken({
        idToken: req.body.token,
        audience: process.env.GOOGLE_CLIENT_ID,
      })
      const payload = ticket.getPayload()
      if (!payload) return res.status(401).json({ message: 'Invalid Google token' });
      ({ sub: googleId, email, name = '', picture = '' } = payload)
    } else {
      // ── Access token flow (profile fetched client-side via userinfo API) ──
      ;({ googleId, email, name = '', picture = '' } = req.body)
    }

    if (!googleId || !email)
      return res.status(401).json({ message: 'Google account missing required fields' })

    // 1. Try to find by googleId (returning Google user)
    let user = await User.findOne({ googleId })

    if (!user) {
      // 2. Try to find by email (existing local/password account with the same email)
      user = await User.findOne({ email })

      if (user) {
        // Existing local account — link it to this Google identity
        user.googleId = googleId
        user.profilePicture = user.profilePicture || picture
        user.authProvider = user.authProvider === 'local' ? 'local' : 'google'
        await user.save()
      } else {
        // 3. Brand-new user — create the record
        user = await User.create({
          name,
          email,
          googleId,
          profilePicture: picture,
          authProvider: 'google',
        })
      }
    } else {
      // Returning Google user — keep profile picture fresh
      user.profilePicture = picture || user.profilePicture
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
