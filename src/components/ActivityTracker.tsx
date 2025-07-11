import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useGame } from '../contexts/GameContext'
import { useNotifications } from '../contexts/NotificationContext'
import { Plus, Flame, Timer, Target, Trash2, Activity, Zap } from 'lucide-react'

export const ActivityTracker: React.FC = () => {
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [activityName, setActivityName] = useState('')
  const [duration, setDuration] = useState('')
  const [caloriesBurned, setCaloriesBurned] = useState('')
  const [activityType, setActivityType] = useState<'cardio' | 'strength' | 'sports' | 'walking' | 'other'>('cardio')
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium')
  
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

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header with stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Activity Tracker
          </h1>
          <Activity className="text-blue-500" size={32} />
        </div>
        
        <div className="flex justify-center space-x-4">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Flame className="text-orange-500" size={16} />
            <span>{stats.activityStreak} day streak</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Timer className="text-blue-500" size={16} />
            <span>{stats.activeMinutes} min total</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Zap className="text-yellow-500" size={16} />
            <span>{stats.caloriesBurned} cal burned</span>
          </Badge>
        </div>
      </motion.div>

      {/* Daily Goal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Target className="text-blue-600 dark:text-blue-400" size={20} />
              <span>Daily Burn Goal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {dailyCaloriesBurned}
              </div>
              <div className="text-sm text-muted-foreground">
                of {targetCaloriesBurned} calories burned
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-center text-sm">
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {Math.max(0, targetCaloriesBurned - dailyCaloriesBurned)} calories to go
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Activities */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🏃‍♀️</span>
                <span>Today's Activities</span>
              </div>
              <Badge variant="outline">
                {todaysActivities.length} activities
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysActivities.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💪</div>
                <p className="text-muted-foreground">No activities logged today</p>
                <p className="text-sm text-muted-foreground">Add your first workout to start earning XP!</p>
              </div>
            ) : (
              todaysActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center p-3 border rounded-lg group hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {getActivityTypeIcon(activity.type)}
                    </span>
                    <div>
                      <h3 className="font-medium">{activity.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{activity.duration} min</span>
                        <span>•</span>
                        <span className={getIntensityColor(activity.intensity)}>
                          {activity.intensity} intensity
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="font-medium text-orange-600">
                        {activity.caloriesBurned} cal
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Activity Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="fixed bottom-24 right-4"
      >
        <Button
          onClick={() => setIsAddingActivity(true)}
          size="lg"
          className="rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Add Activity Modal */}
      {isAddingActivity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">Log Activity</h2>
            <div className="space-y-4">
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
                  onChange={(e) => setDuration(e.target.value)}
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
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingActivity(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddActivity}
                  className="flex-1"
                >
                  Log Activity
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}