import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Array of vibrant color palettes for 3D spheres
const colors = [
  { light: '#c4b5fd', core: '#8b5cf6', dark: '#4c1d95' }, // violet
  { light: '#fed7aa', core: '#f97316', dark: '#9a3412' }, // orange
  { light: '#bae6fd', core: '#0ea5e9', dark: '#075985' }, // sky
  { light: '#f5d0fe', core: '#d946ef', dark: '#701a75' }, // fuchsia
  { light: '#fef08a', core: '#eab308', dark: '#713f12' }, // yellow
  { light: '#fecdd3', core: '#f43f5e', dark: '#881337' }, // rose
  { light: '#a5f3fc', core: '#06b6d4', dark: '#164e63' }, // cyan
]

// Generate falling balls with constant negative delays for an instant shower effect
const fallingBalls = Array.from({ length: 20 }).map((_, i) => {
  const size = Math.random() * 80 + 45; // Larger size for better 3D effect
  return {
    id: i,
    left: Math.random() * 100,
    size: size,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 5 + 4, // 4 to 9 seconds
    delay: Math.random() * -10, // instantly on screen
    blur: Math.random() > 0.6 ? Math.random() * 3 + 1 : 0,
    opacity: Math.random() * 0.2 + 0.8, // 3D balls look better with higher opacity
    drift: (Math.random() - 0.5) * 40, // slight x drift
  };
})

const DigitColumn = ({ digit }) => {
  return (
    <div className="relative overflow-hidden h-[1em] leading-none inline-flex flex-col tabular-nums align-top">
      {/* Invisible placeholder to establish width and height */}
      <span className="invisible pointer-events-none">0</span>
      <motion.div
        initial={false}
        animate={{ y: `-${digit * 10}%` }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute top-0 left-0 flex flex-col w-full h-[10em]"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <span key={n} className="flex-shrink-0 h-[1em] flex items-center justify-center">
            {n}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function LoadingPage({ isLoading }) {
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    const phases = [
      { duration: 800, progress: 20 },
      { duration: 1200, progress: 60 },
      { duration: 800, progress: 90 },
      { duration: 500, progress: 100 }
    ]

    let currentPhaseIndex = 0
    let startTime = Date.now()
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const phase = phases[currentPhaseIndex]
      
      if (elapsed >= phase.duration) {
        setLoadingProgress(phase.progress)
        
        if (currentPhaseIndex < phases.length - 1) {
          currentPhaseIndex++
          startTime = Date.now()
        } else {
          clearInterval(interval)
        }
      } else {
        const phaseProgress = elapsed / phase.duration
        const prevProgress = currentPhaseIndex === 0 ? 0 : phases[currentPhaseIndex - 1].progress
        const targetProgress = phase.progress
        setLoadingProgress(prevProgress + (targetProgress - prevProgress) * phaseProgress)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isLoading])

  const percentageStr = String(Math.round(loadingProgress))

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f8fafc] overflow-hidden"
        >
          {/* Inject dynamic falling keyframes */}
          <style>
            {`
              @keyframes fall {
                0% { transform: translateY(-30vh) translateX(0px); }
                100% { transform: translateY(130vh) translateX(var(--drift)); }
              }
            `}
          </style>

          {/* Background Radial Glow for slight depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05)_0%,transparent_70%)] pointer-events-none" />

          {/* Falling Spheres */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ perspective: '1000px' }}>
            {fallingBalls.map((ball) => (
              <div
                key={ball.id}
                className="absolute rounded-full"
                style={{
                  width: ball.size,
                  height: ball.size,
                  left: `${ball.left}%`,
                  top: 0,
                  filter: ball.blur > 0 ? `blur(${ball.blur}px)` : 'none',
                  opacity: ball.opacity,
                  '--drift': `${ball.drift}px`,
                  animation: `fall ${ball.duration}s linear ${ball.delay}s infinite`,
                  background: `radial-gradient(circle at 30% 30%, ${ball.color.light} 0%, ${ball.color.core} 40%, ${ball.color.dark} 100%)`,
                  boxShadow: `
                    inset -${ball.size * 0.15}px -${ball.size * 0.15}px ${ball.size * 0.3}px rgba(0,0,0,0.5), 
                    inset ${ball.size * 0.1}px ${ball.size * 0.1}px ${ball.size * 0.2}px rgba(255,255,255,0.8), 
                    0 ${ball.size * 0.2}px ${ball.size * 0.3}px rgba(0,0,0,0.2)
                  `,
                  transformStyle: 'preserve-3d'
                }}
              />
            ))}
          </div>

          {/* Center Content */}
          <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none select-none w-full px-6">
            
            {/* Website Name */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                Vela
              </h1>
              <p className="text-sm font-medium tracking-widest text-slate-500 uppercase mt-1">
                Intelligence Engine
              </p>
            </div>

            {/* Glassmorphism Card for Percentage */}
            <div
               className="rounded-3xl px-12 sm:px-16 py-6 sm:py-10 flex flex-col items-center justify-center backdrop-blur-md border border-white/40"
               style={{ background: 'rgba(255, 255, 255, 0.65)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-center text-3xl sm:text-5xl font-bold text-slate-800 tracking-tighter leading-none">
                <AnimatePresence mode="popLayout">
                  {percentageStr.split('').map((char, i) => {
                    const reverseIndex = percentageStr.length - i
                    return (
                      <motion.div
                        key={reverseIndex}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10, position: 'absolute' }}
                        transition={{ duration: 0.15 }}
                        className="inline-block"
                      >
                        <DigitColumn digit={parseInt(char, 10)} />
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                <span className="ml-[0.2em] text-[0.8em] font-medium text-sky-500">%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}