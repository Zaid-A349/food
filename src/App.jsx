import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import PostFood from './pages/PostFood.jsx'
import { LangProvider } from './i18n.jsx'
import { AppProvider } from './store.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <AppProvider>
      <LangProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/post" element={<PostFood />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </LangProvider>
    </AppProvider>
  )
}
