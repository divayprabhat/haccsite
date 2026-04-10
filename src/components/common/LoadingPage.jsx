import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingPage({ isLoading }) {
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState('initializing')

  useEffect(() => {
    if (!isLoading) return

    const phases = [
      { name: 'initializing', duration: 800, progress: 20 },
      { name: 'loading', duration: 1200, progress: 60 },
      { name: 'rendering', duration: 800, progress: 90 },
      { name: 'finalizing', duration: 500, progress: 100 }
    ]

    let currentPhaseIndex = 0
    let startTime = Date.now()
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const phase = phases[currentPhaseIndex]
      
      if (elapsed >= phase.duration) {
        setLoadingProgress(phase.progress)
        setCurrentPhase(phase.name)
        
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

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
        >
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Main loading content */}
          <div className="relative z-10 text-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 11 11" fill="none">
                    <path d="M5.5 1L9 5.5L5.5 10L2 5.5L5.5 1Z" fill="#ffffff" stroke="none" />
                  </svg>
                </motion.div>
                <motion.span
                  className="text-3xl font-bold text-white"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Vela
                </motion.span>
              </div>
              
              <motion.div
                className="text-sm text-blue-200 uppercase tracking-wider font-medium"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                AI Model Hub
              </motion.div>
            </motion.div>

            {/* Loading phase indicator */}
            <motion.div
              className="mb-8 h-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.div
                key={currentPhase}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="text-blue-300 text-sm font-medium capitalize"
              >
                {currentPhase === 'initializing' && 'Initializing experience...'}
                {currentPhase === 'loading' && 'Loading components...'}
                {currentPhase === 'rendering' && 'Rendering interface...'}
                {currentPhase === 'finalizing' && 'Almost ready...'}
              </motion.div>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="w-64 h-1 bg-blue-900/50 rounded-full overflow-hidden mb-8"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '16rem', opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                style={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Progress percentage */}
            <motion.div
              className="text-blue-200 text-xs font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {Math.round(loadingProgress)}%
            </motion.div>

            {/* Subtle hint text */}
            <motion.div
              className="mt-12 text-blue-300/50 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              Crafting your AI experience
            </motion.div>
          </div>

          {/* Gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
