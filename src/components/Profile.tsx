import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useGame } from '../contexts/GameContext'
import { useNotifications } from '../contexts/NotificationContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { User, Edit, Check, X, TrendingDown, Calendar, Target } from 'lucide-react'

export const Profile: React.FC = () => {
  const { stats, updateWeight, setTargetWeight, getWeeklyProgress } = useGame()
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

  const weeklyData = getWeeklyProgress()
  const chartData = weeklyData.map((calories, index) => ({
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index],
    calories
  }))

  const weightLoss = stats.startWeight && stats.currentWeight 
    ? stats.startWeight - stats.currentWeight 
    : 0

  const progressToGoal = stats.currentWeight && stats.targetWeight 
    ? ((stats.startWeight || stats.currentWeight) - stats.currentWeight) / ((stats.startWeight || stats.currentWeight) - stats.targetWeight) * 100
    : 0

  return (
    <div className="space-y-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your progress and achievements
        </p>
      </motion.div>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <User className="text-blue-600" size={20} />
              <span>Hello, {userInfo.name || 'Adventurer'}!</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.level}</div>
                <div className="text-sm text-muted-foreground">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600">{stats.coins}</div>
                <div className="text-sm text-muted-foreground">Coins</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weight Tracking */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
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
              >
                <Edit size={16} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
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
                  <Button size="sm" onClick={handleSaveWeight}>
                    <Check size={16} />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    <X size={16} />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.currentWeight || '---'}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Weight</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.targetWeight || '---'}
                  </div>
                  <div className="text-sm text-muted-foreground">Target Weight</div>
                </div>
              </div>
            )}
            
            {weightLoss > 0 && (
              <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg">
                <TrendingDown className="text-green-600" size={20} />
                <span className="font-semibold text-green-600">
                  {weightLoss.toFixed(1)} lbs lost!
                </span>
              </div>
            )}
            
            {progressToGoal > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Goal</span>
                  <span>{Math.min(100, progressToGoal).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, progressToGoal)}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Progress Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="text-purple-600" size={20} />
              <span>Weekly Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.mealsLogged}</div>
                <div className="text-sm text-muted-foreground">Meals Logged</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600">{stats.caloriesLogged.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Calories</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.daysActive}</div>
                <div className="text-sm text-muted-foreground">Days Active</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.achievements.filter(a => a.earned).length}</div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-600">
                  {weightLoss > 0 ? `${weightLoss.toFixed(1)}` : '0.0'}
                </div>
                <div className="text-sm text-muted-foreground">Weight Lost (lbs)</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {progressToGoal > 0 ? `${Math.min(100, progressToGoal).toFixed(1)}%` : '0%'}
                </div>
                <div className="text-sm text-muted-foreground">Goal Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}