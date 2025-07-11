import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useGame } from '../contexts/GameContext'
import { useNotifications } from '../contexts/NotificationContext'
import { ShoppingBag, Coins, Check, Lock, Sparkles, Palette } from 'lucide-react'

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
    rarity: 'common'
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    description: 'Cool blue tones like a calm ocean',
    price: 150,
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
    rarity: 'common'
  },
  {
    id: 'forest',
    name: 'Forest Grove',
    description: 'Natural green shades of the forest',
    price: 200,
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
    rarity: 'common'
  },
  {
    id: 'sunset',
    name: 'Golden Sunset',
    description: 'Warm oranges and yellows',
    price: 300,
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
    rarity: 'rare'
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    description: 'Soft purple and violet hues',
    price: 350,
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
    rarity: 'rare'
  },
  {
    id: 'rose',
    name: 'Rose Garden',
    description: 'Elegant pink and rose tones',
    price: 400,
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
    rarity: 'epic'
  },
  {
    id: 'midnight',
    name: 'Midnight Magic',
    description: 'Deep blues and purples of the night',
    price: 500,
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
    rarity: 'epic'
  },
  {
    id: 'rainbow',
    name: 'Rainbow Burst',
    description: 'Vibrant colors of the rainbow',
    price: 750,
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
    rarity: 'legendary'
  }
]

const rarityColors = {
  common: 'bg-gray-100 text-gray-700',
  rare: 'bg-blue-100 text-blue-700',
  epic: 'bg-purple-100 text-purple-700',
  legendary: 'bg-yellow-100 text-yellow-700'
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

  const handlePurchase = (theme: Theme) => {
    if (stats.coins < theme.price) {
      showInAppNotification('Not enough coins! Keep logging meals to earn more.', 'error')
      return
    }

    if (ownedThemes.includes(theme.id)) {
      showInAppNotification('You already own this theme!', 'info')
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
        <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-center space-x-2">
              <Coins className="text-yellow-600" size={24} />
              <span className="text-2xl font-bold text-yellow-700">{stats.coins}</span>
              <span className="text-yellow-600">coins</span>
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
              <Palette className="text-purple-600" size={20} />
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
          
          return (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${
                isCurrent ? 'ring-2 ring-purple-500' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${theme.preview.gradient} shadow-sm`} />
                      <div>
                        <div className="font-semibold text-lg">{theme.name}</div>
                        <div className="text-sm text-muted-foreground">{theme.description}</div>
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
                          <Coins size={16} className="text-yellow-600" />
                          <span className="font-semibold text-yellow-700">{theme.price}</span>
                        </div>
                      )}
                      {theme.price === 0 && (
                        <Badge variant="secondary">Free</Badge>
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
                      ) : theme.price === 0 ? (
                        <Button
                          size="sm"
                          onClick={() => handleApplyTheme(theme)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Sparkles size={16} className="mr-1" />
                          Apply
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handlePurchase(theme)}
                          disabled={!canAfford}
                          className={canAfford ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}
                        >
                          {canAfford ? (
                            <>
                              <ShoppingBag size={16} className="mr-1" />
                              Buy
                            </>
                          ) : (
                            <>
                              <Lock size={16} className="mr-1" />
                              Not enough coins
                            </>
                          )}
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