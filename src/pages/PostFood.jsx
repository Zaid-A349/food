import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Navigation, CheckCircle2, AlertCircle, ShieldCheck, MapPin } from 'lucide-react'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { useApp } from '../store.jsx'
import { reverseGeocode } from '../utils/geo.js'

const QUICK_TYPES = [
  'Cooked Meals',
  'Bakery Surplus',
  'Sandwiches & Snacks',
  'Fresh Produce',
  'Sweets & Desserts',
  'Rice & Curries',
]

export default function PostFood() {
  const navigate = useNavigate()
  const { user, addPost } = useApp()

  const [food, setFood] = useState('')
  const [qty, setQty] = useState('')
  const [mins, setMins] = useState('60')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [coords, setCoords] = useState({ lat: 28.9845, lng: 77.7064 })
  const [locating, setLocating] = useState(false)
  const [gpsSuccess, setGpsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [successPost, setSuccessPost] = useState(null)

  // Route guard: if not logged in, redirect to auth with return destination
  useEffect(() => {
    if (!user) {
      navigate('/auth', { state: { from: '/post' }, replace: true })
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }
    setLocating(true)
    setError('')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        setCoords({ lat, lng })
        setGpsSuccess(true)

        const coordString = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
        setAddress(coordString)

        try {
          const locationName = await reverseGeocode(lat, lng)
          if (locationName) {
            setAddress(locationName)
          }
        } catch {
          // Keep raw coordinates
        } finally {
          setLocating(false)
        }
      },
      () => {
        setLocating(false)
        setError('Could not detect GPS location automatically. Please enter your landmark or area name.')
      },
      { timeout: 9000, enableHighAccuracy: true }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!food.trim()) {
      setError('Please enter the food description.')
      return
    }
    if (!qty.trim()) {
      setError('Please specify the quantity or servings.')
      return
    }

    setError('')
    const created = await addPost({
      food: food.trim(),
      qty: qty.trim(),
      mins: parseInt(mins, 10) || 60,
      donor: user?.name || 'Food Donor',
      donorEmail: user?.email,
      phone: phone.trim() || user?.phone || '',
      address: address.trim() || 'Near Delhi Road, Meerut',
      note: note.trim(),
      lat: coords.lat,
      lng: coords.lng,
    })

    setSuccessPost(created)
  }

  const resetForm = () => {
    setFood('')
    setQty('')
    setMins('60')
    setPhone('')
    setAddress('')
    setNote('')
    setGpsSuccess(false)
    setError('')
    setSuccessPost(null)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between">
      <SiteHeader />

      <main className="flex-1 mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            Food Donation Form
          </span>
        </div>

        {successPost ? (
          <div className="card-dark border border-slate-200 bg-white p-6 sm:p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-2xl text-green-600 border border-green-200">
              ✓
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
              Surplus Food Listed
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
              Thank you, <span className="font-bold text-slate-800">{user.name}</span>! Your listing is now available for community pickup.
            </p>

            <div className="mx-auto mt-6 max-w-md rounded-xl bg-slate-50 border border-slate-200 p-4 text-left text-xs sm:text-sm space-y-2 text-slate-700">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Food Item:</span>
                <span className="font-bold text-slate-900">{successPost.food}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-bold text-green-700">{successPost.qty}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Pickup Window:</span>
                <span className="font-semibold">{successPost.mins} minutes</span>
              </div>
              {successPost.address && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-right max-w-[60%]">{successPost.address}</span>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row justify-center max-w-md mx-auto">
              <Link
                to="/"
                className="btn-brand flex-1 py-3 text-sm font-bold shadow-xs transition text-center"
              >
                View on Home Feed
              </Link>
              <button
                onClick={resetForm}
                className="btn-outline flex-1 py-3 text-sm font-bold transition cursor-pointer text-slate-700"
              >
                + Post Another Meal
              </button>
            </div>
          </div>
        ) : (
          <div className="card-dark border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="border-b border-slate-100 pb-5 mb-6">
              <h1 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                Share Surplus Food
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Help prevent food waste by sharing untouched food with community members nearby.
              </p>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-green-600 shrink-0" />
                  <span>
                    Donor: <strong className="text-slate-900">{user.name}</strong> ({user.organization || 'Local Donor'})
                  </span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600">
                <AlertCircle size={15} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Food Description *
                </label>
                <input
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  placeholder="e.g. Veg Biryani, Dal Makhani with Roti, Fresh Fruit Trays"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white"
                  autoFocus
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {QUICK_TYPES.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setFood((prev) => (prev ? `${prev}, ${chip}` : chip))}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-green-500 hover:text-green-700 cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Quantity / Servings *
                  </label>
                  <input
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    placeholder="e.g. 30 portions / 10 boxes"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Pickup Window
                  </label>
                  <select
                    value={mins}
                    onChange={(e) => setMins(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-green-500 focus:bg-white"
                  >
                    <option value="30">30 minutes</option>
                    <option value="60">1 Hour (Standard)</option>
                    <option value="120">2 Hours</option>
                    <option value="240">4 Hours</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Pickup Location / Landmark *
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700 disabled:opacity-50 cursor-pointer"
                  >
                    <Navigation size={13} className={locating ? 'animate-spin' : ''} />
                    {locating ? 'Detecting…' : gpsSuccess ? '✓ GPS Captured' : 'Detect GPS Location'}
                  </button>
                </div>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Near West End Road, Meerut"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Contact Phone (Optional)
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Notes / Instructions (Optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="e.g. Packed in clean foil boxes. Please bring carry bags."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-green-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
                <Clock size={15} className="shrink-0 text-slate-500" />
                <span>Listings automatically expire after the pickup window closes.</span>
              </div>

              <button
                type="submit"
                className="btn-brand w-full py-3.5 text-sm font-bold shadow-sm transition cursor-pointer"
              >
                Publish Surplus Food Listing
              </button>
            </form>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
