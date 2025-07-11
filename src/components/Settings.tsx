import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { Badge } from './ui/badge'
import { useNotifications } from '../contexts/NotificationContext'
import { Bell, BellOff, Plus, Trash2, Clock } from 'lucide-react'

export const Settings: React.FC = () => {
  const { settings, updateSettings, requestPermission, hasPermission } = useNotifications()
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [newReminder, setNewReminder] = useState({
    time: '',
    message: '',
    daysOfWeek: [false, false, false, false, false, false, false] // Sun-Sat
  })

  const handlePermissionRequest = async () => {
    const granted = await requestPermission()
    if (granted) {
      updateSettings({ enabled: true })
    }
  }

  const handleAddReminder = () => {
    if (!newReminder.time || !newReminder.message) return

    const reminder = {
      id: Date.now().toString(),
      time: newReminder.time,
      message: newReminder.message,
      enabled: true,
      daysOfWeek: newReminder.daysOfWeek
    }

    updateSettings({
      customReminders: [...settings.customReminders, reminder]
    })

    setNewReminder({
      time: '',
      message: '',
      daysOfWeek: [false, false, false, false, false, false, false]
    })
    setShowAddReminder(false)
  }

  const handleRemoveReminder = (id: string) => {
    updateSettings({
      customReminders: settings.customReminders.filter(r => r.id !== id)
    })
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Settings
        </h1>
      </motion.div>

      {/* Notification Permission */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={`${hasPermission ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2">
              {hasPermission ? <Bell className="text-green-600" size={20} /> : <BellOff className="text-yellow-600" size={20} />}
              <span>Notification Permission</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {hasPermission 
                ? 'Great! You\'ll receive helpful reminders to stay on track with your goals.' 
                : 'Enable notifications to get reminders that help you stay motivated and consistent.'}
            </p>
            {!hasPermission && (
              <Button onClick={handlePermissionRequest} className="w-full">
                Enable Notifications
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications-enabled">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Turn all notifications on/off</p>
              </div>
              <Switch
                id="notifications-enabled"
                checked={settings.enabled}
                onCheckedChange={(checked) => updateSettings({ enabled: checked })}
                disabled={!hasPermission}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="morning-reminder">Morning Reminder</Label>
                  <p className="text-sm text-muted-foreground">Daily reminder at 9:00 AM</p>
                </div>
                <Switch
                  id="morning-reminder"
                  checked={settings.morningReminder}
                  onCheckedChange={(checked) => updateSettings({ morningReminder: checked })}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="evening-reminder">Evening Reminder</Label>
                  <p className="text-sm text-muted-foreground">Daily reminder at 7:00 PM</p>
                </div>
                <Switch
                  id="evening-reminder"
                  checked={settings.eveningReminder}
                  onCheckedChange={(checked) => updateSettings({ eveningReminder: checked })}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="streak-reminder">Streak Protection</Label>
                  <p className="text-sm text-muted-foreground">Reminder if you haven't logged in 24h</p>
                </div>
                <Switch
                  id="streak-reminder"
                  checked={settings.streakReminder}
                  onCheckedChange={(checked) => updateSettings({ streakReminder: checked })}
                  disabled={!settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="achievement-notifications">Achievement Notifications</Label>
                  <p className="text-sm text-muted-foreground">Celebrate your wins</p>
                </div>
                <Switch
                  id="achievement-notifications"
                  checked={settings.achievementNotifications}
                  onCheckedChange={(checked) => updateSettings({ achievementNotifications: checked })}
                  disabled={!settings.enabled}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Custom Reminders */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Custom Reminders</span>
              <Button
                size="sm"
                onClick={() => setShowAddReminder(true)}
                disabled={!settings.enabled}
              >
                <Plus size={16} />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {settings.customReminders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No custom reminders set</p>
            ) : (
              settings.customReminders.map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-purple-600" />
                      <span className="font-medium">{reminder.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{reminder.message}</p>
                    <div className="flex space-x-1 mt-2">
                      {reminder.daysOfWeek.map((enabled, index) => (
                        <Badge
                          key={index}
                          variant={enabled ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {dayNames[index]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveReminder(reminder.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Reminder Modal */}
      {showAddReminder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold mb-4">Add Custom Reminder</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reminder-time">Time</Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="reminder-message">Message</Label>
                <Input
                  id="reminder-message"
                  placeholder="e.g., Time for your afternoon snack!"
                  value={newReminder.message}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              
              <div>
                <Label>Days of Week</Label>
                <div className="flex space-x-2 mt-2">
                  {dayNames.map((day, index) => (
                    <Button
                      key={index}
                      variant={newReminder.daysOfWeek[index] ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newDays = [...newReminder.daysOfWeek]
                        newDays[index] = !newDays[index]
                        setNewReminder(prev => ({ ...prev, daysOfWeek: newDays }))
                      }}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddReminder(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddReminder}
                  className="flex-1"
                  disabled={!newReminder.time || !newReminder.message}
                >
                  Add Reminder
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}