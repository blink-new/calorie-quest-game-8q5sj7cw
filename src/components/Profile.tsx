import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Progress } from './ui/progress'

import { useGame } from '../contexts/GameContext'
import { useNotifications } from '../contexts/NotificationContext'
import { User, Edit, Check, X, TrendingDown, Target, Award, Flame, Zap, Activity, Calendar as CalendarIcon, BarChart3, Trophy } from 'lucide-react'

export const Profile: React.FC = () => {
  const { stats, updateWeight, setTargetWeight, getWeeklyProgress, getWeeklyActivityProgress } = useGame()
  const { showInAppNotification } = useNotifications()
  const [isEditing, setIsEditing] = useState(false)
  const [editWeight, setEditWeight] = useState('')
  const [editTarget, setEditTarget] = useState('')
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    height: '',
    gender: 'other'
  })

  useEffect(() => {
    const savedUserInfo = localStorage.getItem('userInfo')
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo))
    }
  }, [])

  const handleSaveWeight = () => {
    if (editWeight) {
      updateWeight(parseFloat(editWeight))
      showInAppNotification('Weight updated successfully! 📊', 'success')
    }
    if (editTarget) {
      setTargetWeight(parseFloat(editTarget))
      showInAppNotification('Target weight updated! 🎯', 'success')
    }
    setIsEditing(false)
    setEditWeight('')
    setEditTarget('')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditWeight('')
    setEditTarget('')
  }

  const weightLoss = stats.startWeight && stats.currentWeight 
    ? stats.startWeight - stats.currentWeight 
    : 0

  const progressToGoal = stats.currentWeight && stats.targetWeight 
    ? ((stats.startWeight || stats.currentWeight) - stats.currentWeight) / ((stats.startWeight || stats.currentWeight) - stats.targetWeight) * 100
    : 0

  const calculateBMI = () => {
    if (userInfo.height && stats.currentWeight) {
      const heightInMeters = (parseFloat(userInfo.height) * 2.54) / 100 // Convert inches to meters
      const bmi = stats.currentWeight / (heightInMeters * heightInMeters) * 0.453592 // Convert lbs to kg
      return bmi.toFixed(1)
    }
    return null
  }

  const bmi = calculateBMI()
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' }
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' }
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' }
    return { category: 'Obese', color: 'text-red-600' }
  }

  const levelProgress = (stats.xp / (stats.level * 100)) * 100
  const weeklyCalories = getWeeklyProgress()
  const weeklyActivities = getWeeklyActivityProgress()

  // Calculate weekly averages
  const avgDailyCalories = weeklyCalories.reduce((sum, cal) => sum + cal, 0) / 7
  const totalWeeklyActivities = weeklyActivities.reduce((sum, activities) => sum + activities.length, 0)

  // Calculate streaks and achievements
  const earnedAchievements = stats.achievements.filter(a => a.earned)
  const completionRate = (earnedAchievements.length / stats.achievements.length) * 100

  return (
    <div className="space-y-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your progress and achievements
        </p>
      </motion.div>

      {/* Enhanced User Info Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 border-blue-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <User className="text-blue-600" size={20} />
              <span>Hello, {userInfo.name || 'Adventurer'}!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="text-center p-3 bg-white/50 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-blue-600">{stats.level}</div>
                <div className="text-sm text-muted-foreground">Level</div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 bg-white/50 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-orange-600">{stats.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
                <div className="flex justify-center mt-2">
                  {[...Array(Math.min(7, stats.streak))].map((_, i) => (
                    <Flame key={i} className="text-orange-500" size={12} />
                  ))}
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 bg-white/50 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-green-600">{stats.coins}</div>
                <div className="text-sm text-muted-foreground">Coins</div>
                <div className="text-xs text-green-600 mt-1">💰 Keep earning!</div>
              </motion.div>
              
              <motion.div 
                className="text-center p-3 bg-white/50 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-purple-600">{earnedAchievements.length}</div>
                <div className="text-sm text-muted-foreground">Achievements</div>
                <div className="flex justify-center mt-1">
                  <Award className="text-yellow-500" size={16} />
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Progress Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="text-indigo-600" size={20} />
              <span>Weekly Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Daily Avg Calories</span>
                  <span className="text-sm text-muted-foreground">{Math.round(avgDailyCalories)}</span>
                </div>
                <div className="space-y-1">
                  {weeklyCalories.map((calories, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="text-xs w-8">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (calories / 2500) * 100)}%` }}
                        />
                      </div>
                      <div className="text-xs w-12 text-right">{calories}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Weekly Activities</span>
                  <span className="text-sm text-muted-foreground">{totalWeeklyActivities}</span>
                </div>
                <div className="space-y-1">
                  {weeklyActivities.map((activities, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="text-xs w-8">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (activities.length / 3) * 100)}%` }}
                        />
                      </div>
                      <div className="text-xs w-12 text-right">{activities.length}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Weight Tracking */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="text-green-600" size={20} />
                <span>Weight Progress</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="hover:bg-green-50"
              >
                <Edit size={16} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current-weight">Current Weight (lbs)</Label>
                      <Input
                        id="current-weight"
                        type="number"
                        placeholder={stats.currentWeight?.toString() || ''}
                        value={editWeight}
                        onChange={(e) => setEditWeight(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="target-weight">Target Weight (lbs)</Label>
                      <Input
                        id="target-weight"
                        type="number"
                        placeholder={stats.targetWeight?.toString() || ''}
                        value={editTarget}
                        onChange={(e) => setEditTarget(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSaveWeight} className="bg-green-600 hover:bg-green-700">
                      <Check size={16} />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X size={16} />
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="display"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">
                        {stats.currentWeight || '---'}
                      </div>
                      <div className="text-sm text-muted-foreground">Current Weight</div>
                      {bmi && (
                        <div className="text-xs mt-1">
                          <span className="text-muted-foreground">BMI: </span>
                          <span className={getBMICategory(parseFloat(bmi)).color}>
                            {bmi} ({getBMICategory(parseFloat(bmi)).category})
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">
                        {stats.targetWeight || '---'}
                      </div>
                      <div className="text-sm text-muted-foreground">Target Weight</div>
                      {stats.currentWeight && stats.targetWeight && (
                        <div className="text-xs text-green-600 mt-1">
                          {(stats.currentWeight - stats.targetWeight).toFixed(1)} lbs to go
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {weightLoss > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                    >
                      <TrendingDown className="text-green-600" size={20} />
                      <span className="font-semibold text-green-600">
                        {weightLoss.toFixed(1)} lbs lost! 🎉
                      </span>
                    </motion.div>
                  )}
                  
                  {progressToGoal > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Goal</span>
                        <span className="font-medium">{Math.min(100, progressToGoal).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, progressToGoal)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievement Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="text-yellow-600" size={20} />
              <span>Achievement Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-muted-foreground">{Math.round(completionRate)}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              {['streak', 'weight', 'calories', 'meals', 'activity', 'special'].map((category) => {
                const categoryAchievements = stats.achievements.filter(a => a.category === category)
                const earnedInCategory = categoryAchievements.filter(a => a.earned).length
                const categoryProgress = categoryAchievements.length > 0 ? (earnedInCategory / categoryAchievements.length) * 100 : 0
                
                const categoryIcons = {
                  streak: '🔥',
                  weight: '⚖️',
                  calories: '🍽️',
                  meals: '🥗',
                  activity: '💪',
                  special: '⭐'
                }
                
                return (
                  <motion.div 
                    key={category}
                    className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                      <span className="text-sm font-medium capitalize">{category}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {earnedInCategory}/{categoryAchievements.length} completed
                    </div>
                    <Progress value={categoryProgress} className="h-2" />
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Stats Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="text-indigo-600" size={20} />
              <span>Your Journey</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <motion.div 
                className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-purple-600">{stats.mealsLogged}</div>
                <div className="text-sm text-muted-foreground">Meals Logged</div>
                <div className="flex justify-center mt-2">
                  <span className="text-lg">🍽️</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-pink-600">{stats.caloriesLogged.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Calories</div>
                <div className="flex justify-center mt-2">
                  <Zap className="text-pink-500" size={20} />
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-orange-600">{stats.daysActive}</div>
                <div className="text-sm text-muted-foreground">Days Active</div>
                <div className="flex justify-center mt-2">
                  <CalendarIcon className="text-orange-500" size={20} />
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-emerald-600">
                  {weightLoss > 0 ? `${weightLoss.toFixed(1)}` : '0.0'}
                </div>
                <div className="text-sm text-muted-foreground">Weight Lost (lbs)</div>
                <div className="flex justify-center mt-2">
                  <TrendingDown className="text-emerald-500" size={20} />
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-blue-600">
                  {progressToGoal > 0 ? `${Math.min(100, progressToGoal).toFixed(1)}%` : '0%'}
                </div>
                <div className="text-sm text-muted-foreground">Goal Progress</div>
                <div className="flex justify-center mt-2">
                  <Target className="text-blue-500" size={20} />
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-yellow-600">{stats.activitiesLogged || 0}</div>
                <div className="text-sm text-muted-foreground">Workouts</div>
                <div className="flex justify-center mt-2">
                  <Activity className="text-yellow-500" size={20} />
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}