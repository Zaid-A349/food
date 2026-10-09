import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB } from './db.js'
import { seedInitialData } from './seed.js'

import authRoutes from './routes/auth.js'
import postRoutes from './routes/posts.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'FoodResQ Backend API',
    database: 'MongoDB Atlas',
    timestamp: new Date(),
  })
})

// Mount API routes
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err)
  res.status(500).json({ ok: false, error: err.message || 'Internal Server Error' })
})

// Start server and connect to MongoDB
async function startServer() {
  await connectDB()
  await seedInitialData()

  app.listen(PORT, () => {
    console.log(`===============================================`)
    console.log(` FoodResQ API Server running on port ${PORT}`)
    console.log(` Health check: http://localhost:${PORT}/api/health`)
    console.log(` MongoDB: Connected to Cluster0 on Atlas`)
    console.log(`===============================================`)
  })
}

startServer()
