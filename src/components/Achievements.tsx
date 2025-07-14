import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Button } from './ui/button'
import { useGame } from '../contexts/GameContext'
import { 
  Trophy, Star, Filter, Sparkles, Target, Flame, Activity, 
  Award, Zap, Calendar, TrendingUp,
  CheckCircle2, Gift, Coins
} from 'lucide-react'

export const Achievements: React.FC = () => {
  const { stats } = useGame()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showOnlyEarned, setShowOnlyEarned] = useState(false)
  const [animatedStats, setAnimatedStats] = useState({
    earned: 0,
    coins: 0,
    completion: 0
  })

  const earnedAchievements = stats.achievements.filter(a => a.earned)
  const recentAchievements = earnedAchievements
    .filter(a => a.earnedAt)
    .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime())
    .slice(0, 3)

  // Animate stats on mount
  useEffect(() => {
    const targetStats = {
      earned: earnedAchievements.length,
      coins: stats.coins,
      completion: Math.round((earnedAchievements.length / stats.achievements.length) * 100)
    }

    const duration = 1500
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedStats({
        earned: Math.round(targetStats.earned * progress),
        coins: Math.round(targetStats.coins * progress),
        completion: Math.round(targetStats.completion * progress)
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedStats(targetStats)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [earnedAchievements.length, stats.coins, stats.achievements.length])

  const categories = [
    { id: 'all', name: 'All', icon: Trophy, color: 'text-yellow-500' },
    { id: 'streak', name: 'Streaks', icon: Flame, color: 'text-orange-500' },
    { id: 'weight', name: 'Weight', icon: Target, color: 'text-green-500' },
    { id: 'calories', name: 'Calories', icon: Sparkles, color: 'text-purple-500' },
    { id: 'meals', name: 'Meals', icon: () => <span className="text-sm">🍽️</span>, color: 'text-blue-500' },
    { id: 'activity', name: 'Activity', icon: Activity, color: 'text-blue-600' },
    { id: 'special', name: 'Special', icon: Star, color: 'text-pink-500' }
  ]
  
  const filteredAchievements = stats.achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory
    const earnedMatch = !showOnlyEarned || achievement.earned
    return categoryMatch && earnedMatch
  })

  const getCategoryProgress = (categoryId: string) => {
    const categoryAchievements = stats.achievements.filter(a => a.category === categoryId)
    const earnedCount = categoryAchievements.filter(a => a.earned).length
    return { earned: earnedCount, total: categoryAchievements.length }
  }

  const getAchievementRarity = (achievement: { progress: number; requirement: number; earned: boolean }) => {
    const progressPercent = (achievement.progress / achievement.requirement) * 100
    if (achievement.earned) return { label: 'Unlocked', color: 'bg-green-500', textColor: 'text-green-700' }
    if (progressPercent >= 75) return { label: 'Almost There', color: 'bg-orange-500', textColor: 'text-orange-700' }
    if (progressPercent >= 50) return { label: 'In Progress', color: 'bg-blue-500', textColor: 'text-blue-700' }
    if (progressPercent >= 25) return { label: 'Started', color: 'bg-purple-500', textColor: 'text-purple-700' }
    return { label: 'Locked', color: 'bg-gray-400', textColor: 'text-gray-600' }
  }

  const CircularProgress = ({ value, size = 120, strokeWidth = 8, children }: {
    value: number
    size?: number
    strokeWidth?: number
    children: React.ReactNode
  }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = circumference
    const strokeDashoffset = circumference - (value / 100) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-gradient-to-r from-purple-500 to-pink-500"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20 px-4 max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            🏆 Achievement Hall
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Your journey to greatness, one achievement at a time
          </p>
        </motion.div>

        {/* Animated Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-yellow-200 rounded-full mb-4"
                >
                  <Trophy className="text-yellow-600" size={32} />
                </motion.div>
                <motion.div
                  className="text-3xl font-bold text-yellow-700"
                  key={animatedStats.earned}
                >
                  {animatedStats.earned}
                </motion.div>
                <div className="text-sm text-muted-foreground">Achievements Unlocked</div>
                <div className="text-xs text-yellow-600 mt-1">
                  {stats.achievements.length - earnedAchievements.length} remaining
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <CircularProgress value={animatedStats.completion} size={80}>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-700">{animatedStats.completion}%</div>
                    <div className="text-xs text-purple-600">Complete</div>
                  </div>
                </CircularProgress>
                <div className="text-sm text-muted-foreground mt-2">Overall Progress</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-orange-200 rounded-full mb-4"
                >
                  <Coins className="text-orange-600" size={32} />
                </motion.div>
                <motion.div
                  className="text-3xl font-bold text-orange-700"
                  key={animatedStats.coins}
                >
                  {animatedStats.coins}
                </motion.div>
                <div className="text-sm text-muted-foreground">Total Coins Earned</div>
                <div className="text-xs text-orange-600 mt-1">
                  +25 per achievement
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Recent Achievements Showcase */}
      {recentAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="text-green-600" size={24} />
                <span>Recent Achievements</span>
                <Badge variant="secondary" className="bg-green-200 text-green-700">
                  Latest Unlocks
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-green-200 shadow-sm"
                  >
                    <motion.div
                      className="text-3xl"
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {achievement.icon}
                    </motion.div>
                    <div className="flex-1">
                      <div className="font-semibold text-green-800">{achievement.title}</div>
                      <div className="text-xs text-green-600">
                        {achievement.earnedAt && new Date(achievement.earnedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <CheckCircle2 className="text-green-500" size={20} />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Category Progress Rings */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="text-blue-600" size={24} />
              <span>Category Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.slice(1).map((category, index) => {
                const progress = getCategoryProgress(category.id)
                const percentage = progress.total > 0 ? (progress.earned / progress.total) * 100 : 0
                const IconComponent = category.icon

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-center"
                  >
                    <CircularProgress value={percentage} size={80}>
                      <div className="text-center">
                        <IconComponent className={`${category.color} mx-auto mb-1`} size={20} />
                        <div className="text-xs font-bold">{Math.round(percentage)}%</div>
                      </div>
                    </CircularProgress>
                    <div className="text-sm font-medium mt-2">{category.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {progress.earned}/{progress.total}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Filters */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="text-blue-600" size={20} />
              <span>Filters & Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => {
                const progress = category.id === 'all' 
                  ? { earned: earnedAchievements.length, total: stats.achievements.length }
                  : getCategoryProgress(category.id)
                const IconComponent = category.icon
                
                return (
                  <motion.div key={category.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 ${
                        selectedCategory === category.id 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className={selectedCategory === category.id ? 'text-white' : category.color} size={16} />
                      <span>{category.name}</span>
                      <Badge 
                        variant="secondary" 
                        className={`ml-1 text-xs ${
                          selectedCategory === category.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-100'
                        }`}
                      >
                        {progress.earned}/{progress.total}
                      </Badge>
                    </Button>
                  </motion.div>
                )
              })}
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={showOnlyEarned ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowOnlyEarned(!showOnlyEarned)}
                  className={`flex items-center space-x-2 ${
                    showOnlyEarned 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Trophy className={showOnlyEarned ? 'text-white' : 'text-yellow-500'} size={16} />
                  <span>Earned Only</span>
                </Button>
              </motion.div>
              
              <Badge variant="outline" className="text-sm">
                {filteredAchievements.length} achievements shown
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Achievement Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="text-purple-600" size={24} />
                <span>All Achievements</span>
              </div>
              <Badge variant="outline" className="text-sm">
                {filteredAchievements.filter(a => a.earned).length} / {filteredAchievements.length} unlocked
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAchievements.map((achievement, index) => {
                  const rarity = getAchievementRarity(achievement)
                  const progressPercent = Math.min(100, (achievement.progress / achievement.requirement) * 100)
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                        achievement.earned 
                          ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-yellow-200 shadow-md hover:shadow-lg' 
                          : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-md'
                      }`}
                    >
                      {/* Rarity Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <Badge 
                          className={`${rarity.color} text-white text-xs font-medium`}
                        >
                          {rarity.label}
                        </Badge>
                      </div>

                      {/* Achievement Content */}
                      <div className="p-6">
                        <div className="flex items-start space-x-4">
                          <motion.div 
                            className={`text-5xl ${achievement.earned ? '' : 'grayscale opacity-50'} relative`}
                            animate={achievement.earned ? { 
                              rotate: [0, 5, -5, 0],
                              scale: [1, 1.05, 1]
                            } : {}}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            {achievement.icon}
                            {achievement.earned && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                              >
                                <CheckCircle2 className="text-white" size={14} />
                              </motion.div>
                            )}
                          </motion.div>
                          
                          <div className="flex-1 space-y-3">
                            <div>
                              <div className={`font-bold text-lg ${achievement.earned ? 'text-gray-900' : 'text-gray-600'} flex items-center space-x-2`}>
                                <span>{achievement.title}</span>
                                {achievement.earned && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-yellow-500"
                                  >
                                    ✨
                                  </motion.span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {achievement.description}
                              </div>
                            </div>
                            
                            {/* Progress Section */}
                            <div className="space-y-2">
                              {achievement.earned ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="flex items-center space-x-2"
                                >
                                  <Badge className="bg-green-500 text-white text-sm">
                                    <CheckCircle2 size={14} className="mr-1" />
                                    Completed
                                  </Badge>
                                  {achievement.earnedAt && (
                                    <div className="flex items-center space-x-1 text-xs text-green-600">
                                      <Calendar size={12} />
                                      <span>{new Date(achievement.earnedAt).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-1 text-xs text-yellow-600">
                                    <Gift size={12} />
                                    <span>+25 coins</span>
                                  </div>
                                </motion.div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      {achievement.progress} / {achievement.requirement}
                                    </span>
                                    <span className="font-medium text-gray-700">
                                      {Math.round(progressPercent)}%
                                    </span>
                                  </div>
                                  <div className="relative">
                                    <Progress 
                                      value={progressPercent} 
                                      className="h-3 bg-gray-200"
                                    />
                                    {progressPercent > 0 && (
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercent}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="absolute top-0 left-0 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                      />
                                    )}
                                  </div>
                                  {progressPercent >= 75 && (
                                    <div className="flex items-center space-x-1 text-xs text-orange-600">
                                      <Zap size={12} />
                                      <span>Almost there!</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Category Badge */}
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs">
                                {(() => {
                                  const categoryData = categories.find(c => c.id === achievement.category)
                                  if (categoryData?.icon) {
                                    const IconComponent = categoryData.icon
                                    return <IconComponent className={categoryData.color} size={12} />
                                  }
                                  return null
                                })()}
                                <span className="ml-1 capitalize">{achievement.category}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                      />
                    </motion.div>
                  )
                })}
              </div>
            </AnimatePresence>
            
            {filteredAchievements.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🏆
                </motion.div>
                <p className="text-lg text-muted-foreground mb-4">No achievements match your filters</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('all')
                    setShowOnlyEarned(false)
                  }}
                  className="flex items-center space-x-2"
                >
                  <Filter size={16} />
                  <span>Clear All Filters</span>
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}