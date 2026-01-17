import React from 'react';
import { Flame, Zap } from 'lucide-react';

interface StreakReminderCardProps {
  currentStreak: number;
  hasStudiedToday: boolean;
  onQuickStudy?: () => void;
  theme?: 'dark' | 'light';
  t: any;
}

const StreakReminderCard: React.FC<StreakReminderCardProps> = ({ 
  currentStreak,
  hasStudiedToday,
  onQuickStudy,
  theme = 'dark',
  t 
}) => {
  const isLight = theme === 'light';

  // Don't show if no streak or already studied today
  if (currentStreak === 0 || hasStudiedToday) {
    return null;
  }

  return (
    <div className={`p-6 rounded-[2rem] shadow-2xl transition-all duration-500 border animate-pulse ${
      isLight 
        ? 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200' 
        : 'bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${
          isLight ? 'bg-orange-200' : 'bg-orange-500/20'
        }`}>
          <Flame className="text-orange-500" size={28} fill="currentColor" />
        </div>
        
        <div className="flex-1">
          <h3 className={`text-lg font-bold mb-1 ${
            isLight ? 'text-orange-700' : 'text-orange-400'
          }`}>
            Proteja seu Streak de {currentStreak} dias!
          </h3>
          <p className={`text-sm ${
            isLight ? 'text-orange-600' : 'text-orange-300'
          }`}>
            Estude pelo menos 15 min hoje para manter sua sequência
          </p>
        </div>

        {onQuickStudy && (
          <button
            onClick={onQuickStudy}
            className={`px-5 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
              isLight 
                ? 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95' 
                : 'bg-orange-500 text-white hover:bg-orange-400 active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.3)]'
            }`}
          >
            <Zap size={16} />
            <span>15 min agora</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default StreakReminderCard;
