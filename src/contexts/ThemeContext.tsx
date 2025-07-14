import React, { createContext, useContext, useEffect, useMemo } from 'react'
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
  },
  dark: {
    background: 'from-gray-900 via-slate-800 to-gray-900',
    primary: 'gray',
    secondary: 'slate',
    accent: 'gray'
  },
  platinum: {
    background: 'from-slate-200 via-gray-100 to-zinc-200',
    primary: 'slate',
    secondary: 'gray',
    accent: 'zinc'
  },
  diamond: {
    background: 'from-cyan-100 via-blue-50 to-indigo-100',
    primary: 'cyan',
    secondary: 'blue',
    accent: 'indigo'
  }
}

interface ThemeContextType {
  currentTheme: string
  themeConfig: typeof themeConfigs.default
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTheme } = useGame()

  const themeConfig = useMemo(() => {
    return themeConfigs[currentTheme as keyof typeof themeConfigs] || themeConfigs.default
  }, [currentTheme])

  useEffect(() => {
    // Apply theme to document body
    const isDarkMode = currentTheme === 'dark'
    const config = themeConfigs[currentTheme as keyof typeof themeConfigs] || themeConfigs.default
    
    document.body.className = `min-h-screen bg-gradient-to-br ${config.background} ${isDarkMode ? 'dark' : ''}`
    
    // Also apply dark class to html element for better dark mode support
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [currentTheme])

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