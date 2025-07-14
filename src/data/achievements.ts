interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedAt?: Date
  category: 'streak' | 'weight' | 'calories' | 'meals' | 'special' | 'activity'
  requirement: number
  progress: number
}

export const achievements: Achievement[] = [
  // Original achievements (6)
  {
    id: 'first-meal',
    title: 'First Steps',
    description: 'Log your first meal',
    icon: '🍎',
    earned: false,
    category: 'meals',
    requirement: 1,
    progress: 0
  },
  {
    id: 'streak-3',
    title: 'Habit Former',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    earned: false,
    category: 'streak',
    requirement: 3,
    progress: 0
  },
  {
    id: 'weight-loss-1',
    title: 'First Milestone',
    description: 'Lose your first pound',
    icon: '📉',
    earned: false,
    category: 'weight',
    requirement: 1,
    progress: 0
  },
  {
    id: 'calorie-counter',
    title: 'Calorie Counter',
    description: 'Log 1,000 calories total',
    icon: '🔢',
    earned: false,
    category: 'calories',
    requirement: 1000,
    progress: 0
  },
  {
    id: 'first-workout',
    title: 'First Sweat',
    description: 'Log your first workout',
    icon: '💪',
    earned: false,
    category: 'activity',
    requirement: 1,
    progress: 0
  },
  {
    id: 'level-5',
    title: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    earned: false,
    category: 'special',
    requirement: 5,
    progress: 0
  },

  // Streak Achievements (15 new)
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    earned: false,
    category: 'streak',
    requirement: 7,
    progress: 0
  },
  {
    id: 'streak-14',
    title: 'Fortnight Fighter',
    description: 'Maintain a 14-day streak',
    icon: '🔥',
    earned: false,
    category: 'streak',
    requirement: 14,
    progress: 0
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '🔥',
    earned: false,
    category: 'streak',
    requirement: 30,
    progress: 0
  },
  {
    id: 'streak-50',
    title: 'Consistency King',
    description: 'Maintain a 50-day streak',
    icon: '👑',
    earned: false,
    category: 'streak',
    requirement: 50,
    progress: 0
  },
  {
    id: 'streak-100',
    title: 'Century Streak',
    description: 'Maintain a 100-day streak',
    icon: '💯',
    earned: false,
    category: 'streak',
    requirement: 100,
    progress: 0
  },
  {
    id: 'streak-365',
    title: 'Year-Long Legend',
    description: 'Maintain a 365-day streak',
    icon: '🏆',
    earned: false,
    category: 'streak',
    requirement: 365,
    progress: 0
  },
  {
    id: 'streak-comeback',
    title: 'Comeback Kid',
    description: 'Start a new streak after losing one',
    icon: '🔄',
    earned: false,
    category: 'streak',
    requirement: 3,
    progress: 0
  },
  {
    id: 'streak-weekend',
    title: 'Weekend Warrior',
    description: 'Log meals on 10 weekends',
    icon: '🎯',
    earned: false,
    category: 'streak',
    requirement: 10,
    progress: 0
  },
  {
    id: 'streak-perfect-week',
    title: 'Perfect Week',
    description: 'Log meals every day for a week',
    icon: '✨',
    earned: false,
    category: 'streak',
    requirement: 7,
    progress: 0
  },
  {
    id: 'streak-early-bird',
    title: 'Early Bird',
    description: 'Log breakfast 10 days in a row',
    icon: '🌅',
    earned: false,
    category: 'streak',
    requirement: 10,
    progress: 0
  },
  {
    id: 'streak-night-owl',
    title: 'Night Owl',
    description: 'Log dinner 15 days in a row',
    icon: '🦉',
    earned: false,
    category: 'streak',
    requirement: 15,
    progress: 0
  },
  {
    id: 'streak-dedication',
    title: 'Dedication',
    description: 'Never miss more than 1 day in 30 days',
    icon: '🎖️',
    earned: false,
    category: 'streak',
    requirement: 29,
    progress: 0
  },
  {
    id: 'streak-unstoppable',
    title: 'Unstoppable Force',
    description: 'Maintain a 200-day streak',
    icon: '⚡',
    earned: false,
    category: 'streak',
    requirement: 200,
    progress: 0
  },
  {
    id: 'streak-phoenix',
    title: 'Phoenix Rising',
    description: 'Rebuild a 30-day streak after breaking one',
    icon: '🔥',
    earned: false,
    category: 'streak',
    requirement: 30,
    progress: 0
  },
  {
    id: 'streak-marathon',
    title: 'Marathon Mindset',
    description: 'Maintain a 500-day streak',
    icon: '🏃',
    earned: false,
    category: 'streak',
    requirement: 500,
    progress: 0
  },

  // Weight Loss Achievements (20 new)
  {
    id: 'weight-loss-5',
    title: 'High Five',
    description: 'Lose 5 pounds',
    icon: '🙌',
    earned: false,
    category: 'weight',
    requirement: 5,
    progress: 0
  },
  {
    id: 'weight-loss-10',
    title: 'Perfect Ten',
    description: 'Lose 10 pounds',
    icon: '🔟',
    earned: false,
    category: 'weight',
    requirement: 10,
    progress: 0
  },
  {
    id: 'weight-loss-15',
    title: 'Fifteen & Fabulous',
    description: 'Lose 15 pounds',
    icon: '✨',
    earned: false,
    category: 'weight',
    requirement: 15,
    progress: 0
  },
  {
    id: 'weight-loss-20',
    title: 'Twenty & Thriving',
    description: 'Lose 20 pounds',
    icon: '🎉',
    earned: false,
    category: 'weight',
    requirement: 20,
    progress: 0
  },
  {
    id: 'weight-loss-25',
    title: 'Quarter Century',
    description: 'Lose 25 pounds',
    icon: '🏅',
    earned: false,
    category: 'weight',
    requirement: 25,
    progress: 0
  },
  {
    id: 'weight-loss-30',
    title: 'Thirty & Triumphant',
    description: 'Lose 30 pounds',
    icon: '👑',
    earned: false,
    category: 'weight',
    requirement: 30,
    progress: 0
  },
  {
    id: 'weight-loss-50',
    title: 'Half Century Hero',
    description: 'Lose 50 pounds',
    icon: '🦸',
    earned: false,
    category: 'weight',
    requirement: 50,
    progress: 0
  },
  {
    id: 'weight-loss-75',
    title: 'Magnificent Transformation',
    description: 'Lose 75 pounds',
    icon: '🌟',
    earned: false,
    category: 'weight',
    requirement: 75,
    progress: 0
  },
  {
    id: 'weight-loss-100',
    title: 'Century Champion',
    description: 'Lose 100 pounds',
    icon: '🏆',
    earned: false,
    category: 'weight',
    requirement: 100,
    progress: 0
  },
  {
    id: 'weight-goal-25',
    title: 'Quarter Way There',
    description: 'Reach 25% of your weight goal',
    icon: '🎯',
    earned: false,
    category: 'weight',
    requirement: 25,
    progress: 0
  },
  {
    id: 'weight-goal-50',
    title: 'Halfway Hero',
    description: 'Reach 50% of your weight goal',
    icon: '⚡',
    earned: false,
    category: 'weight',
    requirement: 50,
    progress: 0
  },
  {
    id: 'weight-goal-75',
    title: 'Three Quarters Strong',
    description: 'Reach 75% of your weight goal',
    icon: '💪',
    earned: false,
    category: 'weight',
    requirement: 75,
    progress: 0
  },
  {
    id: 'weight-goal-100',
    title: 'Goal Crusher',
    description: 'Reach your weight goal',
    icon: '🎊',
    earned: false,
    category: 'weight',
    requirement: 100,
    progress: 0
  },
  {
    id: 'weight-steady',
    title: 'Steady Progress',
    description: 'Lose weight 5 weeks in a row',
    icon: '📈',
    earned: false,
    category: 'weight',
    requirement: 5,
    progress: 0
  },
  {
    id: 'weight-consistent',
    title: 'Consistent Loser',
    description: 'Lose weight 10 weeks in a row',
    icon: '📊',
    earned: false,
    category: 'weight',
    requirement: 10,
    progress: 0
  },
  {
    id: 'weight-maintenance',
    title: 'Maintenance Master',
    description: 'Maintain goal weight for 30 days',
    icon: '⚖️',
    earned: false,
    category: 'weight',
    requirement: 30,
    progress: 0
  },
  {
    id: 'weight-plateau-breaker',
    title: 'Plateau Breaker',
    description: 'Break through a weight plateau',
    icon: '🔨',
    earned: false,
    category: 'weight',
    requirement: 1,
    progress: 0
  },
  {
    id: 'weight-new-low',
    title: 'New Low',
    description: 'Reach a new lowest weight',
    icon: '📉',
    earned: false,
    category: 'weight',
    requirement: 1,
    progress: 0
  },
  {
    id: 'weight-bmi-normal',
    title: 'BMI Champion',
    description: 'Reach normal BMI range',
    icon: '🎯',
    earned: false,
    category: 'weight',
    requirement: 1,
    progress: 0
  },
  {
    id: 'weight-transformation',
    title: 'Total Transformation',
    description: 'Lose 150+ pounds',
    icon: '🦋',
    earned: false,
    category: 'weight',
    requirement: 150,
    progress: 0
  },

  // Calorie Achievements (15 new)
  {
    id: 'calories-5k',
    title: 'Calorie Tracker',
    description: 'Log 5,000 calories total',
    icon: '📊',
    earned: false,
    category: 'calories',
    requirement: 5000,
    progress: 0
  },
  {
    id: 'calories-10k',
    title: 'Ten Thousand Club',
    description: 'Log 10,000 calories total',
    icon: '🔢',
    earned: false,
    category: 'calories',
    requirement: 10000,
    progress: 0
  },
  {
    id: 'calories-25k',
    title: 'Quarter Million',
    description: 'Log 25,000 calories total',
    icon: '📈',
    earned: false,
    category: 'calories',
    requirement: 25000,
    progress: 0
  },
  {
    id: 'calories-50k',
    title: 'Half Century Tracker',
    description: 'Log 50,000 calories total',
    icon: '💯',
    earned: false,
    category: 'calories',
    requirement: 50000,
    progress: 0
  },
  {
    id: 'calories-100k',
    title: 'Calorie Master',
    description: 'Log 100,000 calories total',
    icon: '🏆',
    earned: false,
    category: 'calories',
    requirement: 100000,
    progress: 0
  },
  {
    id: 'calories-deficit-week',
    title: 'Weekly Deficit',
    description: 'Maintain calorie deficit for 7 days',
    icon: '📉',
    earned: false,
    category: 'calories',
    requirement: 7,
    progress: 0
  },
  {
    id: 'calories-deficit-month',
    title: 'Monthly Deficit Master',
    description: 'Maintain calorie deficit for 30 days',
    icon: '📊',
    earned: false,
    category: 'calories',
    requirement: 30,
    progress: 0
  },
  {
    id: 'calories-perfect-day',
    title: 'Perfect Day',
    description: 'Hit calorie goal exactly',
    icon: '🎯',
    earned: false,
    category: 'calories',
    requirement: 1,
    progress: 0
  },
  {
    id: 'calories-under-budget',
    title: 'Under Budget',
    description: 'Stay under calorie goal 10 days',
    icon: '💰',
    earned: false,
    category: 'calories',
    requirement: 10,
    progress: 0
  },
  {
    id: 'calories-mindful',
    title: 'Mindful Eater',
    description: 'Log calories within 1 hour of eating 20 times',
    icon: '🧠',
    earned: false,
    category: 'calories',
    requirement: 20,
    progress: 0
  },
  {
    id: 'calories-low-day',
    title: 'Light Day',
    description: 'Have a day under 1200 calories',
    icon: '🪶',
    earned: false,
    category: 'calories',
    requirement: 1,
    progress: 0
  },
  {
    id: 'calories-balanced',
    title: 'Balanced Approach',
    description: 'Stay within 100 calories of goal 15 days',
    icon: '⚖️',
    earned: false,
    category: 'calories',
    requirement: 15,
    progress: 0
  },
  {
    id: 'calories-precision',
    title: 'Precision Tracker',
    description: 'Log exact calories (no estimates) 25 times',
    icon: '🔍',
    earned: false,
    category: 'calories',
    requirement: 25,
    progress: 0
  },
  {
    id: 'calories-weekend-warrior',
    title: 'Weekend Control',
    description: 'Stay under calorie goal 10 weekends',
    icon: '🎯',
    earned: false,
    category: 'calories',
    requirement: 10,
    progress: 0
  },
  {
    id: 'calories-macro-master',
    title: 'Macro Master',
    description: 'Hit all macro targets in one day',
    icon: '🎪',
    earned: false,
    category: 'calories',
    requirement: 1,
    progress: 0
  },

  // Meal Achievements (15 new)
  {
    id: 'meals-10',
    title: 'Meal Tracker',
    description: 'Log 10 meals',
    icon: '🍽️',
    earned: false,
    category: 'meals',
    requirement: 10,
    progress: 0
  },
  {
    id: 'meals-50',
    title: 'Fifty Feast',
    description: 'Log 50 meals',
    icon: '🍴',
    earned: false,
    category: 'meals',
    requirement: 50,
    progress: 0
  },
  {
    id: 'meals-100',
    title: 'Century Eater',
    description: 'Log 100 meals',
    icon: '💯',
    earned: false,
    category: 'meals',
    requirement: 100,
    progress: 0
  },
  {
    id: 'meals-250',
    title: 'Meal Master',
    description: 'Log 250 meals',
    icon: '🏆',
    earned: false,
    category: 'meals',
    requirement: 250,
    progress: 0
  },
  {
    id: 'meals-500',
    title: 'Meal Legend',
    description: 'Log 500 meals',
    icon: '👑',
    earned: false,
    category: 'meals',
    requirement: 500,
    progress: 0
  },
  {
    id: 'meals-breakfast-lover',
    title: 'Breakfast Lover',
    description: 'Log 30 breakfasts',
    icon: '🥞',
    earned: false,
    category: 'meals',
    requirement: 30,
    progress: 0
  },
  {
    id: 'meals-lunch-champion',
    title: 'Lunch Champion',
    description: 'Log 30 lunches',
    icon: '🥗',
    earned: false,
    category: 'meals',
    requirement: 30,
    progress: 0
  },
  {
    id: 'meals-dinner-devotee',
    title: 'Dinner Devotee',
    description: 'Log 30 dinners',
    icon: '🍽️',
    earned: false,
    category: 'meals',
    requirement: 30,
    progress: 0
  },
  {
    id: 'meals-snack-smart',
    title: 'Smart Snacker',
    description: 'Log 50 healthy snacks',
    icon: '🥜',
    earned: false,
    category: 'meals',
    requirement: 50,
    progress: 0
  },
  {
    id: 'meals-variety',
    title: 'Variety Seeker',
    description: 'Log 20 different meal types',
    icon: '🌈',
    earned: false,
    category: 'meals',
    requirement: 20,
    progress: 0
  },
  {
    id: 'meals-healthy-week',
    title: 'Healthy Week',
    description: 'Log only healthy meals for 7 days',
    icon: '🥬',
    earned: false,
    category: 'meals',
    requirement: 7,
    progress: 0
  },
  {
    id: 'meals-protein-power',
    title: 'Protein Power',
    description: 'Log 25 high-protein meals',
    icon: '🥩',
    earned: false,
    category: 'meals',
    requirement: 25,
    progress: 0
  },
  {
    id: 'meals-veggie-lover',
    title: 'Veggie Lover',
    description: 'Log 30 vegetable-rich meals',
    icon: '🥕',
    earned: false,
    category: 'meals',
    requirement: 30,
    progress: 0
  },
  {
    id: 'meals-portion-control',
    title: 'Portion Master',
    description: 'Log appropriate portions 20 times',
    icon: '⚖️',
    earned: false,
    category: 'meals',
    requirement: 20,
    progress: 0
  },
  {
    id: 'meals-home-cook',
    title: 'Home Cook Hero',
    description: 'Log 40 home-cooked meals',
    icon: '👨‍🍳',
    earned: false,
    category: 'meals',
    requirement: 40,
    progress: 0
  },

  // Activity Achievements (15 new)
  {
    id: 'activity-10',
    title: 'Active Starter',
    description: 'Log 10 activities',
    icon: '🏃',
    earned: false,
    category: 'activity',
    requirement: 10,
    progress: 0
  },
  {
    id: 'activity-25',
    title: 'Quarter Century Active',
    description: 'Log 25 activities',
    icon: '🏋️',
    earned: false,
    category: 'activity',
    requirement: 25,
    progress: 0
  },
  {
    id: 'activity-50',
    title: 'Half Century Mover',
    description: 'Log 50 activities',
    icon: '🚴',
    earned: false,
    category: 'activity',
    requirement: 50,
    progress: 0
  },
  {
    id: 'activity-100',
    title: 'Century Athlete',
    description: 'Log 100 activities',
    icon: '🏆',
    earned: false,
    category: 'activity',
    requirement: 100,
    progress: 0
  },
  {
    id: 'activity-cardio-king',
    title: 'Cardio King',
    description: 'Complete 20 cardio sessions',
    icon: '❤️',
    earned: false,
    category: 'activity',
    requirement: 20,
    progress: 0
  },
  {
    id: 'activity-strength-warrior',
    title: 'Strength Warrior',
    description: 'Complete 15 strength sessions',
    icon: '💪',
    earned: false,
    category: 'activity',
    requirement: 15,
    progress: 0
  },
  {
    id: 'activity-endurance',
    title: 'Endurance Expert',
    description: 'Exercise for 60+ minutes in one session',
    icon: '⏱️',
    earned: false,
    category: 'activity',
    requirement: 1,
    progress: 0
  },
  {
    id: 'activity-daily-mover',
    title: 'Daily Mover',
    description: 'Exercise 7 days in a row',
    icon: '📅',
    earned: false,
    category: 'activity',
    requirement: 7,
    progress: 0
  },
  {
    id: 'activity-calorie-burner',
    title: 'Calorie Burner',
    description: 'Burn 500+ calories in one session',
    icon: '🔥',
    earned: false,
    category: 'activity',
    requirement: 1,
    progress: 0
  },
  {
    id: 'activity-variety',
    title: 'Activity Explorer',
    description: 'Try 5 different activity types',
    icon: '🌟',
    earned: false,
    category: 'activity',
    requirement: 5,
    progress: 0
  },
  {
    id: 'activity-morning-warrior',
    title: 'Morning Warrior',
    description: 'Exercise before 8 AM, 10 times',
    icon: '🌅',
    earned: false,
    category: 'activity',
    requirement: 10,
    progress: 0
  },
  {
    id: 'activity-weekend-athlete',
    title: 'Weekend Athlete',
    description: 'Exercise on 15 weekends',
    icon: '🏃‍♀️',
    earned: false,
    category: 'activity',
    requirement: 15,
    progress: 0
  },
  {
    id: 'activity-intensity',
    title: 'High Intensity Hero',
    description: 'Complete 10 high-intensity workouts',
    icon: '⚡',
    earned: false,
    category: 'activity',
    requirement: 10,
    progress: 0
  },
  {
    id: 'activity-consistency',
    title: 'Consistent Mover',
    description: 'Exercise 4+ times per week for 4 weeks',
    icon: '📊',
    earned: false,
    category: 'activity',
    requirement: 16,
    progress: 0
  },
  {
    id: 'activity-marathon',
    title: 'Activity Marathon',
    description: 'Log 1000+ minutes of activity',
    icon: '🏃‍♂️',
    earned: false,
    category: 'activity',
    requirement: 1000,
    progress: 0
  },

  // Special Achievements (13 new)
  {
    id: 'level-10',
    title: 'Double Digits',
    description: 'Reach level 10',
    icon: '🔟',
    earned: false,
    category: 'special',
    requirement: 10,
    progress: 0
  },
  {
    id: 'level-25',
    title: 'Quarter Century Level',
    description: 'Reach level 25',
    icon: '🎖️',
    earned: false,
    category: 'special',
    requirement: 25,
    progress: 0
  },
  {
    id: 'level-50',
    title: 'Half Century Hero',
    description: 'Reach level 50',
    icon: '🏅',
    earned: false,
    category: 'special',
    requirement: 50,
    progress: 0
  },
  {
    id: 'level-100',
    title: 'Century Legend',
    description: 'Reach level 100',
    icon: '👑',
    earned: false,
    category: 'special',
    requirement: 100,
    progress: 0
  },
  {
    id: 'coins-100',
    title: 'Coin Collector',
    description: 'Earn 100 coins',
    icon: '🪙',
    earned: false,
    category: 'special',
    requirement: 100,
    progress: 0
  },
  {
    id: 'coins-500',
    title: 'Coin Master',
    description: 'Earn 500 coins',
    icon: '💰',
    earned: false,
    category: 'special',
    requirement: 500,
    progress: 0
  },
  {
    id: 'coins-1000',
    title: 'Coin Millionaire',
    description: 'Earn 1000 coins',
    icon: '💎',
    earned: false,
    category: 'special',
    requirement: 1000,
    progress: 0
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete all daily goals in one day',
    icon: '✨',
    earned: false,
    category: 'special',
    requirement: 1,
    progress: 0
  },
  {
    id: 'early-adopter',
    title: 'Early Adopter',
    description: 'Use the app for 7 consecutive days',
    icon: '🚀',
    earned: false,
    category: 'special',
    requirement: 7,
    progress: 0
  },
  {
    id: 'night-owl-logger',
    title: 'Night Owl Logger',
    description: 'Log meals after 10 PM, 5 times',
    icon: '🦉',
    earned: false,
    category: 'special',
    requirement: 5,
    progress: 0
  },
  {
    id: 'social-butterfly',
    title: 'Social Butterfly',
    description: 'Share your progress 10 times',
    icon: '🦋',
    earned: false,
    category: 'special',
    requirement: 10,
    progress: 0
  },
  {
    id: 'data-driven',
    title: 'Data Driven',
    description: 'Check your stats 50 times',
    icon: '📊',
    earned: false,
    category: 'special',
    requirement: 50,
    progress: 0
  },
  {
    id: 'theme-collector',
    title: 'Theme Collector',
    description: 'Purchase 3 different themes',
    icon: '🎨',
    earned: false,
    category: 'special',
    requirement: 3,
    progress: 0
  }
]