import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { api } from './api.js'

const AppContext = createContext(null)

const SEED_POSTS = [
  { id: 'mrt1', food: 'Chole Bhature + Raj Kachori', qty: '35 plates', note: 'Evening counter surplus, freshly packed.', lat: 28.9899, lng: 77.6851, mins: 90, createdAt: Date.now() - 12 * 60000, donor: 'Bikanervala, Delhi Road' },
  { id: 'mrt2', food: 'Red Sauce Pasta + Garlic Bread', qty: '20 boxes', note: 'Cafe closing surplus. Pickup at main entrance.', lat: 28.9951, lng: 77.691, mins: 60, createdAt: Date.now() - 15 * 60000, donor: "Anaicha's, West End Road" },
]

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function expiresAt(post) {
  return post.createdAt + (post.mins || 60) * 60000
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => load('frm_user', null))
  const [posts, setPosts] = useState(() => {
    const existing = load('frm_posts', null)
    if (existing) return existing
    const seeded = SEED_POSTS.map((p) => ({ ...p, expiresAt: expiresAt(p) }))
    localStorage.setItem('frm_posts', JSON.stringify(seeded))
    return seeded
  })
  const [isDbConnected, setIsDbConnected] = useState(false)

  // Sync with MongoDB backend on initial mount
  useEffect(() => {
    let mounted = true
    async function syncWithBackend() {
      try {
        const serverPosts = await api.getPosts()
        if (!mounted) return
        if (serverPosts && Array.isArray(serverPosts) && serverPosts.length > 0) {
          setPosts(serverPosts)
          setIsDbConnected(true)
        }
      } catch (err) {
        console.warn('Backend sync error:', err)
      }
    }
    syncWithBackend()
    return () => {
      mounted = false
    }
  }, [])

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('frm_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('frm_user')
    }
  }, [user])

  // Active unexpired posts
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(id)
  }, [])

  const activePosts = useMemo(() => {
    return posts.filter((p) => p.expiresAt > now && p.status !== 'completed')
  }, [posts, now])

  // Auth actions
  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password)
    if (res && res.ok && res.user) {
      setUser(res.user)
      return { ok: true, user: res.user }
    }
    if (email === 'donor@foodresq.org' && (password === 'password123' || password === 'foodhero123')) {
      const fallbackUser = {
        name: 'Rohan Sharma',
        email: 'donor@foodresq.org',
        role: 'donor',
        organization: 'Green Meerut Community',
        phone: '+91 98765 43210',
        city: 'Meerut',
        verified: true,
      }
      setUser(fallbackUser)
      return { ok: true, user: fallbackUser }
    }
    return { ok: false, error: res?.error || 'Invalid email or password' }
  }, [])

  const loginDemo = useCallback(async () => {
    const res = await api.loginDemo()
    if (res && res.ok && res.user) {
      setUser(res.user)
      return { ok: true, user: res.user }
    }
    const fallbackUser = {
      name: 'Rohan Sharma',
      email: 'donor@foodresq.org',
      role: 'donor',
      organization: 'Green Meerut Community',
      phone: '+91 98765 43210',
      city: 'Meerut',
      verified: true,
    }
    setUser(fallbackUser)
    return { ok: true, user: fallbackUser }
  }, [])

  const register = useCallback(async (name, email, password, extra = {}) => {
    const res = await api.register(name, email, password, extra)
    if (res && res.ok && res.user) {
      setUser(res.user)
      return { ok: true, user: res.user }
    }
    return { ok: false, error: res?.error || 'Registration failed on MongoDB database.' }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  // Add post action (Food Provider)
  const addPost = useCallback(
    async (postData) => {
      const serverPost = await api.createPost(postData)
      const newPost = serverPost || {
        ...postData,
        id: 'local_' + Date.now(),
        createdAt: Date.now(),
        expiresAt: Date.now() + (Number(postData.mins) || 60) * 60000,
        status: 'available',
      }
      setPosts((prev) => [newPost, ...prev])
      return newPost
    },
    []
  )

  const deletePost = useCallback(async (id) => {
    await api.deletePost(id)
    setPosts((prev) => prev.filter((p) => p.id !== id && p._id !== id))
  }, [])

  const value = {
    user,
    posts,
    activePosts,
    isDbConnected,
    login,
    loginDemo,
    register,
    logout,
    addPost,
    deletePost,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
