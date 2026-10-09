import FoodPost from './models/FoodPost.js'
import User from './models/User.js'

export async function seedInitialData() {
  try {
    const postCount = await FoodPost.countDocuments()
    if (postCount === 0) {
      console.log('[MongoDB Seed] Seeding initial surplus food posts in Meerut...')
      const now = Date.now()
      const initialPosts = [
        {
          food: 'Chole Bhature + Raj Kachori',
          qty: '35 plates',
          note: 'Evening counter surplus, freshly packed.',
          address: 'Bikanervala, Delhi Road, Meerut',
          lat: 28.9899,
          lng: 77.6851,
          mins: 90,
          donor: 'Bikanervala, Delhi Road',
          donorEmail: 'bikanervala.mrt@gmail.com',
          status: 'available',
          expiresAt: new Date(now + 90 * 60000),
          createdAt: new Date(now - 12 * 60000),
        },
        {
          food: 'Red Sauce Pasta + Garlic Bread',
          qty: '20 boxes',
          note: 'Cafe closing surplus. Pickup at main entrance.',
          address: "Anaicha's, West End Road, Meerut",
          lat: 28.9951,
          lng: 77.691,
          mins: 60,
          donor: "Anaicha's, West End Road",
          donorEmail: 'anaichas.cafe@gmail.com',
          status: 'available',
          expiresAt: new Date(now + 60 * 60000),
          createdAt: new Date(now - 15 * 60000),
        },
        {
          food: 'Dal Makhani, Paneer Tikka + Roti',
          qty: '60 meals',
          note: 'Wedding banquet surplus, hot & packed in trays.',
          address: 'The Grand 5, Delhi Road, Meerut',
          lat: 29.0155,
          lng: 77.6645,
          mins: 120,
          donor: 'The Grand 5, Delhi Road',
          donorEmail: 'grand5.events@gmail.com',
          status: 'available',
          expiresAt: new Date(now + 120 * 60000),
          createdAt: new Date(now - 6 * 60000),
        },
        {
          food: 'Veg Thali (Dal, Rice, Sabzi, Roti)',
          qty: '80 meals',
          note: 'Banquet function leftover, untouched.',
          address: 'Hotel Meriton, Garh Road, Meerut',
          lat: 28.996,
          lng: 77.673,
          mins: 100,
          donor: 'Hotel Meriton, Garh Road',
          donorEmail: 'meriton.banquets@gmail.com',
          status: 'available',
          expiresAt: new Date(now + 100 * 60000),
          createdAt: new Date(now - 20 * 60000),
        },
      ]
      await FoodPost.insertMany(initialPosts)
      console.log('[MongoDB Seed] Active food posts seeded.')
    }

    const donorExists = await User.findOne({ email: 'donor@foodresq.org' })
    if (!donorExists) {
      console.log('[MongoDB Seed] Seeding demo donor account...')
      await User.create({
        name: 'Rohan Sharma',
        email: 'donor@foodresq.org',
        password: 'password123',
        role: 'donor',
        phone: '+91 98765 43210',
        organization: 'Green Meerut Community',
        city: 'Meerut',
        verified: true,
      })
      console.log('[MongoDB Seed] Demo donor created: donor@foodresq.org / password123')
    }
  } catch (error) {
    console.error('[MongoDB Seed] Seeding warning:', error.message)
  }
}
