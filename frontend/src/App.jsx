import React from 'react'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Cursor from './components/common/Cursor'
import LoadingPage from './components/common/LoadingPage'
import Navbar from './components/nav/Navbar'
import Landing from './pages/Landing'
import ChatPage from './pages/ChatPage'
import PretrainedPage from './pages/PretrainedPage'
import TrainablePage from './pages/TrainablePage'
import AuthPage from './pages/AuthPage'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time - in production this would be based on actual resource loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3500) // 3.5 seconds loading time

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <LoadingPage isLoading={isLoading} />
      <BrowserRouter>
        <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.8s ease-in-out' }}>
          <Cursor />
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/models" element={<PretrainedPage />} />
            <Route path="/train" element={<TrainablePage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}
