import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Zap, Shield, MapPin, Clock, Leaf, LayoutDashboard } from 'lucide-react'
import SectionHead from '../components/SectionHead.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { useApp } from '../store.jsx'

function useCountUp(target, start) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf
    const t0 = performance.now()
    const dur = 1200
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target])
  return val
}

function Counter({ target, suffix = '+' }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const val = useCountUp(target, inView)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <span ref={ref} className="font-display text-4xl font-extrabold text-green-600 sm:text-5xl">
      {val.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function Home() {
  const { user, activePosts } = useApp()
  const navigate = useNavigate()

  const handlePostFood = () => {
    if (!user) {
      navigate('/auth', { state: { from: '/post' } })
    } else {
      navigate('/post')
    }
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const community = [
    { emoji: '🎓', title: 'Students', text: 'Free hot meals near campus or hostels' },
    { emoji: '🏠', title: 'Families', text: 'Safe, dignified fresh food pickup nearby' },
    { emoji: '🍽️', title: 'Restaurants', text: 'Zero food waste and reduced kitchen disposal costs' },
    { emoji: '💒', title: 'Wedding Caterers', text: 'Surplus buffet food shared with those in need' },
    { emoji: '🏢', title: 'Office Canteens', text: 'Afternoon sandwiches and meal trays redistributed' },
    { emoji: '🍲', title: 'Home Cooks', text: 'Share excess home-cooked portions with neighbors' },
  ]

  const why = [
    { icon: Zap, title: 'Instant Posting', text: 'Post food in under 30 seconds with simple location capture.' },
    { icon: Shield, title: 'Privacy First', text: 'Direct, secure access with no unnecessary data collection.' },
    { icon: MapPin, title: 'Hyper-Local', text: 'GPS-guided discovery to find food within walking distance.' },
    { icon: Clock, title: 'Auto-Expire', text: 'Listings automatically expire after the pickup window ends.' },
    { icon: Leaf, title: 'Zero Waste', text: 'Every meal rescued keeps food out of landfills and helps our planet.' },
    { icon: LayoutDashboard, title: 'Organization Support', text: 'Tools for community kitchens and bulk food distribution.' },
  ]

  const giverSteps = [
    'Tap "Post Food"',
    'Fill simple meal & quantity details',
    'Listing goes live instantly',
    'Auto-expires when pickup time ends',
  ]

  const seekerSteps = [
    'Browse available surplus food',
    'Check location and remaining time',
    'Head over for pickup',
    'Collect meal — fresh & free',
  ]

  const findSpots = [
    { emoji: '📍', title: 'Live Food Feed', text: 'Every active food post near you appears in real time with quantity and pickup time.' },
    { emoji: '🍛', title: 'Restaurants & Hotels', text: 'Surplus buffet, bakery, and kitchen items posted right after peak hours.' },
    { emoji: '💒', title: 'Weddings & Events', text: 'Untouched catering portions shared in late evening instead of being discarded.' },
    { emoji: '🏢', title: 'Offices & Canteens', text: 'Sandwiches, snacks, and lunch meals from local business cafeterias.' },
    { emoji: '🏠', title: 'Home Cooks', text: 'Neighbors sharing extra prepared meals directly with people nearby.' },
    { emoji: '🏛️', title: 'Community Kitchens', text: 'Scheduled community distribution spots and volunteer shelters.' },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      {/* ---------------- Header Navigation Bar ---------------- */}
      <SiteHeader onNavigateSection={scrollToSection} />

      {/* ---------------- Hero ---------------- */}
      <section className="relative flex min-h-[75vh] flex-col items-center justify-center px-4 pt-14 pb-12 text-center">
        <h1 className="mt-2 font-display text-4xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-6xl max-w-4xl">
          <span>From Waste to </span>
          <span className="text-green-600">Plates</span>
          <br />
          <span className="text-slate-800">— Just 1 Tap Away</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Connect restaurants, weddings, and kitchens with hungry people nearby.{' '}
          <span className="font-bold text-green-600">
            Zero food waste. Zero hunger. Zero cost.
          </span>
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handlePostFood}
            className="btn-brand px-8 py-3.5 text-base inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={18} strokeWidth={2.5} />
            Post Free Food
          </button>
          <button
            onClick={() => scrollToSection('find-food')}
            className="btn-outline px-8 py-3.5 text-base inline-flex items-center justify-center gap-2 cursor-pointer hover:border-green-500 hover:bg-green-50 hover:text-green-800"
          >
            <Search size={16} />
            Find Food Nearby
          </button>
        </div>

        <div className="card-dark mt-10 w-full max-w-4xl p-5 sm:p-6 text-left shadow-xs">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
            <ol className="grid w-full gap-3 grid-cols-2 lg:grid-cols-4">
              {seekerSteps.map((s, i) => (
                <li key={s} className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-50 font-display text-xs font-extrabold text-green-700">
                    {i + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-700">{s}</span>
                </li>
              ))}
            </ol>
            <button
              onClick={() => scrollToSection('find-food')}
              className="btn-brand shrink-0 px-6 py-2.5 text-sm w-full sm:w-auto cursor-pointer"
            >
              Find Food Now <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- Live strip ---------------- */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <button
          onClick={() => scrollToSection('find-food')}
          className="card-dark card-hover flex w-full flex-col sm:flex-row items-center justify-between gap-4 p-5 sm:px-8 sm:py-5 text-left cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-50 font-display text-2xl font-black text-green-600 border border-green-200">
              {activePosts.length}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="dot-live" />
                <span className="font-display text-base sm:text-lg font-bold text-slate-900">
                  {activePosts.length} Active Listings Available
                </span>
              </div>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
                Surplus food listings available for pickup right now
              </p>
            </div>
          </div>
          <span className="flex items-center gap-2 font-bold text-sm text-green-600 shrink-0">
            View Listings <span aria-hidden>→</span>
          </span>
        </button>
      </section>

      {/* ---------------- Impact ---------------- */}
      <section id="impact" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
        <SectionHead
          pill="IMPACT"
          title="Numbers That Matter"
          sub="Real meals saved from going to waste and shared with community members."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { target: 11, label: 'Meals Rescued', suffix: '+' },
            { target: 2, label: 'Active Food Donors', suffix: '+' },
            { target: 1, label: 'City Coverage', suffix: '' },
          ].map((c) => (
            <div key={c.label} className="card-dark card-hover p-8 text-center">
              <Counter target={c.target} suffix={c.suffix} />
              <div className="mt-2 text-sm font-medium text-slate-500">{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6">
        <SectionHead pill="HOW IT WORKS" title="Simple as 1-2-3" sub="A smooth connection between food surplus and food access." />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            { title: 'For Food Donors', sub: 'Share surplus meals with zero hassle', steps: giverSteps },
            { title: 'For Community Members', sub: 'Locate fresh meals within walking distance', steps: seekerSteps },
          ].map((col) => (
            <div key={col.title} className="card-dark h-full p-7">
              <h3 className="font-display text-xl font-bold text-slate-900">{col.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{col.sub}</p>
              <ol className="mt-6 space-y-4">
                {col.steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 font-display text-sm font-extrabold text-green-700">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium text-slate-700">{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Where to find food ---------------- */}
      <section id="find-food" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6">
        <SectionHead pill="DISCOVERY" title="Where Surplus Food Comes From" sub="Surplus meals appear in real-time from these common local hubs." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {findSpots.map((f) => (
            <div key={f.title} className="card-dark card-hover h-full p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">{f.emoji}</div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Community ---------------- */}
      <section id="community" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6">
        <SectionHead pill="COMMUNITY" title="Who Uses FoodResQ" sub="From students to local restaurants — everyone benefits." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {community.map((c) => (
            <div key={c.title} className="card-dark card-hover h-full p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl">{c.emoji}</div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Why us ---------------- */}
      <section id="why-us" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6">
        <SectionHead pill="PLATFORM" title="Built for Fast & Dignified Impact" sub="Fast, simple, and free community food sharing." />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {why.map((f) => (
            <div key={f.title} className="card-dark card-hover h-full p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <f.icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section id="cta" className="mx-auto max-w-4xl scroll-mt-24 px-4 pb-20 text-center sm:px-6">
        <div className="card-dark border border-green-200 bg-white px-6 py-14 shadow-sm sm:px-16">
          <h2 className="font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">Have Surplus Food Right Now?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">Takes less than 30 seconds to post. Someone nearby is waiting.</p>
          <button onClick={handlePostFood} className="btn-brand mt-7 px-9 py-3.5 text-base inline-flex items-center justify-center gap-2 cursor-pointer">
            <Plus size={18} strokeWidth={2.5} />
            Post Food Now
          </button>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
