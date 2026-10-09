import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle, UtensilsCrossed, ShieldCheck, Sparkles } from 'lucide-react'
import { useLang } from '../i18n.jsx'
import { useApp } from '../store.jsx'
import Logo from '../components/Logo.jsx'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from || '/'
  const { t } = useLang()
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

  const handleDemoDonor = async () => {
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
        setDone('Signed in as Rohan Sharma (Demo Donor)')
        setTimeout(() => navigate(destination), 500)
      } else {
        setError(res?.error || 'Demo login failed.')
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
          setTimeout(() => navigate(destination), 500)
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
        setError('Please enter your name or contact person name.')
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
          setDone('Donor account registered successfully!')
          setTimeout(() => navigate(destination), 600)
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
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-green-700 transition">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <Link to="/" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="font-display text-lg font-black text-slate-900">
              Food<span className="text-green-600">ResQ</span>
            </span>
          </Link>
          <div className="w-16" />
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="card-dark border border-slate-200 bg-white p-6 sm:p-8 rounded-3xl shadow-lg shadow-slate-200/50">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600 mb-3 border border-green-200/60 shadow-xs">
                <UtensilsCrossed size={22} />
              </div>
              <h1 className="font-display text-2xl font-black text-slate-900 sm:text-3xl">
                {tab === 'login' ? 'Welcome Back' : 'Join as Food Provider'}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {tab === 'login'
                  ? 'Sign in to post surplus food or view your listings'
                  : 'Register your restaurant, banquet hall, or community kitchen'}
              </p>
            </div>

            {/* Segmented Switcher */}
            <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5 mb-6 text-xs sm:text-sm font-bold text-slate-600">
              <button
                type="button"
                onClick={() => {
                  setTab('login')
                  setError('')
                  setDone('')
                }}
                className={`rounded-xl py-2.5 transition cursor-pointer ${
                  tab === 'login' ? 'bg-white text-slate-900 shadow-xs font-extrabold' : 'hover:text-slate-900'
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
                className={`rounded-xl py-2.5 transition cursor-pointer ${
                  tab === 'donor' ? 'bg-white text-green-700 shadow-xs font-extrabold' : 'hover:text-slate-900'
                }`}
              >
                Donor Register
              </button>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-700">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {done && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50/80 p-3.5 text-xs text-green-800">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{done}</span>
              </div>
            )}

            {/* 1-Click Demo Button */}
            {tab === 'login' && (
              <div className="mb-5">
                <button
                  type="button"
                  onClick={handleDemoDonor}
                  disabled={loading}
                  className="w-full flex items-center justify-between rounded-xl border border-green-300 bg-green-50/70 p-3 text-left transition hover:bg-green-100/60 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-600 text-white font-bold text-xs">
                      ⚡
                    </span>
                    <div>
                      <div className="text-xs font-bold text-green-900">1-Click Demo Donor Login</div>
                      <div className="text-[11px] text-green-700 font-mono">donor@foodresq.org / password123</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-700">Instant Demo →</span>
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'donor' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Representative / Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rohan Sharma"
                      value={form.name}
                      onChange={set('name')}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Restaurant / Banquet / Entity Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Bikanervala or Home Cook"
                      value={form.orgName}
                      onChange={set('orgName')}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={set('phone')}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">City</label>
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
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="donor@foodresq.org"
                  value={form.email}
                  onChange={set('email')}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={set('password')}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
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
                className="btn-brand w-full py-3.5 text-sm mt-2 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : tab === 'login' ? (
                  <span>Sign In as Food Provider</span>
                ) : (
                  <span>Register Food Provider Account</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        © 2026 FoodResQ Platform • Secured with MongoDB Atlas
      </footer>
    </div>
  )
}
