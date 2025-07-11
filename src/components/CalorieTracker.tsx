import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { useGame } from '../contexts/GameContext'
import { useNotifications } from '../contexts/NotificationContext'
import { Plus, Flame, Trophy, Zap, Target, Trash2, Activity } from 'lucide-react'

export const CalorieTracker: React.FC = () => {
  const [isAddingFood, setIsAddingFood] = useState(false)
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  
  const { stats, addFoodEntry, removeFoodEntry, getDailyCalories, getTodaysEntries, getDailyCaloriesBurned } = useGame()
  const { showInAppNotification } = useNotifications()

  const handleAddFood = () => {
    if (!foodName || !calories) {
      showInAppNotification('Please enter both food name and calories', 'error')
      return
    }

    addFoodEntry({
      name: foodName,
      calories: parseInt(calories),
      meal: selectedMeal
    })

    setFoodName('')
    setCalories('')
    setIsAddingFood(false)
    showInAppNotification('Food logged successfully! 🍽️', 'success')
  }

  const dailyCalories = getDailyCalories()
  const todaysEntries = getTodaysEntries()
  const targetCalories = 2000 // This could be calculated based on user info
  const caloriesRemaining = Math.max(0, targetCalories - dailyCalories)
  const progressPercentage = Math.min(100, (dailyCalories / targetCalories) * 100)

  const mealGroups = {
    breakfast: todaysEntries.filter(entry => entry.meal === 'breakfast'),
    lunch: todaysEntries.filter(entry => entry.meal === 'lunch'),
    dinner: todaysEntries.filter(entry => entry.meal === 'dinner'),
    snack: todaysEntries.filter(entry => entry.meal === 'snack')
  }

  const getMealCalories = (meal: keyof typeof mealGroups) => {
    return mealGroups[meal].reduce((sum, entry) => sum + entry.calories, 0)
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Calorie Quest
          </h1>
          <Trophy className="text-yellow-500" size={32} />
        </div>
        
        <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
          <Badge variant="secondary" className="flex items-center space-x-1 justify-center">
            <Zap className="text-yellow-500" size={16} />
            <span>Level {stats.level}</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1 justify-center">
            <Flame className="text-orange-500" size={16} />
            <span>{stats.streak} day streak</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1 justify-center">
            <span>💰</span>
            <span>{stats.coins} coins</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center space-x-1 justify-center">
            <Activity className="text-blue-500" size={16} />
            <span>{getDailyCaloriesBurned()} cal burned</span>
          </Badge>
        </div>
      </motion.div>

      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">XP Progress</span>
              <span className="text-sm text-muted-foreground">
                {stats.xp}/{stats.level * 100} XP
              </span>
            </div>
            <Progress 
              value={(stats.xp / (stats.level * 100)) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Daily Calorie Goal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Target className="text-green-600" size={20} />
              <span>Daily Goal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {dailyCalories}
              </div>
              <div className="text-sm text-muted-foreground">
                of {targetCalories} calories
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="text-center text-sm">
              <span className="font-medium text-green-600">
                {caloriesRemaining} calories remaining
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Meal Sections */}
      <div className="space-y-4">
        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((meal, index) => (
          <motion.div
            key={meal}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {meal === 'breakfast' && '🌅'}
                      {meal === 'lunch' && '☀️'}
                      {meal === 'dinner' && '🌙'}
                      {meal === 'snack' && '🍎'}
                    </span>
                    <span className="capitalize">{meal}</span>
                  </div>
                  <Badge variant="outline">
                    {getMealCalories(meal)} cal
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mealGroups[meal].length === 0 ? (
                  <p className="text-muted-foreground text-sm">No items logged</p>
                ) : (
                  mealGroups[meal].map((entry) => (
                    <div key={entry.id} className="flex justify-between items-center py-2 border-b last:border-b-0 group">
                      <span className="font-medium">{entry.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{entry.calories} cal</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            removeFoodEntry(entry.id)
                            showInAppNotification('Food entry removed', 'info')
                          }}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add Food Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        className="fixed bottom-24 right-4"
      >
        <Button
          onClick={() => setIsAddingFood(true)}
          size="lg"
          className="rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Add Food Modal */}
      {isAddingFood && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Add Food</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="meal-select">Meal</Label>
                <div className="flex space-x-2 mt-2">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((meal) => (
                    <Button
                      key={meal}
                      variant={selectedMeal === meal ? 'default' : 'outline'}
                      onClick={() => setSelectedMeal(meal)}
                      className="flex-1 text-xs"
                    >
                      {meal === 'breakfast' && '🌅'}
                      {meal === 'lunch' && '☀️'}
                      {meal === 'dinner' && '🌙'}
                      {meal === 'snack' && '🍎'}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="food-name">Food Name</Label>
                <Input
                  id="food-name"
                  placeholder="e.g., Grilled Chicken Salad"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 350"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingFood(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddFood}
                  className="flex-1"
                >
                  Add Food
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}