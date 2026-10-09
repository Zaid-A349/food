const BASE_URL = '' // Uses Vite proxy in development

export const api = {
  // Posts
  async getPosts() {
    try {
      const res = await fetch(`${BASE_URL}/api/posts`)
      if (!res.ok) throw new Error('Failed to fetch posts')
      const data = await res.json()
      return data.posts || []
    } catch (err) {
      console.warn('[FoodResQ API] Using fallback/local posts:', err.message)
      return null
    }
  },

  async createPost(post) {
    try {
      const res = await fetch(`${BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Failed to create post')
      return data.post
    } catch (err) {
      console.warn('[FoodResQ API] Error creating post on server:', err.message)
      return null
    }
  },

  async deletePost(id) {
    try {
      const res = await fetch(`${BASE_URL}/api/posts/${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      return data.ok
    } catch (err) {
      console.warn('[FoodResQ API] Error deleting post on server:', err.message)
      return false
    }
  },

  // Auth
  async register(name, email, password, extra = {}) {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, ...extra }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error || 'Registration failed' }
      }
      return { ok: true, user: data.user }
    } catch (err) {
      console.error('[FoodResQ API] Backend unavailable for registration:', err.message)
      return { ok: false, error: 'Could not connect to database server. Please ensure the server is running on port 5000.' }
    }
  },

  async login(email, password) {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error || 'Login failed' }
      }
      return { ok: true, user: data.user }
    } catch (err) {
      console.warn('[FoodResQ API] Backend unavailable for login:', err.message)
      return null
    }
  },

  async loginDemo() {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.ok && data.ok) {
        return { ok: true, user: data.user }
      }
    } catch (err) {
      console.warn('[FoodResQ API] Backend demo login fallback:', err.message)
    }
    return null
  },
}
