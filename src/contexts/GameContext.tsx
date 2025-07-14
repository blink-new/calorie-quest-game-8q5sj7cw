import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNotifications } from './NotificationContext'
import { achievements } from '../data/achievements'

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
  activitiesLogged: number
  caloriesBurned: number
  activeMinutes: number
  activityStreak: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: Date
  category: 'streak' | 'weight' | 'calories' | 'meals' | 'special' | 'activity'
  requirement: number
  progress: number
}

interface FoodEntry {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  timestamp: Date
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

interface ActivityEntry {
  id: string
  name: string
  type: 'cardio' | 'strength' | 'sports' | 'walking' | 'other'
  duration: number
  caloriesBurned: number
  intensity: 'low' | 'medium' | 'high'
  timestamp: Date
}

interface GameContextType {
  stats: GameStats
  foodEntries: FoodEntry[]
  activityEntries: ActivityEntry[]
  currentTheme: string
  ownedThemes: string[]
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => void
  removeFoodEntry: (entryId: string) => void
  addActivityEntry: (entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => void
  removeActivityEntry: (entryId: string) => void
  updateWeight: (weight: number) => void
  setTargetWeight: (weight: number) => void
  getDailyCalories: () => number
  getDailyMacros: () => { protein: number; carbs: number; fat: number }
  getDailyActivities: () => ActivityEntry[]
  getDailyCaloriesBurned: () => number
  getWeeklyProgress: () => number[]
  getWeeklyActivityProgress: () => number[]
  checkAchievements: () => void
  getTodaysEntries: () => FoodEntry[]
  getTodaysActivities: () => ActivityEntry[]
  getCaloriesForDate: (date: Date) => number
  getActivitiesForDate: (date: Date) => ActivityEntry[]
  purchaseTheme: (themeId: string, price: number) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const defaultStats: GameStats = {
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  streak: 0,
  totalDays: 0,
  achievements: achievements.map(achievement => ({ ...achievement })),
  coins: 10,
  caloriesLogged: 0,
  mealsLogged: 0,
  daysActive: 0,
  activitiesLogged: 0,
  caloriesBurned: 0,
  activeMinutes: 0,
  activityStreak: 0
}

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<GameStats>(defaultStats)
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([])
  const [currentTheme, setCurrentTheme] = useState<string>('default')
  const [ownedThemes, setOwnedThemes] = useState<string[]>(['default'])
  const { showInAppNotification } = useNotifications()

  useEffect(() => {
    const savedStats = localStorage.getItem('gameStats')
    const savedEntries = localStorage.getItem('foodEntries')
    const savedActivities = localStorage.getItem('activityEntries')
    const savedTheme = localStorage.getItem('currentTheme')
    const savedOwnedThemes = localStorage.getItem('ownedThemes')
    
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats)
        const mergedAchievements = achievements.map(defaultAchievement => {
          const savedAchievement = parsedStats.achievements?.find((a: Achievement) => a.id === defaultAchievement.id)
          return savedAchievement ? {
            ...defaultAchievement,
            ...savedAchievement,
            earnedAt: savedAchievement.earnedAt ? new Date(savedAchievement.earnedAt) : undefined
          } : defaultAchievement
        })
        
        setStats({
          ...defaultStats,
          ...parsedStats,
          achievements: mergedAchievements,
          activitiesLogged: parsedStats.activitiesLogged || 0,
          caloriesBurned: parsedStats.caloriesBurned || 0,
          activeMinutes: parsedStats.activeMinutes || 0,
          activityStreak: parsedStats.activityStreak || 0
        })
      } catch (error) {
        console.error('Error parsing saved stats:', error)
        setStats(defaultStats)
      }
    }
    
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries)
        setFoodEntries(parsedEntries.map((entry: FoodEntry & { timestamp: string }) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
          protein: entry.protein ?? 0,
          carbs: entry.carbs ?? 0,
          fat: entry.fat ?? 0
        })))
      } catch (error) {
        console.error('Error parsing saved entries:', error)
      }
    }

    if (savedActivities) {
      try {
        const parsedActivities = JSON.parse(savedActivities)
        setActivityEntries(parsedActivities.map((entry: ActivityEntry & { timestamp: string }) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        })))
      } catch (error) {
        console.error('Error parsing saved activities:', error)
      }
    }

    if (savedTheme) {
      setCurrentTheme(savedTheme)
    }

    if (savedOwnedThemes) {
      try {
        setOwnedThemes(JSON.parse(savedOwnedThemes))
      } catch (error) {
        console.error('Error parsing saved themes:', error)
      }
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('gameStats', JSON.stringify(stats))
      localStorage.setItem('foodEntries', JSON.stringify(foodEntries))
      localStorage.setItem('activityEntries', JSON.stringify(activityEntries))
      localStorage.setItem('currentTheme', currentTheme)
      localStorage.setItem('ownedThemes', JSON.stringify(ownedThemes))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }, [stats, foodEntries, activityEntries, currentTheme, ownedThemes])

  const addFoodEntry = (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    
    setFoodEntries(prev => [...prev, newEntry])
    
    setStats(prev => {
      const newStats = {
        ...prev,
        caloriesLogged: prev.caloriesLogged + entry.calories,
        mealsLogged: prev.mealsLogged + 1,
        xp: prev.xp + 10 + Math.floor(entry.calories / 10)
      }
      
      while (newStats.xp >= newStats.xpToNextLevel) {
        newStats.xp -= newStats.xpToNextLevel
        newStats.level += 1
        newStats.coins += newStats.level * 5
        newStats.xpToNextLevel = Math.floor(newStats.xpToNextLevel * 1.2)
        showInAppNotification(`🎉 Level up! You're now level ${newStats.level}!`, 'success')
      }
      
      return newStats
    })
    
    localStorage.setItem('lastFoodLog', new Date().toISOString())
    setTimeout(checkAchievements, 100)
    showInAppNotification(`Added ${entry.name} (${entry.calories} cal)`, 'success')
  }

  const removeFoodEntry = (entryId: string) => {
    const entryToRemove = foodEntries.find(entry => entry.id === entryId)
    if (!entryToRemove) return
    
    setFoodEntries(prev => prev.filter(entry => entry.id !== entryId))
    setStats(prev => ({
      ...prev,
      caloriesLogged: Math.max(0, prev.caloriesLogged - entryToRemove.calories),
      mealsLogged: Math.max(0, prev.mealsLogged - 1)
    }))
    
    showInAppNotification(`Removed ${entryToRemove.name}`, 'info')
  }

  const addActivityEntry = (entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => {
    const newEntry: ActivityEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    
    setActivityEntries(prev => [...prev, newEntry])
    
    setStats(prev => {
      const newStats = {
        ...prev,
        activitiesLogged: prev.activitiesLogged + 1,
        caloriesBurned: prev.caloriesBurned + entry.caloriesBurned,
        activeMinutes: prev.activeMinutes + entry.duration,
        xp: prev.xp + 15 + Math.floor(entry.caloriesBurned / 5)
      }
      
      while (newStats.xp >= newStats.xpToNextLevel) {
        newStats.xp -= newStats.xpToNextLevel
        newStats.level += 1
        newStats.coins += newStats.level * 5
        newStats.xpToNextLevel = Math.floor(newStats.xpToNextLevel * 1.2)
        showInAppNotification(`🎉 Level up! You're now level ${newStats.level}!`, 'success')
      }
      
      return newStats
    })
    
    setTimeout(checkAchievements, 100)
    showInAppNotification(`Added ${entry.name} (${entry.caloriesBurned} cal burned)`, 'success')
  }

  const removeActivityEntry = (entryId: string) => {
    const entryToRemove = activityEntries.find(entry => entry.id === entryId)
    if (!entryToRemove) return
    
    setActivityEntries(prev => prev.filter(entry => entry.id !== entryId))
    setStats(prev => ({
      ...prev,
      activitiesLogged: Math.max(0, prev.activitiesLogged - 1),
      caloriesBurned: Math.max(0, prev.caloriesBurned - entryToRemove.caloriesBurned),
      activeMinutes: Math.max(0, prev.activeMinutes - entryToRemove.duration)
    }))
    
    showInAppNotification(`Removed ${entryToRemove.name}`, 'info')
  }

  const updateWeight = (weight: number) => {
    setStats(prev => {
      const newStats = { ...prev, currentWeight: weight }
      
      if (!prev.startWeight) {
        newStats.startWeight = weight
      }
      
      if (prev.startWeight && weight < prev.startWeight) {
        const weightLost = prev.startWeight - weight
        newStats.xp = prev.xp + Math.floor(weightLost * 50)
      }
      
      return newStats
    })
    
    setTimeout(checkAchievements, 100)
    showInAppNotification(`Weight updated to ${weight} lbs`, 'success')
  }

  const setTargetWeight = (weight: number) => {
    setStats(prev => ({ ...prev, targetWeight: weight }))
    showInAppNotification(`Target weight set to ${weight} lbs`, 'success')
  }

  const getDailyCalories = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return foodEntries
      .filter(entry => entry.timestamp >= today && entry.timestamp < tomorrow)
      .reduce((total, entry) => total + entry.calories, 0)
  }

  const getDailyMacros = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const todaysEntries = foodEntries.filter(entry => entry.timestamp >= today && entry.timestamp < tomorrow)
    
    return todaysEntries.reduce(
      (totals, entry) => ({
        protein: totals.protein + (entry.protein || 0),
        carbs: totals.carbs + (entry.carbs || 0),
        fat: totals.fat + (entry.fat || 0)
      }),
      { protein: 0, carbs: 0, fat: 0 }
    )
  }

  const getDailyActivities = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return activityEntries.filter(entry => entry.timestamp >= today && entry.timestamp < tomorrow)
  }

  const getDailyCaloriesBurned = () => {
    return getDailyActivities().reduce((total, entry) => total + entry.caloriesBurned, 0)
  }

  const getWeeklyProgress = () => {
    const today = new Date()
    const weekData = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      
      const dayCalories = foodEntries
        .filter(entry => entry.timestamp >= date && entry.timestamp < nextDay)
        .reduce((total, entry) => total + entry.calories, 0)
      
      weekData.push(dayCalories)
    }
    
    return weekData
  }

  const getWeeklyActivityProgress = () => {
    const today = new Date()
    const weekData = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      
      const dayCaloriesBurned = activityEntries
        .filter(entry => entry.timestamp >= date && entry.timestamp < nextDay)
        .reduce((total, entry) => total + entry.caloriesBurned, 0)
      
      weekData.push(dayCaloriesBurned)
    }
    
    return weekData
  }

  const getTodaysEntries = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return foodEntries.filter(entry => entry.timestamp >= today && entry.timestamp < tomorrow)
  }

  const getTodaysActivities = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return activityEntries.filter(entry => entry.timestamp >= today && entry.timestamp < tomorrow)
  }

  const getCaloriesForDate = (date: Date) => {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)
    
    return foodEntries
      .filter(entry => entry.timestamp >= startOfDay && entry.timestamp < endOfDay)
      .reduce((total, entry) => total + entry.calories, 0)
  }

  const getActivitiesForDate = (date: Date) => {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)
    
    return activityEntries.filter(entry => entry.timestamp >= startOfDay && entry.timestamp < endOfDay)
  }

  const checkAchievements = () => {
    setStats(prev => {
      const newStats = { ...prev }
      
      newStats.achievements = prev.achievements.map(achievement => {
        if (achievement.earned) return achievement
        
        let progress = 0
        let earned = false
        
        switch (achievement.category) {
          case 'meals':
            progress = prev.mealsLogged
            break
          case 'calories':
            progress = prev.caloriesLogged
            break
          case 'streak':
            progress = prev.streak
            break
          case 'weight':
            if (prev.startWeight && prev.currentWeight) {
              progress = prev.startWeight - prev.currentWeight
            }
            break
          case 'activity':
            progress = prev.activitiesLogged
            break
          case 'special':
            if (achievement.id.includes('level')) {
              progress = prev.level
            } else if (achievement.id.includes('coin')) {
              progress = prev.coins
            }
            break
        }
        
        earned = progress >= achievement.requirement
        
        if (earned && !achievement.earned) {
          showInAppNotification(`🏆 Achievement unlocked: ${achievement.title}!`, 'success')
          newStats.coins += 25
          newStats.xp += 100
          
          return {
            ...achievement,
            earned: true,
            earnedAt: new Date(),
            progress: achievement.requirement
          }
        }
        
        return {
          ...achievement,
          progress: Math.min(progress, achievement.requirement)
        }
      })
      
      return newStats
    })
  }

  const purchaseTheme = (themeId: string, price: number) => {
    if (stats.coins >= price && !ownedThemes.includes(themeId)) {
      setStats(prev => ({ ...prev, coins: prev.coins - price }))
      setOwnedThemes(prev => [...prev, themeId])
      setCurrentTheme(themeId)
      showInAppNotification(`🎨 Theme "${themeId}" purchased and activated!`, 'success')
    } else if (ownedThemes.includes(themeId)) {
      setCurrentTheme(themeId)
      showInAppNotification(`🎨 Theme "${themeId}" activated!`, 'success')
    } else {
      showInAppNotification(`❌ Not enough coins to purchase this theme`, 'error')
    }
  }

  const value: GameContextType = {
    stats,
    foodEntries,
    activityEntries,
    currentTheme,
    ownedThemes,
    addFoodEntry,
    removeFoodEntry,
    addActivityEntry,
    removeActivityEntry,
    updateWeight,
    setTargetWeight,
    getDailyCalories,
    getDailyMacros,
    getDailyActivities,
    getDailyCaloriesBurned,
    getWeeklyProgress,
    getWeeklyActivityProgress,
    checkAchievements,
    getTodaysEntries,
    getTodaysActivities,
    getCaloriesForDate,
    getActivitiesForDate,
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