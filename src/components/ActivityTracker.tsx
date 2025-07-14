import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useGame } from '../contexts/GameContext'
import { useNotifications } from '../contexts/NotificationContext'
import { Plus, Flame, Timer, Target, Trash2, Activity, Zap, TrendingUp, Clock, Award } from 'lucide-react'

// Common activities with estimated calories per minute
const COMMON_ACTIVITIES = [
  { name: 'Running', type: 'cardio', caloriesPerMin: 12, intensity: 'high' },
  { name: 'Walking', type: 'walking', caloriesPerMin: 4, intensity: 'low' },
  { name: 'Cycling', type: 'cardio', caloriesPerMin: 8, intensity: 'medium' },
  { name: 'Swimming', type: 'cardio', caloriesPerMin: 10, intensity: 'high' },
  { name: 'Weight Training', type: 'strength', caloriesPerMin: 6, intensity: 'medium' },
  { name: 'Yoga', type: 'other', caloriesPerMin: 3, intensity: 'low' },
  { name: 'Basketball', type: 'sports', caloriesPerMin: 9, intensity: 'high' },
  { name: 'Tennis', type: 'sports', caloriesPerMin: 8, intensity: 'medium' },
  { name: 'Dancing', type: 'cardio', caloriesPerMin: 5, intensity: 'medium' },
  { name: 'Hiking', type: 'walking', caloriesPerMin: 6, intensity: 'medium' }
]

export const ActivityTracker: React.FC = () => {
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [activityName, setActivityName] = useState('')
  const [duration, setDuration] = useState('')
  const [caloriesBurned, setCaloriesBurned] = useState('')
  const [activityType, setActivityType] = useState<'cardio' | 'strength' | 'sports' | 'walking' | 'other'>('cardio')
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium')
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const { 
    stats, 
    addActivityEntry, 
    removeActivityEntry, 
    getDailyCaloriesBurned, 
    getTodaysActivities 
  } = useGame()
  const { showInAppNotification } = useNotifications()

  const handleAddActivity = () => {
    if (!activityName || !duration || !caloriesBurned) {
      showInAppNotification('Please fill in all fields', 'error')
      return
    }

    addActivityEntry({
      name: activityName,
      type: activityType,
      duration: parseInt(duration),
      caloriesBurned: parseInt(caloriesBurned),
      intensity
    })

    setActivityName('')
    setDuration('')
    setCaloriesBurned('')
    setIsAddingActivity(false)
    showInAppNotification('Activity logged successfully! 💪', 'success')
  }

  const handleActivitySuggestion = (activity: typeof COMMON_ACTIVITIES[0]) => {
    setActivityName(activity.name)
    setActivityType(activity.type as typeof activityType)
    setIntensity(activity.intensity as typeof intensity)
    setShowSuggestions(false)
    
    // Auto-calculate calories if duration is set
    if (duration) {
      const estimatedCalories = Math.round(parseInt(duration) * activity.caloriesPerMin)
      setCaloriesBurned(estimatedCalories.toString())
    }
  }

  // Auto-calculate calories when duration changes for suggested activities
  const handleDurationChange = (newDuration: string) => {
    setDuration(newDuration)
    
    const suggestedActivity = COMMON_ACTIVITIES.find(a => a.name === activityName)
    if (suggestedActivity && newDuration) {
      const estimatedCalories = Math.round(parseInt(newDuration) * suggestedActivity.caloriesPerMin)
      setCaloriesBurned(estimatedCalories.toString())
    }
  }

  const todaysActivities = getTodaysActivities()
  const dailyCaloriesBurned = getDailyCaloriesBurned()
  const targetCaloriesBurned = 300 // This could be customizable
  const progressPercentage = Math.min(100, (dailyCaloriesBurned / targetCaloriesBurned) * 100)

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'cardio': return '🏃'
      case 'strength': return '💪'
      case 'sports': return '⚽'
      case 'walking': return '🚶'
      default: return '🏋️'
    }
  }

  const getIntensityBadgeColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'bg-green-100 text-green-700 border-green-300'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'high': return 'bg-red-100 text-red-700 border-red-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  // Calculate weekly activity stats
  const totalActiveMinutes = stats.activeMinutes || 0
  const weeklyGoal = 150 // WHO recommendation: 150 minutes per week
  const weeklyProgress = Math.min(100, (totalActiveMinutes / weeklyGoal) * 100)

  return (
    <div className="space-y-6 pb-20">
      {/* Enhanced Header with stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <motion.h1 
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-teal-500 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Activity Tracker
          </motion.h1>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="text-blue-500" size={32} />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge variant="secondary" className="flex items-center space-x-1 justify-center bg-gradient-to-r from-orange-100 to-red-100 border-orange-300">
              <Flame className="text-orange-500" size={16} />
              <span>{stats.activityStreak || 0} day streak</span>
            </Badge>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Badge variant="secondary" className="flex items-center space-x-1 justify-center bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300">
              <Timer className="text-blue-500" size={16} />
              <span>{totalActiveMinutes} min total</span>
            </Badge>
          </motion.div>
          
          <Badge variant="secondary" className="flex items-center space-x-1 justify-center bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300">
            <Zap className="text-yellow-500" size={16} />
            <span>{stats.caloriesBurned || 0} cal burned</span>
          </Badge>
          
          <Badge variant="secondary" className="flex items-center space-x-1 justify-center bg-gradient-to-r from-green-100 to-emerald-100 border-green-300">
            <Award className="text-green-500" size={16} />
            <span>{stats.activitiesLogged || 0} workouts</span>
          </Badge>
        </div>
      </motion.div>

      {/* Enhanced Daily Goal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-100 via-green-100 to-teal-100 dark:from-blue-900/30 dark:to-green-900/30 border-blue-200 dark:border-blue-800 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Target className="text-blue-600 dark:text-blue-400" size={20} />
              <span>Daily Burn Goal</span>
              {progressPercentage >= 100 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Badge className="bg-green-500 text-white">Complete!</Badge>
                </motion.div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <motion.div 
                className="text-4xl font-bold text-blue-600 dark:text-blue-400"
                animate={{ scale: progressPercentage >= 100 ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                {dailyCaloriesBurned}
              </motion.div>
              <div className="text-sm text-muted-foreground">
                of {targetCaloriesBurned} calories burned
              </div>
            </div>
            <Progress value={progressPercentage} className="h-4" />
            <div className="text-center text-sm">
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {progressPercentage >= 100 ? '🎉 Goal achieved!' : `${Math.max(0, targetCaloriesBurned - dailyCaloriesBurned)} calories to go`}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Activity Goal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 border-green-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="text-green-600" size={20} />
              <span>Weekly Activity Goal</span>
              {weeklyProgress >= 100 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Badge className="bg-green-500 text-white">Complete!</Badge>
                </motion.div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {totalActiveMinutes}
              </div>
              <div className="text-sm text-muted-foreground">
                of {weeklyGoal} minutes this week
              </div>
            </div>
            <Progress value={weeklyProgress} className="h-3" />
            <div className="text-center text-sm">
              <span className="font-medium text-green-600">
                {weeklyProgress >= 100 ? '🏆 Weekly goal achieved!' : `${Math.max(0, weeklyGoal - totalActiveMinutes)} minutes to go`}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Today's Activities */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🏃‍♀️</span>
                <span>Today's Activities</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-blue-50">
                  {todaysActivities.length} activities
                </Badge>
                <Badge variant="outline" className="bg-green-50">
                  {todaysActivities.reduce((sum, activity) => sum + activity.duration, 0)} min
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AnimatePresence>
              {todaysActivities.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <div className="text-4xl mb-2">💪</div>
                  <p className="text-muted-foreground">No activities logged today</p>
                  <p className="text-sm text-muted-foreground">Add your first workout to start earning XP!</p>
                </motion.div>
              ) : (
                todaysActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center p-4 border rounded-xl group hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <motion.span 
                        className="text-3xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      >
                        {getActivityTypeIcon(activity.type)}
                      </motion.span>
                      <div>
                        <h3 className="font-medium">{activity.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Timer size={12} />
                            <span>{activity.duration} min</span>
                          </span>
                          <span>•</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getIntensityBadgeColor(activity.intensity)}`}
                          >
                            {activity.intensity} intensity
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-medium text-orange-600 flex items-center space-x-1">
                          <Flame size={14} />
                          <span>{activity.caloriesBurned} cal</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeActivityEntry(activity.id)
                          showInAppNotification('Activity removed', 'info')
                        }}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Add Activity Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-24 right-4"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={() => setIsAddingActivity(true)}
            size="lg"
            className="rounded-full shadow-xl bg-gradient-to-r from-blue-600 via-green-600 to-teal-500 hover:from-blue-700 hover:via-green-700 hover:to-teal-600 text-white border-0"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced Add Activity Modal */}
      <AnimatePresence>
        {isAddingActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Log Activity</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="activity-suggestions">Quick Add</Label>
                  <Button
                    variant="outline"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="w-full mt-2 justify-between"
                  >
                    Choose from common activities
                    <TrendingUp size={16} />
                  </Button>
                  
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 border rounded-lg max-h-40 overflow-y-auto"
                    >
                      {COMMON_ACTIVITIES.map((activity, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleActivitySuggestion(activity)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0 text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span>{getActivityTypeIcon(activity.type)}</span>
                              <span className="font-medium">{activity.name}</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              ~{activity.caloriesPerMin} cal/min
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>

                <div>
                  <Label htmlFor="activity-type">Activity Type</Label>
                  <Select value={activityType} onValueChange={(value: typeof activityType) => setActivityType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardio">🏃 Cardio</SelectItem>
                      <SelectItem value="strength">💪 Strength Training</SelectItem>
                      <SelectItem value="sports">⚽ Sports</SelectItem>
                      <SelectItem value="walking">🚶 Walking</SelectItem>
                      <SelectItem value="other">🏋️ Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="activity-name">Activity Name</Label>
                  <Input
                    id="activity-name"
                    placeholder="e.g., Morning Run, Push-ups"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g., 30"
                    value={duration}
                    onChange={(e) => handleDurationChange(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="intensity">Intensity</Label>
                  <Select value={intensity} onValueChange={(value: typeof intensity) => setIntensity(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Low - Light effort</SelectItem>
                      <SelectItem value="medium">🟡 Medium - Moderate effort</SelectItem>
                      <SelectItem value="high">🔴 High - Intense effort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="calories-burned">Calories Burned</Label>
                  <Input
                    id="calories-burned"
                    type="number"
                    placeholder="e.g., 250"
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(e.target.value)}
                  />
                  {duration && activityName && COMMON_ACTIVITIES.find(a => a.name === activityName) && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Estimated: ~{Math.round(parseInt(duration) * (COMMON_ACTIVITIES.find(a => a.name === activityName)?.caloriesPerMin || 0))} calories
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingActivity(false)
                      setShowSuggestions(false)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddActivity}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  >
                    Log Activity
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}