import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle, UtensilsCrossed } from 'lucide-react'
import { useApp } from '../store.jsx'
import Logo from '../components/Logo.jsx'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from || '/'
  const { login, register, loginDemo } = useApp()

  const [tab, setTab] = useState('login') // 'login' | 'donor'
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    orgName: '',
    city: 'Meerut',
  })

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setError('')
  }

  const handleUseDemo = async () => {
    setError('')
    setLoading(true)
    try {
      setForm((prev) => ({
        ...prev,
        email: 'donor@foodresq.org',
        password: 'password123',
      }))
      const res = await loginDemo()
      if (res && res.ok) {
        setDone('Signed in as Rohan Sharma')
        setTimeout(() => navigate(destination), 400)
      } else {
        setError(res?.error || 'Could not sign in.')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setDone('')

    if (tab === 'login') {
      if (!form.email || !form.password) {
        setError('Please enter your email and password.')
        return
      }
      setLoading(true)
      try {
        const res = await login(form.email, form.password)
        if (res.ok) {
          setDone('Welcome back!')
          setTimeout(() => navigate(destination), 400)
        } else {
          setError(res.error || 'Invalid email or password.')
        }
      } catch {
        setError('Could not connect to authentication server.')
      } finally {
        setLoading(false)
      }
    } else {
      // Donor Registration
      if (!form.name.trim()) {
        setError('Please enter your name.')
        return
      }
      if (!form.email.trim() || !form.email.includes('@')) {
        setError('Please enter a valid email address.')
        return
      }
      if (form.password.length < 4) {
        setError('Password must be at least 4 characters.')
        return
      }

      setLoading(true)
      try {
        const res = await register(form.name, form.email, form.password, {
          role: 'donor',
          organization: form.orgName,
          phone: form.phone,
          city: form.city,
        })
        if (res.ok) {
          setDone('Account registered successfully!')
          setTimeout(() => navigate(destination), 500)
        } else {
          setError(res.error || 'Registration failed.')
        }
      } catch {
        setError('Could not connect to authentication server.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between">
      {/* Top Bar */}
      <header className="border-b border-slate-200 bg-white/95 sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-green-700 transition">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-display text-lg font-extrabold text-slate-900">
              Food<span className="text-green-600">ResQ</span>
            </span>
          </Link>
          <div className="w-16" />
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="card-dark border border-slate-200 bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700 mb-3 border border-green-200">
                <UtensilsCrossed size={20} />
              </div>
              <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                {tab === 'login' ? 'Welcome Back' : 'Register as Food Donor'}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {tab === 'login'
                  ? 'Sign in to publish or manage surplus food listings'
                  : 'Register your restaurant, kitchen, or catering service'}
              </p>
            </div>

            {/* Segmented Switcher */}
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 mb-6 text-xs sm:text-sm font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => {
                  setTab('login')
                  setError('')
                  setDone('')
                }}
                className={`rounded-lg py-2 transition cursor-pointer ${
                  tab === 'login' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('donor')
                  setError('')
                  setDone('')
                }}
                className={`rounded-lg py-2 transition cursor-pointer ${
                  tab === 'donor' ? 'bg-white text-green-700 shadow-xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Donor Register
              </button>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {done && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-800">
                <CheckCircle2 size={15} className="shrink-0" />
                <span>{done}</span>
              </div>
            )}

            {/* Demo Helper */}
            {tab === 'login' && (
              <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-700">Test Account: </span>
                  <span className="font-mono text-slate-500">donor@foodresq.org</span>
                </div>
                <button
                  type="button"
                  onClick={handleUseDemo}
                  disabled={loading}
                  className="font-bold text-green-700 hover:text-green-800 cursor-pointer"
                >
                  Quick Sign In
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'donor' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Sharma"
                      value={form.name}
                      onChange={set('name')}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Restaurant Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Bikanervala or Home Cook"
                      value={form.orgName}
                      onChange={set('orgName')}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={form.phone}
                        onChange={set('phone')}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={set('city')}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-green-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="donor@foodresq.org"
                  value={form.email}
                  onChange={set('email')}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set('password')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-brand w-full py-3 text-sm font-bold mt-2 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : tab === 'login' ? (
                  <span>Sign In</span>
                ) : (
                  <span>Register Account</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        © 2026 FoodResQ Platform. All rights reserved.
      </footer>
    </div>
  )
}
