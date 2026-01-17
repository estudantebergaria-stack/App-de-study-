import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import { getLevelInfo } from '../utils';

interface XPProgressCardProps {
  totalXP: number;
  theme?: 'dark' | 'light';
  t: any;
}

const XPProgressCard: React.FC<XPProgressCardProps> = ({ totalXP = 0, theme = 'dark', t }) => {
  const isLight = theme === 'light';
  const levelInfo = getLevelInfo(totalXP);
  
  // Calculate progress to next level
  const currentLevelXP = levelInfo.xpRequired;
  const nextLevelXP = currentLevelXP + levelInfo.xpForNext;
  const progressXP = totalXP - currentLevelXP;
  const progressPercent = (progressXP / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className={`p-6 rounded-[2rem] shadow-2xl transition-all duration-500 border ${
      isLight ? 'bg-white border-zinc-200' : 'glass-panel bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            isLight ? 'bg-violet-100' : 'bg-violet-500/10'
          }`}>
            <Zap className="text-violet-500" size={20} fill="currentColor" />
          </div>
          <div>
            <h3 className={`text-sm font-bold ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
              Nível {levelInfo.level}
            </h3>
            <p className={`text-xs font-bold ${
              isLight ? 'text-violet-600' : 'text-violet-400'
            }`}>
              {levelInfo.name}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-black ${
            isLight ? 'text-violet-600' : 'text-violet-400'
          }`}>
            {totalXP.toLocaleString()}
          </div>
          <div className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            XP Total
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>
            Progresso para Nível {levelInfo.level + 1}
          </span>
          <span className={`font-bold ${isLight ? 'text-violet-600' : 'text-violet-400'}`}>
            {Math.round(progressPercent)}%
          </span>
        </div>
        
        <div className={`h-3 rounded-full overflow-hidden ${
          isLight ? 'bg-zinc-200' : 'bg-zinc-700'
        }`}>
          <div 
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 relative overflow-hidden"
            style={{ width: `${Math.min(100, progressPercent)}%` }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" />
          </div>
        </div>
        
        <div className="flex justify-between text-xs font-bold">
          <span className={isLight ? 'text-zinc-500' : 'text-zinc-500'}>
            {progressXP.toLocaleString()} XP
          </span>
          <span className={isLight ? 'text-zinc-500' : 'text-zinc-500'}>
            {levelInfo.xpForNext.toLocaleString()} XP restantes
          </span>
        </div>
      </div>
    </div>
  );
};

export default XPProgressCard;
