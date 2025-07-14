import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

interface NotificationSettings {
  enabled: boolean
  morningReminder: boolean
  eveningReminder: boolean
  streakReminder: boolean
  achievementNotifications: boolean
  customReminders: CustomReminder[]
}

interface CustomReminder {
  id: string
  time: string
  message: string
  enabled: boolean
  daysOfWeek: boolean[]
}

interface NotificationContextType {
  settings: NotificationSettings
  updateSettings: (settings: Partial<NotificationSettings>) => void
  requestPermission: () => Promise<boolean>
  hasPermission: boolean
  scheduleReminder: (reminder: CustomReminder) => void
  cancelReminder: (id: string) => void
  showInAppNotification: (message: string, type?: 'success' | 'error' | 'info') => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

const defaultSettings: NotificationSettings = {
  enabled: true,
  morningReminder: true,
  eveningReminder: true,
  streakReminder: true,
  achievementNotifications: true,
  customReminders: []
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings)
  const [hasPermission, setHasPermission] = useState(false)
  const [scheduledReminders, setScheduledReminders] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    // Check notification permission
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted')
    }

    // Schedule default reminders
    scheduleDefaultReminders()
  }, [])

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)
    localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings))
    
    // Reschedule reminders if needed
    if (newSettings.morningReminder !== undefined || newSettings.eveningReminder !== undefined) {
      scheduleDefaultReminders()
    }
  }

  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false
    }

    const permission = await Notification.requestPermission()
    const granted = permission === 'granted'
    setHasPermission(granted)
    return granted
  }

  const scheduleDefaultReminders = () => {
    if (!settings.enabled) return

    // Morning reminder (9 AM)
    if (settings.morningReminder) {
      scheduleRecurringReminder('morning', 9, 0, 'Good morning! 🌅 Ready to start your FitQuest today?')
    }

    // Evening reminder (7 PM)
    if (settings.eveningReminder) {
      scheduleRecurringReminder('evening', 19, 0, 'Evening check-in! 🌙 How did your FitQuest go today?')
    }

    // Streak reminder (if user hasn't logged in 24 hours)
    if (settings.streakReminder) {
      scheduleStreakReminder()
    }
  }

  const scheduleRecurringReminder = (id: string, hour: number, minute: number, message: string) => {
    // Cancel existing reminder
    const existingTimeout = scheduledReminders.get(id)
    if (existingTimeout) {
      clearTimeout(existingTimeout)
    }

    const scheduleNext = () => {
      const now = new Date()
      const scheduledTime = new Date()
      scheduledTime.setHours(hour, minute, 0, 0)

      // If the time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1)
      }

      const timeUntilReminder = scheduledTime.getTime() - now.getTime()

      const timeout = setTimeout(() => {
        if (settings.enabled && hasPermission) {
          showNotification(message)
        }
        scheduleNext() // Schedule the next occurrence
      }, timeUntilReminder)

      scheduledReminders.set(id, timeout)
      setScheduledReminders(new Map(scheduledReminders))
    }

    scheduleNext()
  }

  const scheduleStreakReminder = () => {
    // Check every hour if user hasn't logged food in 24 hours
    const checkStreak = () => {
      const lastActivity = localStorage.getItem('lastFoodLog')
      if (lastActivity) {
        const lastActivityTime = new Date(lastActivity)
        const hoursAgo = (Date.now() - lastActivityTime.getTime()) / (1000 * 60 * 60)
        
        if (hoursAgo >= 24) {
          showNotification('⚡ Don\'t break your streak! Log your meals to keep your FitQuest alive!')
        }
      }
    }

    const interval = setInterval(checkStreak, 60 * 60 * 1000) // Check every hour
    return () => clearInterval(interval)
  }

  const scheduleReminder = (reminder: CustomReminder) => {
    if (!reminder.enabled || !settings.enabled) return

    const [hour, minute] = reminder.time.split(':').map(Number)
    
    const scheduleNext = () => {
      const now = new Date()
      const scheduledTime = new Date()
      scheduledTime.setHours(hour, minute, 0, 0)

      // Check if this reminder should fire today
      const dayOfWeek = scheduledTime.getDay()
      if (!reminder.daysOfWeek[dayOfWeek]) {
        // Find next valid day
        let daysToAdd = 1
        while (daysToAdd < 7 && !reminder.daysOfWeek[(dayOfWeek + daysToAdd) % 7]) {
          daysToAdd++
        }
        scheduledTime.setDate(scheduledTime.getDate() + daysToAdd)
      } else if (scheduledTime <= now) {
        // If time has passed today, schedule for next occurrence
        let daysToAdd = 1
        while (daysToAdd < 7 && !reminder.daysOfWeek[(dayOfWeek + daysToAdd) % 7]) {
          daysToAdd++
        }
        scheduledTime.setDate(scheduledTime.getDate() + daysToAdd)
      }

      const timeUntilReminder = scheduledTime.getTime() - now.getTime()

      const timeout = setTimeout(() => {
        if (settings.enabled && hasPermission) {
          showNotification(reminder.message)
        }
        scheduleNext() // Schedule the next occurrence
      }, timeUntilReminder)

      scheduledReminders.set(reminder.id, timeout)
      setScheduledReminders(new Map(scheduledReminders))
    }

    scheduleNext()
  }

  const cancelReminder = (id: string) => {
    const timeout = scheduledReminders.get(id)
    if (timeout) {
      clearTimeout(timeout)
      scheduledReminders.delete(id)
      setScheduledReminders(new Map(scheduledReminders))
    }
  }

  const showNotification = (message: string, icon?: string) => {
    if (!hasPermission || !settings.enabled) return

    const notification = new Notification('FitQuest', {
      body: message,
      icon: icon || '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'fitquest-reminder',
      requireInteraction: false,
      silent: false
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000)
  }

  const showInAppNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const emoji = type === 'success' ? '🎉' : type === 'error' ? '❌' : '💡'
    toast(message, {
      icon: emoji,
      duration: 4000,
      position: 'top-center',
      style: {
        background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
        color: 'white',
        borderRadius: '12px',
        fontWeight: '500'
      }
    })
  }

  const value: NotificationContextType = {
    settings,
    updateSettings,
    requestPermission,
    hasPermission,
    scheduleReminder,
    cancelReminder,
    showInAppNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}