import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { useNotifications } from '../contexts/NotificationContext'

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

  const handleNotificationPermission = async () => {
    await requestPermission()
    handleNext()
  }

  const steps = [
    {
      title: "Welcome to Calorie Quest! 🏆",
      description: "Transform your weight loss journey into an exciting adventure",
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">🎮</div>
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">⚡</span>
              <span>Level up by logging meals</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🏆</span>
              <span>Unlock achievements</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🔥</span>
              <span>Build streaks</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🪙</span>
              <span>Earn coins</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Tell us about yourself",
      description: "Help us personalize your quest",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">What's your name?</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={userInfo.name}
              onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
            />
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
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <div className="flex space-x-2">
              {['male', 'female', 'other'].map(gender => (
                <Button
                  key={gender}
                  variant={userInfo.gender === gender ? 'default' : 'outline'}
                  onClick={() => setUserInfo(prev => ({ ...prev, gender: gender as typeof userInfo.gender }))}
                  className="flex-1"
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Set your goals",
      description: "What's your target weight?",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-weight">Current Weight (lbs)</Label>
              <Input
                id="current-weight"
                type="number"
                placeholder="150"
                value={userInfo.currentWeight}
                onChange={(e) => setUserInfo(prev => ({ ...prev, currentWeight: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-weight">Target Weight (lbs)</Label>
              <Input
                id="target-weight"
                type="number"
                placeholder="140"
                value={userInfo.targetWeight}
                onChange={(e) => setUserInfo(prev => ({ ...prev, targetWeight: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Activity Level</Label>
            <div className="space-y-2">
              {[
                { value: 'sedentary', label: 'Sedentary (little/no exercise)' },
                { value: 'light', label: 'Light (1-3 days/week)' },
                { value: 'moderate', label: 'Moderate (3-5 days/week)' },
                { value: 'active', label: 'Active (6-7 days/week)' },
                { value: 'very-active', label: 'Very Active (2x/day or intense)' }
              ].map(level => (
                <Button
                  key={level.value}
                  variant={userInfo.activityLevel === level.value ? 'default' : 'outline'}
                  onClick={() => setUserInfo(prev => ({ ...prev, activityLevel: level.value as typeof userInfo.activityLevel }))}
                  className="w-full justify-start"
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Stay motivated with reminders! 🔔",
      description: "Get gentle nudges to keep your quest going",
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">📱</div>
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🌅</span>
              <span>Morning check-ins</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🌙</span>
              <span>Evening reminders</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🔥</span>
              <span>Streak protection</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">🏆</span>
              <span>Achievement alerts</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            We'll send helpful reminders to keep you on track. You can customize these anytime in settings.
          </p>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {steps[step].title}
          </CardTitle>
          <CardDescription>
            {steps[step].description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {steps[step].content}
          </motion.div>
          
          <div className="flex justify-between items-center">
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === step ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              onClick={step === 3 ? handleNotificationPermission : handleNext}
              disabled={
                (step === 1 && !userInfo.name) ||
                (step === 2 && (!userInfo.currentWeight || !userInfo.targetWeight))
              }
              className="px-6"
            >
              {step === 3 ? 'Enable Notifications' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}