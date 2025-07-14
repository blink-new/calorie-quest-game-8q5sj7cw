import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CalorieTracker } from './components/CalorieTracker'
import { ActivityTracker } from './components/ActivityTracker'
import { Profile } from './components/Profile'
import { Achievements } from './components/Achievements'
import { Settings } from './components/Settings'
import { Shop } from './components/Shop'
import { Navigation } from './components/Navigation'
import { NotificationProvider } from './contexts/NotificationContext'
import { GameProvider } from './contexts/GameContext'
import { ThemeProvider } from './contexts/ThemeContext'
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

  return (
    <NotificationProvider>
      <GameProvider>
        <ThemeProvider>
          {showWelcome ? (
            <WelcomeScreen onComplete={handleWelcomeComplete} />
          ) : (
            <Router>
              <div className="min-h-screen">
                <div className="container mx-auto px-4 py-6 max-w-md">
                  <Routes>
                    <Route path="/" element={<CalorieTracker />} />
                    <Route path="/activity" element={<ActivityTracker />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                  <Navigation />
                </div>
              </div>
            </Router>
          )}
        </ThemeProvider>
      </GameProvider>
    </NotificationProvider>
  )
}

export default App