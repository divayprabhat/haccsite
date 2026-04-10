import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle authentication logic here
    console.log(isSignIn ? 'Sign in' : 'Sign up', { email, password, name })
    // For demo purposes, redirect to chat page after successful auth
    navigate('/chat')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-8 shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-signal flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 1L9 5.5L5.5 10L2 5.5L5.5 1Z" fill="#082f49" stroke="none" />
                </svg>
              </div>
              <span className="text-xl font-bold text-ink-primary">Vela</span>
            </Link>
          </div>

          {/* Toggle between Sign In/Sign Up */}
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsSignIn(true)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSignIn
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignIn(false)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                !isSignIn
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-1 block">Name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your name"
                    required={!isSignIn}
                  />
                </label>
              </motion.div>
            )}

            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700 mb-1 block">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full bg-signal text-slate-900 py-3 px-4 rounded-xl font-semibold hover:bg-signal/90 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            {isSignIn ? (
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <button
                  onClick={() => setIsSignIn(false)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignIn(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Demo Note */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-700 text-center">
              This is a demo authentication page. Enter any email and password to continue.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
