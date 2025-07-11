import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ExternalLink, Sparkles, TrendingUp, Users, Award } from 'lucide-react'

// Mock native ad content that looks like app content
const nativeAds = [
  {
    id: 'success-story-1',
    type: 'success-story',
    title: 'Sarah Lost 45 lbs in 6 Months',
    description: 'Discover how Sarah transformed her life with simple daily habits and the right nutrition plan.',
    image: '🌟',
    cta: 'Read Her Story',
    sponsor: 'SuccessStories',
    metrics: { likes: 1247, shares: 89 },
    badge: 'Success Story'
  },
  {
    id: 'tip-1',
    type: 'tip',
    title: '5 Foods That Boost Metabolism',
    description: 'Nutritionists reveal the simple foods that can help accelerate your weight loss journey.',
    image: '🔥',
    cta: 'Learn More',
    sponsor: 'NutritionTips',
    metrics: { likes: 892, shares: 156 },
    badge: 'Expert Tip'
  },
  {
    id: 'challenge-1',
    type: 'challenge',
    title: '30-Day Fitness Challenge',
    description: 'Join thousands of people taking the viral fitness challenge. No equipment needed!',
    image: '💪',
    cta: 'Join Challenge',
    sponsor: 'FitChallenge',
    metrics: { likes: 2341, shares: 423 },
    badge: 'Trending'
  },
  {
    id: 'recipe-1',
    type: 'recipe',
    title: 'High-Protein Breakfast Bowl',
    description: 'This delicious 400-calorie breakfast keeps you full for hours and tastes amazing.',
    image: '🥣',
    cta: 'Get Recipe',
    sponsor: 'HealthyEats',
    metrics: { likes: 1567, shares: 234 },
    badge: 'Recipe'
  }
]

interface NativeAdCardProps {
  className?: string
}

export const NativeAdCard: React.FC<NativeAdCardProps> = ({ className = '' }) => {
  const [currentAd, setCurrentAd] = useState(nativeAds[0])
  const [isVisible] = useState(true)

  useEffect(() => {
    // Rotate native ads every 20 seconds
    const interval = setInterval(() => {
      setCurrentAd(nativeAds[Math.floor(Math.random() * nativeAds.length)])
    }, 20000)

    return () => clearInterval(interval)
  }, [])

  const handleAdClick = () => {
    // In a real app, this would open the advertiser's content
    console.log(`Native ad clicked: ${currentAd.title}`)
  }

  if (!isVisible) return null

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'success-story':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'tip':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'challenge':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
      case 'recipe':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={handleAdClick}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Badge 
              variant="secondary" 
              className={`text-xs ${getBadgeColor(currentAd.type)}`}
            >
              <Sparkles size={10} className="mr-1" />
              {currentAd.badge}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Sponsored
            </Badge>
          </div>
          <CardTitle className="text-base leading-tight">{currentAd.title}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="text-3xl">{currentAd.image}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {currentAd.description}
              </p>
              
              <div className="flex items-center space-x-4 mb-3 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <TrendingUp size={12} />
                  <span>{currentAd.metrics.likes.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={12} />
                  <span>{currentAd.metrics.shares}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award size={12} />
                  <span>{currentAd.sponsor}</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                <ExternalLink size={14} className="mr-2" />
                {currentAd.cta}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}