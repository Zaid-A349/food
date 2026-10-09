import express from 'express'
import FoodPost from '../models/FoodPost.js'

const router = express.Router()

// Get all active, unexpired food posts
router.get('/', async (req, res) => {
  try {
    const now = new Date()
    const posts = await FoodPost.find({
      expiresAt: { $gt: now },
      status: { $ne: 'completed' },
    }).sort({ createdAt: -1 })

    const formatted = posts.map((p) => ({
      id: p._id.toString(),
      _id: p._id.toString(),
      food: p.food,
      qty: p.qty,
      note: p.note,
      address: p.address,
      lat: p.lat,
      lng: p.lng,
      mins: p.mins,
      donor: p.donor,
      donorEmail: p.donorEmail,
      donorPhone: p.donorPhone,
      status: p.status,
      claimedBy: p.claimedBy,
      expiresAt: new Date(p.expiresAt).getTime(),
      createdAt: new Date(p.createdAt).getTime(),
    }))

    return res.json({ ok: true, posts: formatted })
  } catch (error) {
    console.error('Fetch posts error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

// Create a new surplus food post (Food Provider / Donor)
router.post('/', async (req, res) => {
  try {
    const { food, qty, note = '', address, lat, lng, mins = 60, donor, donorEmail = '', donorPhone = '' } = req.body

    if (!food || !qty || !address || lat === undefined || lng === undefined || !donor) {
      return res.status(400).json({ ok: false, error: 'Please provide food, quantity, address, coordinates, and donor name.' })
    }

    const durationMins = Number(mins) || 60
    const expiresAt = new Date(Date.now() + durationMins * 60000)

    const post = new FoodPost({
      food,
      qty,
      note,
      address,
      lat: Number(lat),
      lng: Number(lng),
      mins: durationMins,
      donor,
      donorEmail,
      donorPhone,
      status: 'available',
      expiresAt,
    })

    await post.save()

    const formatted = {
      id: post._id.toString(),
      _id: post._id.toString(),
      food: post.food,
      qty: post.qty,
      note: post.note,
      address: post.address,
      lat: post.lat,
      lng: post.lng,
      mins: post.mins,
      donor: post.donor,
      donorEmail: post.donorEmail,
      donorPhone: post.donorPhone,
      status: post.status,
      claimedBy: post.claimedBy,
      expiresAt: new Date(post.expiresAt).getTime(),
      createdAt: new Date(post.createdAt).getTime(),
    }

    return res.status(201).json({ ok: true, post: formatted })
  } catch (error) {
    console.error('Create post error:', error)
    return res.status(500).json({ ok: false, error: error.message })
  }
})

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const post = await FoodPost.findByIdAndDelete(id)
    if (!post) {
      return res.status(404).json({ ok: false, error: 'Food post not found' })
    }
    return res.json({ ok: true, message: 'Post deleted successfully' })
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message })
  }
})

export default router
