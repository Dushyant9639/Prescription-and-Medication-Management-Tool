import { useMemo } from 'react';
import { useStore } from '../store';
import { Award, Trophy, Star, Flame, Target, Heart, Zap, Medal, Crown } from 'lucide-react';

const BADGES = [
  {
    id: 'first_dose',
    name: 'Getting Started',
    description: 'Take your first dose',
    icon: Star,
    color: 'blue',
    requirement: (stats) => stats.takenDoses >= 1,
  },
  {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Maintain a 3-day streak',
    icon: Flame,
    color: 'orange',
    requirement: (stats) => stats.currentStreak >= 3,
  },
  {
    id: 'streak_7',
    name: '7-Day Streak',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    color: 'red',
    requirement: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'streak_30',
    name: '30-Day Streak',
    description: 'Maintain a 30-day streak',
    icon: Crown,
    color: 'yellow',
    requirement: (stats) => stats.currentStreak >= 30,
  },
  {
    id: 'adherence_80',
    name: 'Consistency Champion',
    description: 'Achieve 80% adherence',
    icon: Target,
    color: 'green',
    requirement: (stats) => stats.adherenceRate >= 80 && stats.totalDoses >= 10,
  },
  {
    id: 'adherence_95',
    name: 'Perfect Form',
    description: 'Achieve 95% adherence',
    icon: Trophy,
    color: 'purple',
    requirement: (stats) => stats.adherenceRate >= 95 && stats.totalDoses >= 20,
  },
  {
    id: 'adherence_100',
    name: 'Flawless',
    description: 'Achieve 100% adherence',
    icon: Medal,
    color: 'pink',
    requirement: (stats) => stats.adherenceRate === 100 && stats.totalDoses >= 30,
  },
  {
    id: 'doses_10',
    name: 'Committed',
    description: 'Take 10 doses',
    icon: Heart,
    color: 'red',
    requirement: (stats) => stats.takenDoses >= 10,
  },
  {
    id: 'doses_50',
    name: 'Dedicated',
    description: 'Take 50 doses',
    icon: Zap,
    color: 'yellow',
    requirement: (stats) => stats.takenDoses >= 50,
  },
  {
    id: 'doses_100',
    name: 'Health Hero',
    description: 'Take 100 doses',
    icon: Award,
    color: 'indigo',
    requirement: (stats) => stats.takenDoses >= 100,
  },
];

const BADGE_COLORS = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    border: 'border-blue-300 dark:border-blue-700',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-900 dark:text-blue-100',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    border: 'border-green-300 dark:border-green-700',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-900 dark:text-green-100',
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    border: 'border-red-300 dark:border-red-700',
    icon: 'text-red-600 dark:text-red-400',
    text: 'text-red-900 dark:text-red-100',
  },
  orange: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    border: 'border-orange-300 dark:border-orange-700',
    icon: 'text-orange-600 dark:text-orange-400',
    text: 'text-orange-900 dark:text-orange-100',
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    border: 'border-yellow-300 dark:border-yellow-700',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-900 dark:text-yellow-100',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    border: 'border-purple-300 dark:border-purple-700',
    icon: 'text-purple-600 dark:text-purple-400',
    text: 'text-purple-900 dark:text-purple-100',
  },
  pink: {
    bg: 'bg-pink-100 dark:bg-pink-900/30',
    border: 'border-pink-300 dark:border-pink-700',
    icon: 'text-pink-600 dark:text-pink-400',
    text: 'text-pink-900 dark:text-pink-100',
  },
  indigo: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    border: 'border-indigo-300 dark:border-indigo-700',
    icon: 'text-indigo-600 dark:text-indigo-400',
    text: 'text-indigo-900 dark:text-indigo-100',
  },
  cyan: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    border: 'border-cyan-300 dark:border-cyan-700',
    icon: 'text-cyan-600 dark:text-cyan-400',
    text: 'text-cyan-900 dark:text-cyan-100',
  },
};

const GamificationBadges = () => {
  const reminders = useStore((state) => state.reminders);
  const medications = useStore((state) => state.medications);
  const getAdherenceStats = useStore((state) => state.getAdherenceStats);

  const stats = useMemo(() => {
    const baseStats = getAdherenceStats();
    const validMedicationIds = new Set(medications.map(m => m.id));
    
    // Calculate current streak (consecutive taken reminders)
    const sortedReminders = [...reminders]
      .filter(r => r.status !== 'pending' && validMedicationIds.has(r.medicationId))
      .sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime));
    
    let currentStreak = 0;
    for (const reminder of sortedReminders) {
      if (reminder.status === 'taken') {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return {
      ...baseStats,
      currentStreak,
      perfectWeeks: 0,
    };
  }, [reminders, medications, getAdherenceStats]);

  const earnedBadges = useMemo(() => {
    return BADGES.filter(badge => badge.requirement(stats));
  }, [stats]);

  const progress = Math.round((earnedBadges.length / BADGES.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Your Progress</h2>
            <p className="text-purple-100">
              {earnedBadges.length} of {BADGES.length} badges earned
            </p>
          </div>
          <div className="text-4xl font-bold">{progress}%</div>
        </div>
        <div className="w-full bg-purple-700/50 rounded-full h-4">
          <div
            className="bg-white rounded-full h-4 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-center mb-2">
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {stats.currentStreak}
          </p>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Current Streak
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-center mb-2">
            <Target className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {stats.adherenceRate}%
          </p>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Adherence Rate
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-center mb-2">
            <Heart className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {stats.takenDoses}
          </p>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Doses Taken
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-center mb-2">
            <Award className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            {earnedBadges.length}
          </p>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Badges Earned
          </p>
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Badges
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {BADGES.map((badge) => {
            const Icon = badge.icon;
            const colors = BADGE_COLORS[badge.color];
            const isEarned = earnedBadges.some(b => b.id === badge.id);

            return (
              <div
                key={badge.id}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300
                  ${isEarned
                    ? `${colors.bg} ${colors.border} hover:scale-105 shadow-lg`
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-50'
                  }
                `}
              >
                {isEarned && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center">
                  <div className={`mb-3 ${isEarned ? 'animate-pulse-slow' : ''}`}>
                    <Icon 
                      className={`w-12 h-12 ${isEarned ? colors.icon : 'text-gray-400 dark:text-gray-600'}`}
                    />
                  </div>
                  <h3 className={`font-semibold text-sm mb-1 ${isEarned ? colors.text : 'text-gray-600 dark:text-gray-400'}`}>
                    {badge.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GamificationBadges;
