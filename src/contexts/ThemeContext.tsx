import React, { createContext, useContext, useEffect } from 'react'
import { useGame } from './GameContext'

const themeConfigs = {
  default: {
    background: 'from-purple-50 via-pink-50 to-orange-50',
    primary: 'purple',
    secondary: 'pink',
    accent: 'orange'
  },
  ocean: {
    background: 'from-blue-50 via-cyan-50 to-teal-50',
    primary: 'blue',
    secondary: 'cyan',
    accent: 'teal'
  },
  forest: {
    background: 'from-green-50 via-emerald-50 to-lime-50',
    primary: 'green',
    secondary: 'emerald',
    accent: 'lime'
  },
  sunset: {
    background: 'from-orange-50 via-amber-50 to-yellow-50',
    primary: 'orange',
    secondary: 'amber',
    accent: 'yellow'
  },
  lavender: {
    background: 'from-purple-50 via-violet-50 to-indigo-50',
    primary: 'purple',
    secondary: 'violet',
    accent: 'indigo'
  },
  rose: {
    background: 'from-pink-50 via-rose-50 to-red-50',
    primary: 'pink',
    secondary: 'rose',
    accent: 'red'
  },
  midnight: {
    background: 'from-slate-100 via-blue-100 to-indigo-100',
    primary: 'slate',
    secondary: 'blue',
    accent: 'indigo'
  },
  rainbow: {
    background: 'from-red-50 via-yellow-50 via-green-50 via-blue-50 to-purple-50',
    primary: 'red',
    secondary: 'rainbow',
    accent: 'purple'
  }
}

interface ThemeContextType {
  currentTheme: string
  themeConfig: typeof themeConfigs.default
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTheme } = useGame()

  const themeConfig = themeConfigs[currentTheme as keyof typeof themeConfigs] || themeConfigs.default

  useEffect(() => {
    // Apply theme to document body
    document.body.className = `min-h-screen bg-gradient-to-br ${themeConfig.background}`
  }, [themeConfig])

  return (
    <ThemeContext.Provider value={{ currentTheme, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}