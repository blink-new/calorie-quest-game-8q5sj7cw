import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useNotifications } from '../contexts/NotificationContext'
import { ChevronRight, ChevronLeft, Sparkles, Target, Heart, Zap, Trophy, Flame } from 'lucide-react'

interface WelcomeScreenProps {
  onComplete: () => void
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [userInfo, setUserInfo] = useState({
    name: '',
    currentWeight: '',
    targetWeight: '',
    age: '',
    height: '',
    gender: 'other' as 'male' | 'female' | 'other',
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
  })
  const { requestPermission } = useNotifications()

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Save user info and complete welcome
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      onComplete()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const handleNotificationPermission = async () => {
    await requestPermission()
    handleNext()
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return userInfo.name.trim().length > 0
      case 2:
        return userInfo.currentWeight && userInfo.targetWeight
      default:
        return true
    }
  }

  const calculateWeightLoss = () => {
    if (userInfo.currentWeight && userInfo.targetWeight) {
      return (parseFloat(userInfo.currentWeight) - parseFloat(userInfo.targetWeight)).toFixed(1)
    }
    return '0'
  }

  const steps = [
    {
      title: "Welcome to FitQuest! 🏆",
      description: "Transform your weight loss journey into an exciting adventure",
      content: (
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="text-8xl mb-4"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎮
          </motion.div>
          <div className="space-y-4">
            {[
              { icon: <Zap className="text-yellow-500" size={24} />, text: "Level up by logging meals", delay: 0.2, color: "from-yellow-50 to-orange-50" },
              { icon: <Trophy className="text-purple-500" size={24} />, text: "Unlock achievements", delay: 0.4, color: "from-purple-50 to-pink-50" },
              { icon: <Flame className="text-red-500" size={24} />, text: "Build streaks", delay: 0.6, color: "from-red-50 to-orange-50" },
              { icon: <span className="text-2xl">🪙</span>, text: "Earn coins", delay: 0.8, color: "from-green-50 to-emerald-50" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: feature.delay }}
                className={`flex items-center justify-center space-x-3 p-4 bg-gradient-to-r ${feature.color} rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300`}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                <span className="font-medium text-gray-700">{feature.text}</span>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50"
          >
            <p className="text-sm text-indigo-700 font-medium">
              🌟 Join thousands of users who've made healthy eating fun and rewarding!
            </p>
          </motion.div>
        </motion.div>
      )
    },
    {
      title: "Tell us about yourself",
      description: "Help us personalize your FitQuest",
      content: (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center space-x-2">
              <Sparkles className="text-purple-500" size={16} />
              <span>What's your name?</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={userInfo.name}
              onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              className="border-purple-200 focus:border-purple-500 transition-colors"
            />
            {userInfo.name && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-purple-600 font-medium"
              >
                Nice to meet you, {userInfo.name}! 👋
              </motion.p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={userInfo.age}
                onChange={(e) => setUserInfo(prev => ({ ...prev, age: e.target.value }))}
                className="transition-colors focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (inches)</Label>
              <Input
                id="height"
                type="number"
                placeholder="68"
                value={userInfo.height}
                onChange={(e) => setUserInfo(prev => ({ ...prev, height: e.target.value }))}
                className="transition-colors focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Gender</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'male', label: 'Male', icon: '👨' },
                { value: 'female', label: 'Female', icon: '👩' },
                { value: 'other', label: 'Other', icon: '🧑' }
              ].map(gender => (
                <motion.div key={gender.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={userInfo.gender === gender.value ? 'default' : 'outline'}
                    onClick={() => setUserInfo(prev => ({ ...prev, gender: gender.value as typeof userInfo.gender }))}
                    className="w-full flex items-center space-x-2 transition-all duration-200"
                  >
                    <span>{gender.icon}</span>
                    <span>{gender.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )
    },
    {
      title: "Set your goals",
      description: "What's your target weight?",
      content: (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-weight" className="flex items-center space-x-2">
                <span>📊</span>
                <span>Current Weight (lbs)</span>
              </Label>
              <Input
                id="current-weight"
                type="number"
                placeholder="150"
                value={userInfo.currentWeight}
                onChange={(e) => setUserInfo(prev => ({ ...prev, currentWeight: e.target.value }))}
                className="border-blue-200 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-weight" className="flex items-center space-x-2">
                <Target className="text-green-500" size={16} />
                <span>Target Weight (lbs)</span>
              </Label>
              <Input
                id="target-weight"
                type="number"
                placeholder="140"
                value={userInfo.targetWeight}
                onChange={(e) => setUserInfo(prev => ({ ...prev, targetWeight: e.target.value }))}
                className="border-green-200 focus:border-green-500 transition-colors"
              />
            </div>
          </div>
          
          {userInfo.currentWeight && userInfo.targetWeight && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
            >
              <div className="text-center">
                <motion.div 
                  className="text-2xl font-bold text-green-600 mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎯 Goal: Lose {calculateWeightLoss()} lbs
                </motion.div>
                <div className="text-sm text-muted-foreground">
                  You've got this! 💪 We'll help you get there step by step.
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="space-y-2">
            <Label>Activity Level</Label>
            <div className="space-y-2">
              {[
                { value: 'sedentary', label: 'Sedentary', desc: 'Little/no exercise', icon: '😴', color: 'from-gray-50 to-slate-50' },
                { value: 'light', label: 'Light', desc: '1-3 days/week', icon: '🚶', color: 'from-blue-50 to-cyan-50' },
                { value: 'moderate', label: 'Moderate', desc: '3-5 days/week', icon: '🏃', color: 'from-green-50 to-emerald-50' },
                { value: 'active', label: 'Active', desc: '6-7 days/week', icon: '💪', color: 'from-orange-50 to-yellow-50' },
                { value: 'very-active', label: 'Very Active', desc: '2x/day or intense', icon: '🔥', color: 'from-red-50 to-pink-50' }
              ].map((level, index) => (
                <motion.div 
                  key={level.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={userInfo.activityLevel === level.value ? 'default' : 'outline'}
                    onClick={() => setUserInfo(prev => ({ ...prev, activityLevel: level.value as typeof userInfo.activityLevel }))}
                    className={`w-full justify-start h-auto p-4 transition-all duration-200 ${
                      userInfo.activityLevel === level.value 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : `bg-gradient-to-r ${level.color} hover:shadow-md`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.span 
                        className="text-2xl"
                        animate={userInfo.activityLevel === level.value ? { rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {level.icon}
                      </motion.span>
                      <div className="text-left">
                        <div className="font-medium">{level.label}</div>
                        <div className={`text-xs ${userInfo.activityLevel === level.value ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {level.desc}
                        </div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )
    },
    {
      title: "Stay motivated with reminders! 🔔",
      description: "Get gentle nudges to keep your FitQuest going",
      content: (
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="text-8xl mb-4"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📱
          </motion.div>
          <div className="space-y-4">
            {[
              { icon: "🌅", text: "Morning check-ins", delay: 0.2, color: "from-yellow-50 to-orange-50" },
              { icon: "🌙", text: "Evening reminders", delay: 0.4, color: "from-indigo-50 to-purple-50" },
              { icon: "🔥", text: "Streak protection", delay: 0.6, color: "from-red-50 to-pink-50" },
              { icon: "🏆", text: "Achievement alerts", delay: 0.8, color: "from-green-50 to-emerald-50" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: feature.delay }}
                className={`flex items-center justify-center space-x-3 p-4 bg-gradient-to-r ${feature.color} rounded-xl border border-gray-200/50 shadow-sm`}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {feature.icon}
                </motion.span>
                <span className="font-medium text-gray-700">{feature.text}</span>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50"
          >
            <p className="text-sm text-blue-700 font-medium flex items-center justify-center space-x-2">
              <Heart className="text-blue-500" size={16} />
              <span>We'll send helpful reminders to keep you on track. You can customize these anytime in settings.</span>
            </p>
          </motion.div>
        </motion.div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-20 h-20 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full"
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            scale: [0.5, 1.5, 0.5],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2
          }}
          style={{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%'
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-lg">
          <CardHeader className="text-center">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                {steps[step].title}
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600">
                {steps[step].description}
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {steps[step].content}
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-between items-center">
              <div className="flex space-x-1">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === step 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8' 
                        : index < step 
                          ? 'bg-green-400' 
                          : 'bg-gray-300'
                    }`}
                    animate={index === step ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                {step > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex items-center space-x-1 hover:bg-gray-50"
                    >
                      <ChevronLeft size={16} />
                      <span>Back</span>
                    </Button>
                  </motion.div>
                )}
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={step === 3 ? handleNotificationPermission : handleNext}
                    disabled={!isStepValid()}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center space-x-1 shadow-lg"
                  >
                    <span>
                      {step === 3 ? 'Enable Notifications' : 'Next'}
                    </span>
                    {step < 3 && <ChevronRight size={16} />}
                    {step === 3 && <Sparkles size={16} />}
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}