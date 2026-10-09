import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// Helper to format user payload
const formatUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role || 'donor',
  organization: user.organization || '',
  phone: user.phone || '',
  city: user.city || 'Meerut',
  darpanId: user.darpanId || '',
  capacity: user.capacity || '',
  address: user.address || '',
  verified: user.verified ?? true,
})

// Register new user (donor or individual)
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = 'donor',
      organization = '',
      phone = '',
      city = 'Meerut',
      darpanId = '',
      capacity = '',
      address = '',
    } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, error: 'Name, email, and password are required.' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return res.status(409).json({ ok: false, error: 'An account with this email already exists. Please login.' })
    }

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      organization: organization.trim(),
      phone: phone.trim(),
      city: city.trim(),
      darpanId: darpanId.trim(),
      capacity: capacity.trim(),
      address: address.trim(),
      verified: true,
    })

    await user.save()

    return res.status(201).json({
      ok: true,
      user: formatUser(user),
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ ok: false, error: error.message || 'Server error during registration.' })
  }
})

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ ok: false, error: 'Email and password are required.' })
    }

    const normalizedEmail = email.toLowerCase().trim()
    let user = await User.findOne({ email: normalizedEmail })

    // Auto-create demo donor if missing
    if (!user && normalizedEmail === 'donor@foodresq.org') {
      user = await User.create({
        name: 'Rohan Sharma',
        email: 'donor@foodresq.org',
        password: 'password123',
        role: 'donor',
        phone: '+91 98765 43210',
        organization: 'Green Meerut Community',
        city: 'Meerut',
        verified: true,
      })
    }

    if (!user) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password.' })
    }

    const isPasswordValid =
      user.password === password ||
      (normalizedEmail === 'donor@foodresq.org' && (password === 'foodhero123' || password === 'password123'))

    if (!isPasswordValid) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password.' })
    }

    return res.json({
      ok: true,
      user: formatUser(user),
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ ok: false, error: error.message || 'Server error during login.' })
  }
})

// 1-Click Demo Donor Login endpoint
router.post('/demo', async (req, res) => {
  try {
    let user = await User.findOne({ email: 'donor@foodresq.org' })
    if (!user) {
      user = await User.create({
        name: 'Rohan Sharma',
        email: 'donor@foodresq.org',
        password: 'password123',
        role: 'donor',
        phone: '+91 98765 43210',
        organization: 'Green Meerut Community',
        city: 'Meerut',
        verified: true,
      })
    }

    return res.json({
      ok: true,
      user: formatUser(user),
    })
  } catch (error) {
    console.error('Demo login error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

export default router
