import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNotifications } from './NotificationContext'

interface GameStats {
  level: number
  xp: number
  xpToNextLevel: number
  streak: number
  totalDays: number
  achievements: Achievement[]
  coins: number
  currentWeight?: number
  targetWeight?: number
  startWeight?: number
  caloriesLogged: number
  mealsLogged: number
  daysActive: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: Date
  category: 'streak' | 'weight' | 'calories' | 'meals' | 'special'
  requirement: number
  progress: number
}

interface FoodEntry {
  id: string
  name: string
  calories: number
  timestamp: Date
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

interface GameContextType {
  stats: GameStats
  foodEntries: FoodEntry[]
  currentTheme: string
  ownedThemes: string[]
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => void
  updateWeight: (weight: number) => void
  setTargetWeight: (weight: number) => void
  getDailyCalories: () => number
  getWeeklyProgress: () => number[]
  checkAchievements: () => void
  getTodaysEntries: () => FoodEntry[]
  getCaloriesForDate: (date: Date) => number
  purchaseTheme: (themeId: string, price: number) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const defaultStats: GameStats = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100, // Level 1 still needs 100 XP, but subsequent levels need much more
  streak: 0,
  totalDays: 0,
  achievements: [],
  coins: 50, // Give players starting coins to explore the shop
  caloriesLogged: 0,
  mealsLogged: 0,
  daysActive: 0
}

const achievements: Achievement[] = [
  {
    id: 'first-meal',
    title: 'First Steps',
    description: 'Log your first meal',
    icon: '🍎',
    earned: false,
    category: 'meals',
    requirement: 1,
    progress: 0
  },
  {
    id: 'daily-goal',
    title: 'Daily Champion',
    description: 'Complete a full day of logging',
    icon: '🏆',
    earned: false,
    category: 'calories',
    requirement: 1,
    progress: 0
  },
  {
    id: 'streak-3',
    title: 'Habit Former',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    earned: false,
    category: 'streak',
    requirement: 3,
    progress: 0
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    earned: false,
    category: 'streak',
    requirement: 7,
    progress: 0
  },
  {
    id: 'weight-loss-1',
    title: 'First Milestone',
    description: 'Lose your first pound',
    icon: '📉',
    earned: false,
    category: 'weight',
    requirement: 1,
    progress: 0
  },
  {
    id: 'meal-master',
    title: 'Meal Master',
    description: 'Log 50 meals',
    icon: '🍽️',
    earned: false,
    category: 'meals',
    requirement: 50,
    progress: 0
  },
  {
    id: 'calorie-counter',
    title: 'Calorie Counter',
    description: 'Log 10,000 calories',
    icon: '🔢',
    earned: false,
    category: 'calories',
    requirement: 10000,
    progress: 0
  }
]

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<GameStats>(defaultStats)
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const [currentTheme, setCurrentTheme] = useState<string>('default')
  const [ownedThemes, setOwnedThemes] = useState<string[]>(['default'])
  const { showInAppNotification } = useNotifications()

  useEffect(() => {
    // Load data from localStorage
    const savedStats = localStorage.getItem('gameStats')
    const savedEntries = localStorage.getItem('foodEntries')
    const savedTheme = localStorage.getItem('currentTheme')
    const savedOwnedThemes = localStorage.getItem('ownedThemes')
    
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats)
      setStats({
        ...parsedStats,
        achievements: parsedStats.achievements || achievements
      })
    } else {
      setStats(prev => ({ ...prev, achievements }))
    }
    
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries)
      setFoodEntries(parsedEntries.map((entry: FoodEntry & { timestamp: string }) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })))
    }

    if (savedTheme) {
      setCurrentTheme(savedTheme)
    }

    if (savedOwnedThemes) {
      setOwnedThemes(JSON.parse(savedOwnedThemes))
    }
  }, [])

  useEffect(() => {
    // Save data to localStorage whenever it changes
    localStorage.setItem('gameStats', JSON.stringify(stats))
    localStorage.setItem('foodEntries', JSON.stringify(foodEntries))
    localStorage.setItem('currentTheme', currentTheme)
    localStorage.setItem('ownedThemes', JSON.stringify(ownedThemes))
  }, [stats, foodEntries, currentTheme, ownedThemes])

  const addFoodEntry = (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date()
    }

    setFoodEntries(prev => [...prev, newEntry])
    
    // Update stats - Made XP much harder to earn
    const xpGained = Math.max(1, Math.floor(entry.calories / 50)) // Changed from 10 to 50 calories per XP
    const newXp = stats.xp + xpGained
    // Exponential leveling: level 1 needs 100 XP, level 2 needs 250 XP, level 3 needs 450 XP, etc.
    const xpRequiredForLevel = (level: number) => level * level * 50 + 50
    
    let newLevel = stats.level
    let totalXpNeeded = xpRequiredForLevel(newLevel)
    
    // Calculate new level based on exponential requirements
    while (newXp >= totalXpNeeded) {
      newLevel++
      totalXpNeeded = xpRequiredForLevel(newLevel)
    }
    
    const leveledUp = newLevel > stats.level
    const xpToNextLevel = totalXpNeeded - newXp

    setStats(prev => ({
      ...prev,
      xp: newXp,
      level: newLevel,
      xpToNextLevel: xpToNextLevel,
      caloriesLogged: prev.caloriesLogged + entry.calories,
      mealsLogged: prev.mealsLogged + 1,
      coins: prev.coins + (leveledUp ? 100 : 5) // Increased level-up reward, reduced meal reward
    }))

    // Update streak
    updateStreak()
    
    // Check achievements
    checkAchievements()
    
    // Update last activity
    localStorage.setItem('lastFoodLog', new Date().toISOString())
    
    // Show notifications
    if (leveledUp) {
      showInAppNotification(`🎉 Level Up! You're now level ${newLevel}! +100 coins!`, 'success')
    }
    
    showInAppNotification(`+${xpGained} XP! ${leveledUp ? '' : `${xpToNextLevel} XP to next level`}`, 'success')
  }

  const updateWeight = (weight: number) => {
    const previousWeight = stats.currentWeight
    setStats(prev => ({
      ...prev,
      currentWeight: weight,
      startWeight: prev.startWeight || weight
    }))

    if (previousWeight && weight < previousWeight) {
      const weightLost = previousWeight - weight
      showInAppNotification(`🎉 You lost ${weightLost.toFixed(1)} lbs! Keep it up!`, 'success')
    }
  }

  const setTargetWeight = (weight: number) => {
    setStats(prev => ({
      ...prev,
      targetWeight: weight
    }))
  }

  const updateStreak = () => {
    const today = new Date()
    const todayString = today.toDateString()
    const lastLogDate = localStorage.getItem('lastLogDate')
    
    if (lastLogDate !== todayString) {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastLogDate === yesterdayString) {
        // Continue streak - reward bonus coins for maintaining streaks
        const streakBonus = Math.min(20, Math.floor((stats.streak + 1) / 3) * 5) // 5 coins per 3-day streak milestone
        setStats(prev => ({
          ...prev,
          streak: prev.streak + 1,
          daysActive: prev.daysActive + 1,
          coins: prev.coins + streakBonus
        }))
        if (streakBonus > 0) {
          showInAppNotification(`🔥 Streak bonus! +${streakBonus} coins for ${stats.streak + 1} days!`, 'success')
        }
      } else if (lastLogDate) {
        // Streak broken
        setStats(prev => ({
          ...prev,
          streak: 1,
          daysActive: prev.daysActive + 1
        }))
      } else {
        // First log
        setStats(prev => ({
          ...prev,
          streak: 1,
          daysActive: 1
        }))
      }
      
      localStorage.setItem('lastLogDate', todayString)
    }
  }

  const getDailyCalories = () => {
    const today = new Date()
    return getCaloriesForDate(today)
  }

  const getCaloriesForDate = (date: Date) => {
    const dateString = date.toDateString()
    return foodEntries
      .filter(entry => entry.timestamp.toDateString() === dateString)
      .reduce((total, entry) => total + entry.calories, 0)
  }

  const getWeeklyProgress = () => {
    const today = new Date()
    const week = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      week.push(getCaloriesForDate(date))
    }
    
    return week
  }

  const getTodaysEntries = () => {
    const today = new Date()
    const todayString = today.toDateString()
    return foodEntries.filter(entry => entry.timestamp.toDateString() === todayString)
  }

  const checkAchievements = () => {
    const updatedAchievements = stats.achievements.map(achievement => {
      if (achievement.earned) return achievement

      let progress = 0
      let earned = false

      switch (achievement.category) {
        case 'meals':
          progress = stats.mealsLogged
          break
        case 'calories':
          progress = achievement.id === 'daily-goal' ? (getDailyCalories() > 0 ? 1 : 0) : stats.caloriesLogged
          break
        case 'streak':
          progress = stats.streak
          break
        case 'weight':
          if (stats.startWeight && stats.currentWeight) {
            progress = stats.startWeight - stats.currentWeight
          }
          break
      }

      earned = progress >= achievement.requirement

      if (earned && !achievement.earned) {
        showInAppNotification(`🏆 Achievement Unlocked: ${achievement.title}!`, 'success')
        setStats(prev => ({
          ...prev,
          coins: prev.coins + 150 // Increased bonus coins for achievements since XP is harder
        }))
      }

      return {
        ...achievement,
        progress,
        earned,
        earnedAt: earned ? new Date() : undefined
      }
    })

    setStats(prev => ({
      ...prev,
      achievements: updatedAchievements
    }))
  }

  const purchaseTheme = (themeId: string, price: number) => {
    if (price > 0) {
      // Purchase theme
      if (stats.coins >= price && !ownedThemes.includes(themeId)) {
        setStats(prev => ({
          ...prev,
          coins: prev.coins - price
        }))
        setOwnedThemes(prev => [...prev, themeId])
        setCurrentTheme(themeId)
      }
    } else {
      // Apply owned theme
      if (ownedThemes.includes(themeId) || themeId === 'default') {
        setCurrentTheme(themeId)
      }
    }
  }

  const value: GameContextType = {
    stats,
    foodEntries,
    currentTheme,
    ownedThemes,
    addFoodEntry,
    updateWeight,
    setTargetWeight,
    getDailyCalories,
    getWeeklyProgress,
    checkAchievements,
    getTodaysEntries,
    getCaloriesForDate,
    purchaseTheme
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}