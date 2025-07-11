import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CalorieTracker } from './components/CalorieTracker'
import { Profile } from './components/Profile'
import { Achievements } from './components/Achievements'
import { Settings } from './components/Settings'
import { Navigation } from './components/Navigation'
import { NotificationProvider } from './contexts/NotificationContext'
import { GameProvider } from './contexts/GameContext'
import { WelcomeScreen } from './components/WelcomeScreen'

function App() {
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome')
    if (hasSeenWelcome) {
      setShowWelcome(false)
    }
  }, [])

  const handleWelcomeComplete = () => {
    localStorage.setItem('hasSeenWelcome', 'true')
    setShowWelcome(false)
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />
  }

  return (
    <NotificationProvider>
      <GameProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
            <div className="container mx-auto px-4 py-6 max-w-md">
              <Routes>
                <Route path="/" element={<CalorieTracker />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
              <Navigation />
            </div>
          </div>
        </Router>
      </GameProvider>
    </NotificationProvider>
  )
}

export default App