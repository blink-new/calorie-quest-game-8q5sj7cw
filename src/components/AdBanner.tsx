import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { X, Sparkles, Gift, Heart } from 'lucide-react'
import { useGame } from '../contexts/GameContext'

// Mock ad data - in a real app, this would come from an ad network
const mockAds = [
  {
    id: 'fitness-app-1',
    type: 'health' as const,
    title: 'MyFitnessPal Premium',
    description: 'Unlock advanced nutrition tracking with macro goals and premium recipes',
    image: '🏃‍♀️',
    cta: 'Try Premium',
    reward: 25,
    sponsor: 'MyFitnessPal',
    backgroundColor: 'from-green-500 to-emerald-600'
  },
  {
    id: 'meal-kit-1',
    type: 'food' as const,
    title: 'HelloFresh Meal Kits',
    description: 'Get fresh ingredients & chef-designed recipes delivered to your door',
    image: '🍱',
    cta: 'Get 50% Off',
    reward: 50,
    sponsor: 'HelloFresh',
    backgroundColor: 'from-orange-500 to-red-500'
  },
  {
    id: 'fitness-gear-1',
    type: 'equipment' as const,
    title: 'Smart Fitness Watch',
    description: 'Track your workouts, heart rate, and sleep patterns automatically',
    image: '⌚',
    cta: 'Shop Now',
    reward: 35,
    sponsor: 'FitTech',
    backgroundColor: 'from-blue-500 to-purple-600'
  },
  {
    id: 'supplement-1',
    type: 'health' as const,
    title: 'Protein Powder Sale',
    description: 'Premium whey protein to fuel your fitness journey - 30% off',
    image: '💪',
    cta: 'Shop Sale',
    reward: 40,
    sponsor: 'NutriMax',
    backgroundColor: 'from-purple-500 to-pink-600'
  },
  {
    id: 'meditation-app-1',
    type: 'wellness' as const,
    title: 'Calm Premium',
    description: 'Reduce stress and improve sleep with guided meditation sessions',
    image: '🧘‍♀️',
    cta: 'Try Free',
    reward: 30,
    sponsor: 'Calm',
    backgroundColor: 'from-teal-500 to-cyan-600'
  }
]

interface AdBannerProps {
  placement: 'top' | 'middle' | 'bottom'
  className?: string
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement, className = '' }) => {
  const [currentAd, setCurrentAd] = useState(mockAds[0])
  const [isVisible, setIsVisible] = useState(true)
  const [hasInteracted, setHasInteracted] = useState(false)
  const { stats } = useGame()

  // Rotate ads every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasInteracted) {
        setCurrentAd(mockAds[Math.floor(Math.random() * mockAds.length)])
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [hasInteracted])

  // Show different ad types based on user level
  useEffect(() => {
    let filteredAds = mockAds
    if (stats.level < 3) {
      filteredAds = mockAds.filter(ad => ad.type === 'food' || ad.type === 'health')
    } else if (stats.level < 6) {
      filteredAds = mockAds.filter(ad => ad.type !== 'equipment')
    }
    
    setCurrentAd(filteredAds[Math.floor(Math.random() * filteredAds.length)])
  }, [stats.level])

  const handleAdClick = () => {
    setHasInteracted(true)
    // In a real app, this would open the advertiser's landing page
    // For now, we'll just show a notification
    console.log(`Ad clicked: ${currentAd.title}`)
  }

  const handleClose = () => {
    setIsVisible(false)
    setHasInteracted(true)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: placement === 'top' ? -20 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: placement === 'top' ? -20 : 20 }}
        transition={{ duration: 0.3 }}
        className={`relative ${className}`}
      >
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardContent className="p-0">
            <div className={`bg-gradient-to-r ${currentAd.backgroundColor} relative`}>
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="absolute top-2 right-2 h-6 w-6 p-0 text-white hover:bg-white/20 z-10"
              >
                <X size={12} />
              </Button>

              {/* Ad content */}
              <div className="p-4 text-white">
                <div className="flex items-start space-x-3">
                  <div className="text-3xl">{currentAd.image}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                        <Sparkles size={10} className="mr-1" />
                        Sponsored
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                        <Gift size={10} className="mr-1" />
                        +{currentAd.reward} coins
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-sm mb-1 line-clamp-1">{currentAd.title}</h3>
                    <p className="text-xs text-white/90 mb-3 line-clamp-2">{currentAd.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleAdClick}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs px-3 py-1"
                      >
                        {currentAd.cta}
                      </Button>
                      
                      <div className="flex items-center space-x-1 text-xs text-white/80">
                        <Heart size={10} />
                        <span>by {currentAd.sponsor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}