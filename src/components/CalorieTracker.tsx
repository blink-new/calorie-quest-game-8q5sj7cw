import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { useGame } from '../contexts/GameContext'
import { useNotifications } from '../contexts/NotificationContext'
import { Plus, Flame, Trophy, Zap, Target, Trash2, Activity, Search, Sparkles, TrendingUp } from 'lucide-react'

// Enhanced food database with more variety and better categorization
const COMMON_FOODS = [
  // Breakfast
  { name: 'Oatmeal with Berries', calories: 180, protein: 6, carbs: 32, fat: 3, category: 'breakfast', icon: '🥣' },
  { name: 'Greek Yogurt Parfait', calories: 150, protein: 15, carbs: 20, fat: 2, category: 'breakfast', icon: '🥛' },
  { name: 'Avocado Toast', calories: 250, protein: 8, carbs: 30, fat: 12, category: 'breakfast', icon: '🥑' },
  { name: 'Scrambled Eggs (2)', calories: 140, protein: 12, carbs: 1, fat: 10, category: 'breakfast', icon: '🍳' },
  
  // Lunch
  { name: 'Grilled Chicken Salad', calories: 320, protein: 35, carbs: 15, fat: 12, category: 'lunch', icon: '🥗' },
  { name: 'Turkey Sandwich', calories: 380, protein: 25, carbs: 45, fat: 8, category: 'lunch', icon: '🥪' },
  { name: 'Quinoa Bowl', calories: 420, protein: 18, carbs: 65, fat: 8, category: 'lunch', icon: '🍲' },
  { name: 'Sushi Roll (8 pieces)', calories: 300, protein: 12, carbs: 45, fat: 8, category: 'lunch', icon: '🍣' },
  
  // Dinner
  { name: 'Grilled Salmon', calories: 280, protein: 40, carbs: 0, fat: 12, category: 'dinner', icon: '🐟' },
  { name: 'Chicken Stir Fry', calories: 350, protein: 30, carbs: 25, fat: 15, category: 'dinner', icon: '🍜' },
  { name: 'Lean Beef with Vegetables', calories: 400, protein: 35, carbs: 20, fat: 18, category: 'dinner', icon: '🥩' },
  { name: 'Vegetarian Pasta', calories: 380, protein: 15, carbs: 65, fat: 8, category: 'dinner', icon: '🍝' },
  
  // Snacks
  { name: 'Apple with Peanut Butter', calories: 190, protein: 8, carbs: 25, fat: 8, category: 'snack', icon: '🍎' },
  { name: 'Mixed Nuts (1 oz)', calories: 170, protein: 6, carbs: 6, fat: 15, category: 'snack', icon: '🥜' },
  { name: 'Protein Smoothie', calories: 220, protein: 25, carbs: 15, fat: 5, category: 'snack', icon: '🥤' },
  { name: 'Hummus with Veggies', calories: 120, protein: 5, carbs: 15, fat: 6, category: 'snack', icon: '🥕' }
]

export const CalorieTracker: React.FC = () => {
  const [isAddingFood, setIsAddingFood] = useState(false)
  const [foodName, setFoodName] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { stats, addFoodEntry, removeFoodEntry, getDailyCalories, getDailyMacros, getTodaysEntries, getDailyCaloriesBurned } = useGame()
  const { showInAppNotification } = useNotifications()

  // Auto-set meal based on current time
  useEffect(() => {
    const currentHour = new Date().getHours()
    if (currentHour < 11) setSelectedMeal('breakfast')
    else if (currentHour < 16) setSelectedMeal('lunch')
    else if (currentHour < 21) setSelectedMeal('dinner')
    else setSelectedMeal('snack')
  }, [])

  const handleAddFood = () => {
    if (!foodName || !calories) {
      showInAppNotification('Please enter both food name and calories', 'error')
      return
    }

    addFoodEntry({
      name: foodName,
      calories: parseInt(calories),
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      meal: selectedMeal
    })

    setFoodName('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFat('')
    setSearchQuery('')
    setIsAddingFood(false)

    showInAppNotification(`🍽️ ${foodName} logged successfully! +${Math.max(1, Math.floor(parseInt(calories) / 50))} XP`, 'success')
  }

  const handleFoodSuggestion = (food: typeof COMMON_FOODS[0]) => {
    setFoodName(food.name)
    setCalories(food.calories.toString())
    setProtein(food.protein.toString())
    setCarbs(food.carbs.toString())
    setFat(food.fat.toString())
    setShowSuggestions(false)
    setSearchQuery('')
  }

  const filteredSuggestions = COMMON_FOODS.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category === selectedMeal
  ).slice(0, 8)

  const dailyCalories = getDailyCalories()
  const dailyMacros = getDailyMacros()
  const todaysEntries = getTodaysEntries()
  const targetCalories = 2000
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

  const getMealMacros = (meal: keyof typeof mealGroups) => {
    return mealGroups[meal].reduce((sum, entry) => ({
      protein: sum.protein + entry.protein,
      carbs: sum.carbs + entry.carbs,
      fat: sum.fat + entry.fat
    }), { protein: 0, carbs: 0, fat: 0 })
  }

  const levelProgress = (stats.xp / (stats.level * 100)) * 100
  const isCloseToLevelUp = levelProgress > 80

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
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            FitQuest
          </motion.h1>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Trophy className="text-yellow-500" size={32} />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge variant="secondary" className={`flex items-center space-x-1 justify-center transition-all duration-300 ${isCloseToLevelUp ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300' : ''}`}>
              <Zap className={`${isCloseToLevelUp ? 'text-yellow-600' : 'text-yellow-500'}`} size={16} />
              <span>Level {stats.level}</span>
              {isCloseToLevelUp && <Sparkles className="text-yellow-600" size={12} />}
            </Badge>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge variant="secondary" className={`flex items-center space-x-1 justify-center transition-all duration-300 ${stats.streak > 0 ? 'bg-gradient-to-r from-orange-100 to-red-100 border-orange-300' : ''}`}>
              <Flame className="text-orange-500" size={16} />
              <span>{stats.streak} day streak</span>
            </Badge>
          </motion.div>
          
          <Badge variant="secondary" className="flex items-center space-x-1 justify-center bg-gradient-to-r from-green-100 to-emerald-100 border-green-300">
            <span>💰</span>
            <span>{stats.coins} coins</span>
          </Badge>
          
          <Badge variant="secondary" className="flex items-center space-x-1 justify-center bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300">
            <Activity className="text-blue-500" size={16} />
            <span>{getDailyCaloriesBurned()} cal burned</span>
          </Badge>
        </div>
      </motion.div>

      {/* Enhanced XP Progress with better animations */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={`transition-all duration-500 ${isCloseToLevelUp ? 'bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 border-yellow-300 shadow-lg' : 'bg-gradient-to-r from-purple-100 to-pink-100'} dark:from-purple-900/30 dark:to-pink-900/30 border-purple-200 dark:border-purple-800`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center space-x-1">
                <span>XP Progress</span>
                {isCloseToLevelUp && <TrendingUp className="text-yellow-600" size={16} />}
              </span>
              <span className="text-sm text-muted-foreground">
                {stats.xp}/{stats.level * 100} XP
              </span>
            </div>
            <Progress 
              value={levelProgress} 
              className={`h-3 transition-all duration-500 ${isCloseToLevelUp ? 'bg-yellow-200' : ''}`}
            />
            {isCloseToLevelUp && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-yellow-700 mt-2 font-medium"
              >
                🔥 Almost there! Keep logging to level up!
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Daily Calorie Goal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-green-100 via-emerald-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 border-green-200 dark:border-green-800 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Target className="text-green-600 dark:text-green-400" size={20} />
              <span>Daily Goal</span>
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
                className="text-4xl font-bold text-green-600 dark:text-green-400"
                animate={{ scale: progressPercentage >= 100 ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                {dailyCalories}
              </motion.div>
              <div className="text-sm text-muted-foreground">
                of {targetCalories} calories
              </div>
            </div>
            <Progress value={progressPercentage} className="h-4" />
            <div className="text-center text-sm">
              <span className="font-medium text-green-600 dark:text-green-400">
                {progressPercentage >= 100 ? '🎉 Goal achieved!' : `${caloriesRemaining} calories remaining`}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Daily Macro Intake */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25 }}
      >
        <Card className="bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 dark:from-orange-900/30 dark:to-red-900/30 border-orange-200 dark:border-orange-800 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <span>📊</span>
              <span>Daily Macro Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-center">
              <motion.div 
                className="space-y-1"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {Math.round(dailyMacros.protein)}g
                </div>
                <div className="text-xs text-muted-foreground">
                  Protein
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (dailyMacros.protein / 150) * 100)}%` }}
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-1"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(dailyMacros.carbs)}g
                </div>
                <div className="text-xs text-muted-foreground">
                  Carbs
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (dailyMacros.carbs / 250) * 100)}%` }}
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="space-y-1"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {Math.round(dailyMacros.fat)}g
                </div>
                <div className="text-xs text-muted-foreground">
                  Fat
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (dailyMacros.fat / 65) * 100)}%` }}
                  />
                </div>
              </motion.div>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              Total: {Math.round(dailyMacros.protein + dailyMacros.carbs + dailyMacros.fat)}g macros
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Meal Sections */}
      <div className="space-y-4">
        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((meal, index) => (
          <motion.div
            key={meal}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <motion.span 
                      className="text-lg"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    >
                      {meal === 'breakfast' && '🌅'}
                      {meal === 'lunch' && '☀️'}
                      {meal === 'dinner' && '🌙'}
                      {meal === 'snack' && '🍎'}
                    </motion.span>
                    <span className="capitalize">{meal}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50">
                      {getMealCalories(meal)} cal
                    </Badge>
                    <Badge variant="outline" className="bg-red-50">
                      {Math.round(getMealMacros(meal).protein)}g P
                    </Badge>
                    <Badge variant="outline" className="bg-green-50">
                      {Math.round(getMealMacros(meal).carbs)}g C
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50">
                      {Math.round(getMealMacros(meal).fat)}g F
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <AnimatePresence>
                  {mealGroups[meal].length === 0 ? (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-muted-foreground text-sm text-center py-4"
                    >
                      No items logged for {meal}
                    </motion.p>
                  ) : (
                    mealGroups[meal].map((entry, entryIndex) => (
                      <motion.div 
                        key={entry.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: entryIndex * 0.1 }}
                        className="flex justify-between items-center py-3 px-2 border-b last:border-b-0 group hover:bg-gray-50 rounded-lg transition-all duration-200"
                      >
                        <span className="font-medium">{entry.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{entry.calories} cal</span>
                          <span className="text-sm text-muted-foreground">{Math.round(entry.protein)}g protein</span>
                          <span className="text-sm text-muted-foreground">{Math.round(entry.carbs)}g carbs</span>
                          <span className="text-sm text-muted-foreground">{Math.round(entry.fat)}g fat</span>
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
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Add Food Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-24 right-4"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={() => setIsAddingFood(true)}
            size="lg"
            className="rounded-full shadow-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced Add Food Modal */}
      <AnimatePresence>
        {isAddingFood && (
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
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Add Food</h2>
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
                  <Label htmlFor="food-search">Search Food</Label>
                  <div className="relative">
                    <Input
                      id="food-search"
                      placeholder="Search for common foods..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowSuggestions(e.target.value.length > 0)
                      }}
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  </div>
                  
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto"
                    >
                      {filteredSuggestions.map((food, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleFoodSuggestion(food)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0 text-sm flex items-center space-x-2"
                        >
                          <span className="text-lg">{food.icon}</span>
                          <div>
                            <div className="font-medium">{food.name}</div>
                            <div className="text-gray-500 text-xs">{food.calories} cal • {food.protein}g protein</div>
                          </div>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
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
                
                <div>
                  <Label className="text-sm font-medium">Macronutrients (grams)</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <Label htmlFor="protein" className="text-xs text-muted-foreground">Protein</Label>
                      <Input
                        id="protein"
                        type="number"
                        placeholder="30"
                        value={protein}
                        onChange={(e) => setProtein(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="carbs" className="text-xs text-muted-foreground">Carbs</Label>
                      <Input
                        id="carbs"
                        type="number"
                        placeholder="40"
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fat" className="text-xs text-muted-foreground">Fat</Label>
                      <Input
                        id="fat"
                        type="number"
                        placeholder="10"
                        value={fat}
                        onChange={(e) => setFat(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Optional: Leave blank if unknown
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingFood(false)
                      setSearchQuery('')
                      setShowSuggestions(false)
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddFood}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Add Food
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