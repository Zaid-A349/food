import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Globe, Plus, Menu, X, LogOut, User } from 'lucide-react'
import Logo from './Logo.jsx'
import { useLang } from '../i18n.jsx'
import { useApp } from '../store.jsx'

export default function SiteHeader({ onActionNotice }) {
  const { t, toggle, lang } = useLang()
  const { user, logout } = useApp()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handlePostFoodClick = () => {
    if (!user) {
      navigate('/auth', { state: { from: '/post' } })
    } else {
      navigate('/post')
    }
    setMobileMenuOpen(false)
  }

  const handleDummyClick = (name) => {
    if (onActionNotice) {
      onActionNotice(name)
    }
    setMobileMenuOpen(false)
  }

  const navItems = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.postFood'), onClick: handlePostFoodClick, isAction: true },
    { label: t('nav.findFood'), action: 'Find Food' },
    { label: t('nav.features'), action: 'Features' },
    { label: t('nav.about'), action: 'About' },
    { label: t('nav.ngo'), action: 'NGO Mode' },
    { label: t('nav.donate'), action: 'Donate' },
    { label: t('nav.feedback'), action: 'Feedback' },
  ]

  return (
    <header className="sticky top-0 z-[10000] border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <Logo size={36} />
          <span className="font-display text-xl font-extrabold tracking-tight text-slate-900">
            Food<span className="text-green-600">ResQ</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navItems.map((item) => {
            if (item.isAction) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-green-600 px-3 py-2 text-xs lg:text-sm font-bold text-white shadow-xs hover:bg-green-500 hover:shadow-md transition cursor-pointer"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  {item.label}
                </button>
              )
            }
            if (item.action) {
              return (
                <button
                  key={item.label}
                  onClick={() => handleDummyClick(item.action)}
                  type="button"
                  className="rounded-xl px-2.5 py-2 text-xs lg:text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-green-700 transition cursor-pointer"
                >
                  {item.label}
                </button>
              )
            }
            const active = location.pathname === item.to
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`rounded-xl px-2.5 py-2 text-xs lg:text-sm font-semibold transition ${
                  active
                    ? 'bg-green-50 text-green-700 font-bold border border-green-200/60'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-green-700'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Language Switcher & Auth */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggle}
            aria-label="Language switcher"
            className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-xs transition hover:border-green-500/50 hover:bg-green-50 hover:text-green-700 cursor-pointer"
          >
            <Globe size={15} className="text-green-600" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
          
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-green-50 border border-green-200/80 px-3 py-1.5 text-xs font-bold text-green-800">
                <User size={13} className="text-green-600" />
                {user.name}
              </span>
              <button
                onClick={logout}
                title="Sign Out"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition cursor-pointer"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="h-9 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-800 shadow-xs transition hover:border-green-500 hover:bg-green-50 hover:text-green-700 cursor-pointer"
            >
              {t('nav.login')}
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick || (() => handleDummyClick(item.action || item.label))}
              className="w-full text-left rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-green-50 hover:text-green-700"
            >
              {item.label}
            </button>
          ))}
          {!user && (
            <button
              onClick={() => {
                navigate('/auth')
                setMobileMenuOpen(false)
              }}
              className="w-full text-left rounded-lg px-3 py-2 text-sm font-bold text-green-700 hover:bg-green-50"
            >
              {t('nav.login')}
            </button>
          )}
        </div>
      )}
    </header>
  )
}
