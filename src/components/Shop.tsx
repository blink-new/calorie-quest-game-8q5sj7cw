import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useGame } from '../contexts/GameContext'
import { useNotifications } from '../contexts/NotificationContext'
import { ShoppingBag, Coins, Check, Lock, Sparkles, Palette, Star, Trophy } from 'lucide-react'

interface Theme {
  id: string
  name: string
  description: string
  price: number
  preview: {
    gradient: string
    cardBg: string
    accent: string
  }
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  levelRequired: number
  achievementsRequired: string[]
}

const themes: Theme[] = [
  {
    id: 'default',
    name: 'Sunrise',
    description: 'The classic purple-pink gradient',
    price: 0,
    preview: {
      gradient: 'from-purple-50 via-pink-50 to-orange-50',
      cardBg: 'bg-white',
      accent: 'text-purple-600'
    },
    colors: {
      primary: 'purple',
      secondary: 'pink',
      accent: 'orange',
      background: 'from-purple-50 via-pink-50 to-orange-50'
    },
    rarity: 'common',
    levelRequired: 1,
    achievementsRequired: []
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    description: 'Cool blue tones like a calm ocean',
    price: 500,
    preview: {
      gradient: 'from-blue-50 via-cyan-50 to-teal-50',
      cardBg: 'bg-blue-50/50',
      accent: 'text-blue-600'
    },
    colors: {
      primary: 'blue',
      secondary: 'cyan',
      accent: 'teal',
      background: 'from-blue-50 via-cyan-50 to-teal-50'
    },
    rarity: 'common',
    levelRequired: 5,
    achievementsRequired: ['first-meal', 'streak-3']
  },
  {
    id: 'forest',
    name: 'Forest Grove',
    description: 'Natural green shades of the forest',
    price: 750,
    preview: {
      gradient: 'from-green-50 via-emerald-50 to-lime-50',
      cardBg: 'bg-green-50/50',
      accent: 'text-green-600'
    },
    colors: {
      primary: 'green',
      secondary: 'emerald',
      accent: 'lime',
      background: 'from-green-50 via-emerald-50 to-lime-50'
    },
    rarity: 'common',
    levelRequired: 8,
    achievementsRequired: ['first-workout', 'meals-10']
  },
  {
    id: 'sunset',
    name: 'Golden Sunset',
    description: 'Warm oranges and yellows',
    price: 1200,
    preview: {
      gradient: 'from-orange-50 via-amber-50 to-yellow-50',
      cardBg: 'bg-orange-50/50',
      accent: 'text-orange-600'
    },
    colors: {
      primary: 'orange',
      secondary: 'amber',
      accent: 'yellow',
      background: 'from-orange-50 via-amber-50 to-yellow-50'
    },
    rarity: 'rare',
    levelRequired: 12,
    achievementsRequired: ['streak-7', 'calorie-counter']
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    description: 'Soft purple and violet hues',
    price: 1500,
    preview: {
      gradient: 'from-purple-50 via-violet-50 to-indigo-50',
      cardBg: 'bg-purple-50/50',
      accent: 'text-purple-600'
    },
    colors: {
      primary: 'purple',
      secondary: 'violet',
      accent: 'indigo',
      background: 'from-purple-50 via-violet-50 to-indigo-50'
    },
    rarity: 'rare',
    levelRequired: 15,
    achievementsRequired: ['weight-loss-5', 'meals-50']
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    description: 'Sleek dark theme for night owls',
    price: 1800,
    preview: {
      gradient: 'from-gray-900 via-slate-800 to-gray-900',
      cardBg: 'bg-gray-800',
      accent: 'text-gray-300'
    },
    colors: {
      primary: 'gray',
      secondary: 'slate',
      accent: 'gray',
      background: 'from-gray-900 via-slate-800 to-gray-900'
    },
    rarity: 'rare',
    levelRequired: 18,
    achievementsRequired: ['night-owl-logger', 'streak-14']
  },
  {
    id: 'rose',
    name: 'Rose Garden',
    description: 'Elegant pink and rose tones',
    price: 2500,
    preview: {
      gradient: 'from-pink-50 via-rose-50 to-red-50',
      cardBg: 'bg-pink-50/50',
      accent: 'text-pink-600'
    },
    colors: {
      primary: 'pink',
      secondary: 'rose',
      accent: 'red',
      background: 'from-pink-50 via-rose-50 to-red-50'
    },
    rarity: 'epic',
    levelRequired: 25,
    achievementsRequired: ['weight-loss-10', 'streak-30', 'meals-100']
  },
  {
    id: 'midnight',
    name: 'Midnight Magic',
    description: 'Deep blues and purples of the night',
    price: 3000,
    preview: {
      gradient: 'from-slate-100 via-blue-100 to-indigo-100',
      cardBg: 'bg-slate-100/50',
      accent: 'text-slate-700'
    },
    colors: {
      primary: 'slate',
      secondary: 'blue',
      accent: 'indigo',
      background: 'from-slate-100 via-blue-100 to-indigo-100'
    },
    rarity: 'epic',
    levelRequired: 30,
    achievementsRequired: ['activity-25', 'calories-25k', 'level-25']
  },
  {
    id: 'rainbow',
    name: 'Rainbow Burst',
    description: 'Vibrant colors of the rainbow - Ultimate Achievement',
    price: 5000,
    preview: {
      gradient: 'from-red-50 via-yellow-50 via-green-50 via-blue-50 to-purple-50',
      cardBg: 'bg-gradient-to-r from-red-50/30 to-purple-50/30',
      accent: 'text-purple-600'
    },
    colors: {
      primary: 'red',
      secondary: 'rainbow',
      accent: 'purple',
      background: 'from-red-50 via-yellow-50 via-green-50 via-blue-50 to-purple-50'
    },
    rarity: 'legendary',
    levelRequired: 50,
    achievementsRequired: ['weight-loss-25', 'streak-100', 'meals-250', 'activity-50', 'level-50']
  },
  {
    id: 'platinum',
    name: 'Platinum Elite',
    description: 'Exclusive platinum theme for true champions',
    price: 7500,
    preview: {
      gradient: 'from-slate-200 via-gray-100 to-zinc-200',
      cardBg: 'bg-slate-100/70',
      accent: 'text-slate-600'
    },
    colors: {
      primary: 'slate',
      secondary: 'gray',
      accent: 'zinc',
      background: 'from-slate-200 via-gray-100 to-zinc-200'
    },
    rarity: 'legendary',
    levelRequired: 75,
    achievementsRequired: ['weight-loss-50', 'streak-200', 'meals-500', 'activity-100', 'coins-1000']
  },
  {
    id: 'diamond',
    name: 'Diamond Mastery',
    description: 'The ultimate theme for weight loss legends',
    price: 10000,
    preview: {
      gradient: 'from-cyan-100 via-blue-50 to-indigo-100',
      cardBg: 'bg-gradient-to-r from-cyan-50/50 to-indigo-50/50',
      accent: 'text-cyan-600'
    },
    colors: {
      primary: 'cyan',
      secondary: 'blue',
      accent: 'indigo',
      background: 'from-cyan-100 via-blue-50 to-indigo-100'
    },
    rarity: 'legendary',
    levelRequired: 100,
    achievementsRequired: ['weight-loss-100', 'streak-365', 'level-100', 'activity-marathon', 'perfectionist']
  }
]

const rarityColors = {
  common: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  rare: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  epic: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  legendary: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
}

const rarityIcons = {
  common: '⚪',
  rare: '🔵',
  epic: '🟣',
  legendary: '🌟'
}

export const Shop: React.FC = () => {
  const { stats, purchaseTheme, currentTheme, ownedThemes } = useGame()
  const { showInAppNotification } = useNotifications()

  // Get earned achievements
  const earnedAchievements = stats.achievements.filter(a => a.earned).map(a => a.id)

  const handlePurchase = (theme: Theme) => {
    if (stats.coins < theme.price) {
      showInAppNotification('Not enough coins! Keep logging meals to earn more.', 'error')
      return
    }

    if (ownedThemes.includes(theme.id)) {
      showInAppNotification('You already own this theme!', 'info')
      return
    }

    if (stats.level < theme.levelRequired) {
      showInAppNotification(`You need to reach level ${theme.levelRequired} first!`, 'error')
      return
    }

    const missingAchievements = theme.achievementsRequired.filter(id => !earnedAchievements.includes(id))
    if (missingAchievements.length > 0) {
      showInAppNotification(`You need to unlock ${missingAchievements.length} more achievements first!`, 'error')
      return
    }

    purchaseTheme(theme.id, theme.price)
    showInAppNotification(`🎉 You purchased ${theme.name}!`, 'success')
  }

  const handleApplyTheme = (theme: Theme) => {
    if (!ownedThemes.includes(theme.id) && theme.price > 0) {
      showInAppNotification('You need to purchase this theme first!', 'error')
      return
    }

    purchaseTheme(theme.id, 0) // Apply theme (0 cost for owned themes)
    showInAppNotification(`✨ Applied ${theme.name} theme!`, 'success')
  }

  const meetsRequirements = (theme: Theme) => {
    const levelMet = stats.level >= theme.levelRequired
    const achievementsMet = theme.achievementsRequired.every(id => earnedAchievements.includes(id))
    return levelMet && achievementsMet
  }

  const getRequirementText = (theme: Theme) => {
    const requirements = []
    
    if (stats.level < theme.levelRequired) {
      requirements.push(`Level ${theme.levelRequired}`)
    }
    
    const missingAchievements = theme.achievementsRequired.filter(id => !earnedAchievements.includes(id))
    if (missingAchievements.length > 0) {
      requirements.push(`${missingAchievements.length} more achievements`)
    }
    
    return requirements.length > 0 ? requirements.join(', ') : null
  }

  return (
    <div className="space-y-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Theme Shop
        </h1>
        <p className="text-muted-foreground mt-2">
          Customize your app with beautiful themes
        </p>
      </motion.div>

      {/* Coin Balance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-2">
              <Coins className="text-yellow-600 dark:text-yellow-400" size={24} />
              <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.coins}</span>
              <span className="text-yellow-600 dark:text-yellow-400">coins</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Theme */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              <Palette className="text-purple-600 dark:text-purple-400" size={20} />
              <span>Current Theme</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const current = themes.find(t => t.id === currentTheme)
              return current ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${current.preview.gradient}`} />
                    <div>
                      <div className="font-semibold">{current.name}</div>
                      <div className="text-sm text-muted-foreground">{current.description}</div>
                    </div>
                  </div>
                  <Badge className={rarityColors[current.rarity]}>
                    {rarityIcons[current.rarity]} {current.rarity}
                  </Badge>
                </div>
              ) : (
                <div className="text-muted-foreground">No theme applied</div>
              )
            })()}
          </CardContent>
        </Card>
      </motion.div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 gap-4">
        {themes.map((theme, index) => {
          const isOwned = ownedThemes.includes(theme.id)
          const isCurrent = currentTheme === theme.id
          const canAfford = stats.coins >= theme.price
          const meetsReqs = meetsRequirements(theme)
          const requirementText = getRequirementText(theme)
          
          return (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${
                isCurrent ? 'ring-2 ring-purple-500' : ''
              } ${!meetsReqs && !isOwned ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${theme.preview.gradient} shadow-sm`} />
                      <div>
                        <div className="font-semibold text-lg flex items-center space-x-2">
                          <span>{theme.name}</span>
                          {theme.levelRequired > 1 && (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Star size={12} />
                              <span>Lv.{theme.levelRequired}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{theme.description}</div>
                        {requirementText && (
                          <div className="text-xs text-red-500 mt-1 flex items-center space-x-1">
                            <Lock size={12} />
                            <span>Requires: {requirementText}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className={rarityColors[theme.rarity]}>
                      {rarityIcons[theme.rarity]} {theme.rarity}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {theme.price > 0 && (
                        <div className="flex items-center space-x-1">
                          <Coins size={16} className="text-yellow-600 dark:text-yellow-400" />
                          <span className="font-semibold text-yellow-700 dark:text-yellow-300">{theme.price}</span>
                        </div>
                      )}
                      {theme.price === 0 && (
                        <Badge variant="secondary">Free</Badge>
                      )}
                      {theme.achievementsRequired.length > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Trophy size={12} />
                          <span>{theme.achievementsRequired.length} achievements</span>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {isCurrent ? (
                        <Button size="sm" disabled className="bg-green-100 text-green-700">
                          <Check size={16} className="mr-1" />
                          Applied
                        </Button>
                      ) : isOwned ? (
                        <Button
                          size="sm"
                          onClick={() => handleApplyTheme(theme)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Sparkles size={16} className="mr-1" />
                          Apply
                        </Button>
                      ) : theme.price === 0 && meetsReqs ? (
                        <Button
                          size="sm"
                          onClick={() => handleApplyTheme(theme)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Sparkles size={16} className="mr-1" />
                          Apply
                        </Button>
                      ) : meetsReqs && canAfford ? (
                        <Button
                          size="sm"
                          onClick={() => handlePurchase(theme)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ShoppingBag size={16} className="mr-1" />
                          Buy
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          disabled
                          className="bg-gray-300 cursor-not-allowed"
                        >
                          <Lock size={16} className="mr-1" />
                          {!meetsReqs ? 'Locked' : 'Not enough coins'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}