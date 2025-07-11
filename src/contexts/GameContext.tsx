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
  // New activity stats
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
  timestamp: Date
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}

// New interface for activity entries
interface ActivityEntry {
  id: string
  name: string
  type: 'cardio' | 'strength' | 'sports' | 'walking' | 'other'
  duration: number // in minutes
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
  xpToNextLevel: 100, // Level 1 still needs 100 XP, but subsequent levels need much more
  streak: 0,
  totalDays: 0,
  achievements: [],
  coins: 10, // Reduced starting coins to make them more valuable
  caloriesLogged: 0,
  mealsLogged: 0,
  daysActive: 0,
  // New activity stats
  activitiesLogged: 0,
  caloriesBurned: 0,
  activeMinutes: 0,
  activityStreak: 0
}

const achievements: Achievement[] = [
  // Existing achievements
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
  },
  // New activity achievements
  {
    id: 'first-workout',
    title: 'First Sweat',
    description: 'Log your first workout',
    icon: '💪',
    earned: false,
    category: 'activity',
    requirement: 1,
    progress: 0
  },
  {
    id: 'active-week',
    title: 'Active Week',
    description: 'Work out 5 times in a week',
    icon: '🏃',
    earned: false,
    category: 'activity',
    requirement: 5,
    progress: 0
  },
  {
    id: 'calorie-burner',
    title: 'Calorie Burner',
    description: 'Burn 1,000 calories through exercise',
    icon: '🔥',
    earned: false,
    category: 'activity',
    requirement: 1000,
    progress: 0
  },
  {
    id: 'endurance-master',
    title: 'Endurance Master',
    description: 'Exercise for 10 hours total',
    icon: '⏱️',
    earned: false,
    category: 'activity',
    requirement: 600, // 10 hours in minutes
    progress: 0
  },
  {
    id: 'activity-streak',
    title: 'Fitness Streak',
    description: 'Exercise 7 days in a row',
    icon: '🔥',
    earned: false,
    category: 'activity',
    requirement: 7,
    progress: 0
  }
]

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<GameStats>(defaultStats)
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>([])
  const [currentTheme, setCurrentTheme] = useState<string>('default')
  const [ownedThemes, setOwnedThemes] = useState<string[]>(['default'])
  const { showInAppNotification } = useNotifications()

  useEffect(() => {
    // Load data from localStorage
    const savedStats = localStorage.getItem('gameStats')
    const savedEntries = localStorage.getItem('foodEntries')
    const savedActivities = localStorage.getItem('activityEntries')
    const savedTheme = localStorage.getItem('currentTheme')
    const savedOwnedThemes = localStorage.getItem('ownedThemes')
    
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats)
      setStats({
        ...parsedStats,
        achievements: parsedStats.achievements || achievements,
        // Ensure new activity stats exist
        activitiesLogged: parsedStats.activitiesLogged || 0,
        caloriesBurned: parsedStats.caloriesBurned || 0,
        activeMinutes: parsedStats.activeMinutes || 0,
        activityStreak: parsedStats.activityStreak || 0
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

    if (savedActivities) {
      const parsedActivities = JSON.parse(savedActivities)
      setActivityEntries(parsedActivities.map((entry: ActivityEntry & { timestamp: string }) => ({
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
    localStorage.setItem('activityEntries', JSON.stringify(activityEntries))
    localStorage.setItem('currentTheme', currentTheme)
    localStorage.setItem('ownedThemes', JSON.stringify(ownedThemes))
  }, [stats, foodEntries, activityEntries, currentTheme, ownedThemes])

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
      coins: prev.coins + (leveledUp ? 50 : 2) // Reduced both level-up and meal rewards
    }))

    // Update streak
    updateStreak()
    
    // Check achievements
    checkAchievements()
    
    // Update last activity
    localStorage.setItem('lastFoodLog', new Date().toISOString())
    
    // Show notifications
    if (leveledUp) {
      showInAppNotification(`🎉 Level Up! You're now level ${newLevel}! +50 coins!`, 'success')
    }
    
    showInAppNotification(`+${xpGained} XP! ${leveledUp ? '' : `${xpToNextLevel} XP to next level`}`, 'success')
  }

  const addActivityEntry = (entry: Omit<ActivityEntry, 'id' | 'timestamp'>) => {
    const newEntry: ActivityEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date()
    }

    setActivityEntries(prev => [...prev, newEntry])
    
    // Calculate XP based on duration and intensity
    const intensityMultiplier = {
      low: 1,
      medium: 1.5,
      high: 2
    }[entry.intensity]
    
    const xpGained = Math.max(2, Math.floor(entry.duration * intensityMultiplier / 10)) // 1 XP per 10 minutes of low intensity
    const coinsGained = Math.max(1, Math.floor(entry.duration / 15)) // 1 coin per 15 minutes
    
    const newXp = stats.xp + xpGained
    const xpRequiredForLevel = (level: number) => level * level * 50 + 50
    
    let newLevel = stats.level
    let totalXpNeeded = xpRequiredForLevel(newLevel)
    
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
      activitiesLogged: prev.activitiesLogged + 1,
      caloriesBurned: prev.caloriesBurned + entry.caloriesBurned,
      activeMinutes: prev.activeMinutes + entry.duration,
      coins: prev.coins + (leveledUp ? 50 : coinsGained)
    }))

    // Update activity streak
    updateActivityStreak()
    
    // Check achievements
    checkAchievements()
    
    // Update last activity
    localStorage.setItem('lastActivityLog', new Date().toISOString())
    
    // Show notifications
    if (leveledUp) {
      showInAppNotification(`🎉 Level Up! You're now level ${newLevel}! +50 coins!`, 'success')
    }
    
    showInAppNotification(`+${xpGained} XP! +${coinsGained} coins from activity! 💪`, 'success')
  }

  const removeActivityEntry = (entryId: string) => {
    const entryToRemove = activityEntries.find(entry => entry.id === entryId)
    if (!entryToRemove) return
    
    setActivityEntries(prev => prev.filter(entry => entry.id !== entryId))
    
    // Update stats - subtract the removed entry's impact
    const intensityMultiplier = {
      low: 1,
      medium: 1.5,
      high: 2
    }[entryToRemove.intensity]
    
    const xpLost = Math.max(2, Math.floor(entryToRemove.duration * intensityMultiplier / 10))
    const coinsLost = Math.max(1, Math.floor(entryToRemove.duration / 15))
    const newXp = Math.max(0, stats.xp - xpLost)
    
    // Recalculate level based on new XP
    const xpRequiredForLevel = (level: number) => level * level * 50 + 50
    let newLevel = 1
    let totalXpNeeded = xpRequiredForLevel(newLevel)
    
    while (newXp >= totalXpNeeded) {
      newLevel++
      totalXpNeeded = xpRequiredForLevel(newLevel)
    }
    
    const leveledDown = newLevel < stats.level
    const xpToNextLevel = totalXpNeeded - newXp
    
    setStats(prev => ({
      ...prev,
      xp: newXp,
      level: newLevel,
      xpToNextLevel: xpToNextLevel,
      activitiesLogged: Math.max(0, prev.activitiesLogged - 1),
      caloriesBurned: Math.max(0, prev.caloriesBurned - entryToRemove.caloriesBurned),
      activeMinutes: Math.max(0, prev.activeMinutes - entryToRemove.duration),
      coins: Math.max(0, prev.coins - coinsLost)
    }))
    
    if (leveledDown) {
      showInAppNotification(`⬇️ Level down to ${newLevel}. Keep active to level up again!`, 'info')
    }
    
    showInAppNotification(`Activity entry removed (-${xpLost} XP)`, 'info')
  }

  const updateActivityStreak = () => {
    const today = new Date()
    const todayString = today.toDateString()
    const lastActivityDate = localStorage.getItem('lastActivityDate')
    
    if (lastActivityDate !== todayString) {
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()
      
      if (lastActivityDate === yesterdayString) {
        // Continue streak
        setStats(prev => ({
          ...prev,
          activityStreak: prev.activityStreak + 1
        }))
      } else if (lastActivityDate) {
        // Streak broken
        setStats(prev => ({
          ...prev,
          activityStreak: 1
        }))
      } else {
        // First activity
        setStats(prev => ({
          ...prev,
          activityStreak: 1
        }))
      }
      
      localStorage.setItem('lastActivityDate', todayString)
    }
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
        const streakBonus = Math.min(15, Math.floor((stats.streak + 1) / 7) * 3) // 3 coins per 7-day streak milestone
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

  const getDailyActivities = () => {
    const today = new Date()
    return activityEntries.filter(entry => entry.timestamp.toDateString() === today.toDateString())
  }

  const getDailyCaloriesBurned = () => {
    const today = new Date()
    return activityEntries
      .filter(entry => entry.timestamp.toDateString() === today.toDateString())
      .reduce((total, entry) => total + entry.caloriesBurned, 0)
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

  const getWeeklyActivityProgress = () => {
    const today = new Date()
    const week = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      week.push(getActivitiesForDate(date))
    }
    
    return week
  }

  const getTodaysEntries = () => {
    const today = new Date()
    const todayString = today.toDateString()
    return foodEntries.filter(entry => entry.timestamp.toDateString() === todayString)
  }

  const getTodaysActivities = () => {
    const today = new Date()
    const todayString = today.toDateString()
    return activityEntries.filter(entry => entry.timestamp.toDateString() === todayString)
  }

  const getCaloriesForDate = (date: Date) => {
    const dateString = date.toDateString()
    return foodEntries
      .filter(entry => entry.timestamp.toDateString() === dateString)
      .reduce((total, entry) => total + entry.calories, 0)
  }

  const getActivitiesForDate = (date: Date) => {
    const dateString = date.toDateString()
    return activityEntries
      .filter(entry => entry.timestamp.toDateString() === dateString)
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
        case 'activity':
          switch (achievement.id) {
            case 'first-workout':
              progress = stats.activitiesLogged
              break
            case 'active-week': {
              const weeklyActivities = getWeeklyActivityProgress()
              progress = weeklyActivities.filter(dayActivities => dayActivities.length > 0).length
              break
            }
            case 'calorie-burner':
              progress = stats.caloriesBurned
              break
            case 'endurance-master':
              progress = stats.activeMinutes
              break
            case 'activity-streak':
              progress = stats.activityStreak
              break
          }
          break
      }

      earned = progress >= achievement.requirement

      if (earned && !achievement.earned) {
        showInAppNotification(`🏆 Achievement Unlocked: ${achievement.title}!`, 'success')
        setStats(prev => ({
          ...prev,
          coins: prev.coins + 25 // Significantly reduced achievement rewards
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

  const removeFoodEntry = (entryId: string) => {
    const entryToRemove = foodEntries.find(entry => entry.id === entryId)
    if (!entryToRemove) return
    
    setFoodEntries(prev => prev.filter(entry => entry.id !== entryId))
    
    // Update stats - subtract the removed entry's impact
    const xpLost = Math.max(1, Math.floor(entryToRemove.calories / 50))
    const newXp = Math.max(0, stats.xp - xpLost)
    
    // Recalculate level based on new XP
    const xpRequiredForLevel = (level: number) => level * level * 50 + 50
    let newLevel = 1
    let totalXpNeeded = xpRequiredForLevel(newLevel)
    
    while (newXp >= totalXpNeeded) {
      newLevel++
      totalXpNeeded = xpRequiredForLevel(newLevel)
    }
    
    const leveledDown = newLevel < stats.level
    const xpToNextLevel = totalXpNeeded - newXp
    
    setStats(prev => ({
      ...prev,
      xp: newXp,
      level: newLevel,
      xpToNextLevel: xpToNextLevel,
      caloriesLogged: Math.max(0, prev.caloriesLogged - entryToRemove.calories),
      mealsLogged: Math.max(0, prev.mealsLogged - 1),
      coins: Math.max(0, prev.coins - 2) // Remove the meal reward coins
    }))
    
    if (leveledDown) {
      showInAppNotification(`⬇️ Level down to ${newLevel}. Keep logging to level up again!`, 'info')
    }
    
    showInAppNotification(`Food entry removed (-${xpLost} XP)`, 'info')
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