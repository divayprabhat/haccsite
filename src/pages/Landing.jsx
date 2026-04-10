import { useRef, useState, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'

const FloatingSpheres = lazy(() => import('../components/landing/FloatingSpheres'))

const SECTIONS = [
  {
    tag: '01 — Conversation',
    title: 'Intelligence that\nunderstands you.',
    desc: 'Chat naturally with our NLP model. Ask about disasters, request analysis, or just explore — it responds with precision.',
    cta: 'Open Chat',
    path: '/chat',
    accent: '#6ee7b7',
    dim: 'rgba(110,231,183,0.06)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 4h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8l-5 4V5a1 1 0 0 1 1-1Z" stroke="#6ee7b7" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
        <path d="M8 9h6M8 12h4" stroke="#6ee7b7" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    tag: '02 — Pre-trained Models',
    title: 'Battle-tested on\nreal disasters.',
    desc: 'Select from a library of models trained on earthquakes, floods, hurricanes, and more. Input a location, get instant predictions.',
    cta: 'Browse Models',
    path: '/models',
    accent: '#818cf8',
    dim: 'rgba(129,140,248,0.06)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="7" stroke="#818cf8" strokeWidth="1.4" fill="none"/>
        <path d="M4.5 11h13M11 4.5c-2.5 2-2.5 11 0 13M11 4.5c2.5 2 2.5 11 0 13" stroke="#818cf8" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    tag: '03 — Custom Training',
    title: 'Your data,\nyour model.',
    desc: 'Upload a dataset, configure hyperparameters, and watch your model train live. Built for researchers and domain experts.',
    cta: 'Start Training',
    path: '/train',
    accent: '#f9a8d4',
    dim: 'rgba(249,168,212,0.06)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="12" width="4" height="7" rx="1" stroke="#f9a8d4" strokeWidth="1.4" fill="none"/>
        <rect x="9" y="7" width="4" height="12" rx="1" stroke="#f9a8d4" strokeWidth="1.4" fill="none"/>
        <rect x="15" y="3" width="4" height="16" rx="1" stroke="#f9a8d4" strokeWidth="1.4" fill="none"/>
      </svg>
    ),
  },
]

const STATS = [
  { value: '99.2%', label: 'Uptime SLA' },
  { value: '< 80ms', label: 'Median latency' },
  { value: '6 models', label: 'Pre-trained' },
  { value: '3 modes', label: 'Interface types' },
]

export default function Landing() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.93])

  return (
    <div className="min-h-screen overflow-hidden liquid-bg" style={{ background: 'transparent' }}>
      <Suspense fallback={null}>
        <FloatingSpheres />
      </Suspense>
      <div className="noise-overlay fixed inset-0 z-[2]" />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center"
        style={{ zIndex: 10 }}
      >
        {/* Radial light */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(14,165,233,0.12) 0%, transparent 70%)',
          }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <motion.div
            animate={{ x: [0, 24, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-12 top-20 w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(56,189,248,0.24) 0%, rgba(56,189,248,0) 70%)',
              filter: 'blur(10px)',
            }}
          />
          <motion.div
            animate={{ x: [0, -22, 0], y: [0, 28, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-8 top-24 w-72 h-72 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(129,140,248,0.24) 0%, rgba(129,140,248,0) 70%)',
              filter: 'blur(14px)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 15% 20%, rgba(99,102,241,0.12) 0%, transparent 45%), radial-gradient(circle at 85% 30%, rgba(14,165,233,0.14) 0%, transparent 45%), radial-gradient(circle at 55% 80%, rgba(30,41,59,0.06) 0%, transparent 50%)',
            }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 42, ease: 'linear', repeat: Infinity }}
            className="absolute left-1/2 top-1/2 w-[74vw] max-w-[880px] aspect-square rounded-full border"
            style={{
              transform: 'translate(-50%, -50%)',
              borderColor: 'rgba(99,102,241,0.12)',
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 52, ease: 'linear', repeat: Infinity }}
            className="absolute left-1/2 top-1/2 w-[60vw] max-w-[700px] aspect-square rounded-full border"
            style={{
              transform: 'translate(-50%, -50%)',
              borderColor: 'rgba(14,165,233,0.14)',
            }}
          />
        </motion.div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 flex flex-col items-center w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.35 }}
            className="glass-liquid rounded-[36px] px-6 md:px-10 py-12 md:py-14 w-full"
          >
          <motion.h1
            style={{ y: titleY, scale: titleScale }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-display text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.95] tracking-[-0.035em] mb-6 max-w-5xl"
          >
            Where language
            <br />
            <em
              className="not-italic inline-block"
              style={{
                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              meets dimension.
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="text-[17px] text-ink-secondary max-w-xl leading-relaxed mb-10"
          >
            Chat, analyze pre-trained disaster models, or train your own. A single platform built for researchers, engineers, and analysts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex items-center gap-3 flex-wrap justify-center"
          >
            <Link to="/chat" className="btn-signal text-[15px] px-6 py-3">
              Start chatting
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/models" className="btn-ghost text-[14px] px-5 py-3">
              Explore models
            </Link>
          </motion.div>
          </motion.div>

        </motion.div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────── */}
      <section className="border-y border-border py-8 px-6" style={{ position: 'relative', zIndex: 10, background: 'rgba(255,255,255,0.74)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.03 }}
              className="flex flex-col gap-1 rounded-2xl px-3 py-2 glass"
              style={{ transformPerspective: 700 }}
            >
              <span className="text-[28px] font-bold tracking-tight" style={{ color: 'var(--signal)' }}>{s.value}</span>
              <span className="text-mono text-ink-muted">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section cards — Broadway card DNA ─────────────────── */}
      <section className="px-6 py-28 max-w-5xl mx-auto" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="label-section mb-4">Platform</p>
          <h2 className="text-display text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-tight leading-tight max-w-lg">
            Three modes of intelligence.
          </h2>
          <p className="text-sm text-ink-secondary mt-4 max-w-xl leading-relaxed">
            A layered interaction design inspired by cinematic web experiences: strong typography, motion hierarchy, and tactile navigation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SECTIONS.map((sec, i) => (
            <SectionCard key={i} sec={sec} i={i} />
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="px-6 pb-28 max-w-5xl mx-auto" style={{ position: 'relative', zIndex: 10 }}>
        <div className="card p-8 md:p-12 overflow-hidden relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 50% 60% at 80% 50%, rgba(129,140,248,0.06) 0%, transparent 70%)',
            }}
          />
          <div className="relative z-10">
            <p className="label-section mb-4">Workflow</p>
            <h2 className="text-display text-[clamp(1.8rem,3.5vw,3rem)] font-bold tracking-tight mb-12 max-w-md">
              From input to insight in seconds.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { n: '01', t: 'Select a mode', d: 'Choose from chat, pre-trained models, or custom training.' },
                { n: '02', t: 'Provide input', d: 'Type a query, enter a location, or upload your dataset.' },
                { n: '03', t: 'Get results', d: 'Receive structured predictions, analysis, or trained models.' },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.55 }}
                  className="flex flex-col gap-3"
                >
                  <span className="text-mono" style={{ color: 'var(--ink-muted)', fontSize: 12 }}>{step.n}</span>
                  <h3 className="text-[17px] font-semibold tracking-tight">{step.t}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed">{step.d}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-border px-6 py-8" style={{ position: 'relative', zIndex: 10, background: 'rgba(255,255,255,0.82)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-signal flex items-center justify-center">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 1L9 5.5L5.5 10L2 5.5L5.5 1Z" fill="#082f49" />
              </svg>
            </div>
            <span className="text-sm font-semibold">Vela</span>
          </div>
          <span className="text-mono text-ink-muted" style={{ fontSize: 12 }}>
            AI Intelligence Platform — {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  )
}

function SectionCard({ sec, i }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, hover: false })

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    setTilt({
      x: (0.5 - py) * 20,
      y: (px - 0.5) * 24,
      hover: true,
    })
  }
  const onEnter = () => setTilt((prev) => ({ ...prev, hover: true }))
  const onLeave = () => setTilt({ x: 0, y: 0, hover: false })

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1100 }}
      className="group relative"
    >
      <Link
        to={sec.path}
        className="block h-full"
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div
          className="card h-full flex flex-col p-6 transition-all duration-150"
          style={{
            '--card-accent': sec.accent,
            '--card-dim': sec.dim,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            transformOrigin: 'center center',
            transform: `translateY(${tilt.hover ? -7 : 0}px) scale(${tilt.hover ? 1.01 : 1}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            boxShadow: '0 14px 42px rgba(2,6,23,0.2), 0 0 0 1px rgba(2,6,23,0.55), inset 0 1px 0 rgba(255,255,255,0.45)',
          }}
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${sec.dim}, transparent)`,
            }}
          />

          <div className="flex items-start justify-between mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: sec.dim, border: `1px solid ${sec.accent}22` }}
            >
              {sec.icon}
            </div>
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke={sec.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </div>

          <div className="mb-auto">
            <p className="text-mono mb-3" style={{ color: sec.accent, fontSize: 11, opacity: 0.8 }}>{sec.tag}</p>
            <h3 className="text-[18px] font-semibold tracking-tight leading-snug mb-3 whitespace-pre-line">
              {sec.title}
            </h3>
            <p className="text-sm text-ink-secondary leading-relaxed">{sec.desc}</p>
          </div>

          <div className="mt-8 pt-5 border-t border-border flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: sec.accent }}>
              {sec.cta}
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200">
              <path d="M1 7h12M7 1l6 6-6 6" stroke={sec.accent} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
