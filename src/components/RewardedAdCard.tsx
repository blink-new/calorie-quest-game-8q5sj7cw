import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Play, Gift, Coins, Clock, Star } from 'lucide-react'
import { useGame } from '../contexts/GameContext'
import { useNotifications } from '../contexts/NotificationContext'

interface RewardedAdCardProps {
  className?: string
}

export const RewardedAdCard: React.FC<RewardedAdCardProps> = ({ className = '' }) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false)
  const [adProgress, setAdProgress] = useState(0)
  const [canWatchAd, setCanWatchAd] = useState(true)
  const { stats } = useGame()
  const { showInAppNotification } = useNotifications()

  const baseReward = 50
  const bonusReward = Math.floor(stats.level * 5) // Level-based bonus
  const totalReward = baseReward + bonusReward

  const handleWatchAd = () => {
    if (!canWatchAd) return

    setIsWatchingAd(true)
    setAdProgress(0)

    // Simulate watching a 30-second ad
    const interval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsWatchingAd(false)
          setCanWatchAd(false)
          
          // Award coins (this would normally be handled by the game context)
          showInAppNotification(`🎉 Ad complete! +${totalReward} coins earned!`, 'success')
          
          // Re-enable after 5 minutes (300 seconds)
          setTimeout(() => {
            setCanWatchAd(true)
            showInAppNotification('💰 New rewarded ad available!', 'info')
          }, 300000)
          
          return 100
        }
        return prev + (100 / 30) // 30 second ad
      })
    }, 1000)
  }

  const nextAdCountdown = !canWatchAd ? '5:00' : null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={className}
    >
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <Gift className="text-yellow-600 dark:text-yellow-400" size={16} />
              </div>
              <span className="text-sm font-bold">Earn Free Coins</span>
            </div>
            <Badge 
              variant="secondary" 
              className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700"
            >
              <Star size={10} className="mr-1" />
              Premium
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isWatchingAd ? (
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl mb-2">📺</div>
                <p className="text-sm text-muted-foreground">Watching sponsored content...</p>
              </div>
              <Progress value={adProgress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                {Math.ceil(30 - (adProgress / 100) * 30)}s remaining
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-2xl mb-2">🎬</div>
                <p className="text-sm text-muted-foreground">
                  Watch a short video to earn coins
                </p>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <Coins className="text-yellow-600 dark:text-yellow-400" size={16} />
                <span className="font-bold text-lg text-yellow-700 dark:text-yellow-300">
                  +{totalReward}
                </span>
                <span className="text-sm text-muted-foreground">coins</span>
              </div>
              
              {stats.level > 1 && (
                <div className="text-center">
                  <Badge variant="outline" className="text-xs">
                    Level {stats.level} bonus: +{bonusReward} coins
                  </Badge>
                </div>
              )}
              
              <Button
                onClick={handleWatchAd}
                disabled={!canWatchAd}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                {canWatchAd ? (
                  <div className="flex items-center space-x-2">
                    <Play size={16} />
                    <span>Watch Ad</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Clock size={16} />
                    <span>Next ad in {nextAdCountdown}</span>
                  </div>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}