import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { useGame } from '../contexts/GameContext'
import { Trophy, Lock, Star } from 'lucide-react'

export const Achievements: React.FC = () => {
  const { stats } = useGame()

  const earnedAchievements = stats.achievements.filter(a => a.earned)
  const lockedAchievements = stats.achievements.filter(a => !a.earned)



  return (
    <div className="space-y-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Achievements
        </h1>
        <p className="text-muted-foreground mt-2">
          {earnedAchievements.length} of {stats.achievements.length} unlocked
        </p>
      </motion.div>

      {/* Achievement Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Trophy className="text-yellow-600" size={24} />
                <div>
                  <div className="font-bold text-lg">{earnedAchievements.length}</div>
                  <div className="text-sm text-muted-foreground">Achievements</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="text-yellow-600" size={24} />
                <div>
                  <div className="font-bold text-lg">{stats.coins}</div>
                  <div className="text-sm text-muted-foreground">Coins Earned</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Earned Achievements */}
      {earnedAchievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="text-yellow-500" size={20} />
                <span>Unlocked Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {earnedAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-4 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                >
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {achievement.category}
                      </Badge>
                      <span className="text-xs text-green-600 font-medium">
                        ✓ Completed
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Locked Achievements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="text-gray-500" size={20} />
              <span>Locked Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lockedAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 border border-gray-200"
              >
                <div className="text-3xl grayscale">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-700">{achievement.title}</div>
                  <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {achievement.category}
                    </Badge>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-muted-foreground">
                        {achievement.progress}/{achievement.requirement}
                      </span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                          style={{ width: `${Math.min(100, (achievement.progress / achievement.requirement) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Achievement Categories */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Achievement Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {['streak', 'weight', 'calories', 'meals', 'special'].map((category) => {
                const categoryAchievements = stats.achievements.filter(a => a.category === category)
                const earnedCount = categoryAchievements.filter(a => a.earned).length
                const totalCount = categoryAchievements.length
                const progress = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0

                return (
                  <div key={category} className="p-3 rounded-lg border">
                    <div className="text-sm font-medium capitalize mb-2">{category}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {earnedCount}/{totalCount} completed
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}