import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Trophy, User, ShoppingBag, Activity, Sparkles } from 'lucide-react'
import { useGame } from '../contexts/GameContext'

export const Navigation: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { stats } = useGame()

  const navItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Home',
      notification: null,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    { 
      path: '/activity', 
      icon: Activity, 
      label: 'Activity',
      notification: stats.activityStreak > 0 ? stats.activityStreak : null,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    { 
      path: '/achievements', 
      icon: Trophy, 
      label: 'Achievements',
      notification: stats.achievements.filter(a => a.earned).length,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100'
    },
    { 
      path: '/shop', 
      icon: ShoppingBag, 
      label: 'Shop',
      notification: stats.coins > 0 ? stats.coins : null,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    { 
      path: '/profile', 
      icon: User, 
      label: 'Profile',
      notification: stats.level > 1 ? stats.level : null,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100'
    }
  ]

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg dark:bg-gray-900/95 border-t border-gray-200/50 dark:border-gray-700/50 px-4 py-2 mx-auto max-w-md shadow-2xl"
    >
      <div className="flex justify-around items-center relative">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          
          return (
            <motion.button
              key={item.path}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? `text-white bg-gradient-to-r ${item.color} shadow-lg` 
                  : `text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 ${item.bgColor} dark:hover:bg-purple-900/20`
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative">
                <motion.div
                  animate={isActive ? { 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon size={20} />
                </motion.div>
                
                {/* Enhanced Notification Badge */}
                <AnimatePresence>
                  {item.notification && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`absolute -top-2 -right-2 bg-gradient-to-r ${item.color} text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold shadow-lg border-2 border-white`}
                    >
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        {item.notification > 99 ? '99+' : item.notification}
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Special effects for achievements */}
                {item.path === '/achievements' && stats.achievements.filter(a => a.earned).length > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="text-yellow-400" size={12} />
                  </motion.div>
                )}
              </div>
              
              <span className={`text-xs font-medium transition-all duration-300 ${
                isActive ? 'text-white' : ''
              }`}>
                {item.label}
              </span>
              
              {/* Enhanced Active Indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              {/* Ripple effect on tap */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                initial={{ scale: 0, opacity: 0.5 }}
                whileTap={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: `linear-gradient(to right, ${item.color.split(' ')[1]}, ${item.color.split(' ')[3]})`
                }}
              />
            </motion.button>
          )
        })}
        
        {/* Enhanced Background Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-orange-600/10 rounded-2xl -z-10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.98, 1.02, 0.98]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Floating particles effect */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
            animate={{
              y: [-20, -40, -20],
              x: [Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100 - 50],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${20 + i * 30}%`,
              bottom: '100%'
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}