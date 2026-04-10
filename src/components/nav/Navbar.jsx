import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { path: '/chat', label: 'Chat' },
  { path: '/models', label: 'Models' },
  { path: '/train', label: 'Train' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-7 px-4"
    >
      <div
        className={`glass-strong relative overflow-hidden flex items-center gap-1 px-3 py-2.5 rounded-2xl transition-all duration-500 ${
          scrolled ? 'shadow-[0_10px_32px_rgba(15,23,42,0.18)]' : 'shadow-[0_4px_18px_rgba(15,23,42,0.08)]'
        }`}
      >
        <motion.div
          aria-hidden
          className="absolute -left-8 -top-8 w-16 h-16 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(14,165,233,0.35) 0%, rgba(14,165,233,0) 70%)',
            filter: 'blur(12px)',
          }}
          animate={{ x: [0, 14, 0], y: [0, 8, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute -right-8 -bottom-8 w-20 h-20 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(99,102,241,0) 70%)',
            filter: 'blur(14px)',
          }}
          animate={{ x: [0, -16, 0], y: [0, -10, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

          <Link
            to="/"
            className="relative z-10 flex items-center gap-2 px-3 py-1.5 mr-2"
          >
            <div className="w-5 h-5 rounded-md bg-signal flex items-center justify-center">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 1L9 5.5L5.5 10L2 5.5L5.5 1Z" fill="#082f49" stroke="none" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight text-ink-primary">Vela</span>
          </Link>

          <div className="relative z-10 h-4 w-px bg-border-strong mx-1" />

        <div className="relative z-10 flex items-center">
          {NAV_LINKS.map(({ path, label }) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className="nav-gooey-btn relative z-10 px-4 py-1.5 text-sm font-medium rounded-xl transition-colors duration-150"
                style={{ color: active ? 'var(--ink-primary)' : 'var(--ink-muted)' }}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'rgba(15,23,42,0.07)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="nav-gooey-blob" />
                <span className="relative z-10">{label}</span>
              </Link>
            )
          })}
        </div>

        <div className="relative z-10 h-4 w-px bg-border-strong mx-1 ml-2" />

        <Link to="/auth" className="btn-signin-glass relative z-10 shrink-0" data-cursor="pointer">
          <span className="btn-signin-glass-inner">Sign in</span>
        </Link>
      </div>
    </motion.nav>
  )
}
