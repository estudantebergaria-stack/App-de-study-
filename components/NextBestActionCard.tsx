import React from 'react';
import { Target, Clock, Zap } from 'lucide-react';
import { DailyMission } from '../utils';

interface NextBestActionCardProps {
  missions: DailyMission[];
  onStartSession: (subject: string, minutes: number) => void;
  theme?: 'dark' | 'light';
  t: any;
}

const NextBestActionCard: React.FC<NextBestActionCardProps> = ({ 
  missions, 
  onStartSession, 
  theme = 'dark',
  t 
}) => {
  const isLight = theme === 'light';
  
  if (missions.length === 0) {
    return (
      <div className={`p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 border ${
        isLight ? 'bg-white border-zinc-200' : 'glass-panel bg-gradient-to-br from-emerald-600/5 to-transparent'
      }`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl">
            <Target className="text-emerald-500" size={24} />
          </div>
          <h2 className={`text-xl font-bold ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
            Próximas Ações
          </h2>
        </div>
        <p className={`${isLight ? 'text-zinc-600' : 'text-zinc-400'} text-center py-8`}>
          Parabéns! Você está em dia com seus estudos. Continue assim! 🎉
        </p>
      </div>
    );
  }

  const primaryMission = missions[0];

  return (
    <div className={`p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 border ${
      isLight ? 'bg-white border-zinc-200' : 'glass-panel bg-gradient-to-br from-indigo-600/10 to-transparent'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-2xl ${
          isLight ? 'bg-indigo-100' : 'bg-indigo-500/10'
        }`}>
          <Target className="text-indigo-500" size={24} />
        </div>
        <h2 className={`text-xl font-bold ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
          Próxima Melhor Ação
        </h2>
      </div>

      {/* Primary Mission */}
      <div className={`p-6 rounded-2xl mb-4 ${
        isLight ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200' : 'bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20'
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={`text-lg font-bold mb-1 ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
              {primaryMission.title}
            </h3>
            <p className={`text-sm ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {primaryMission.description}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            isLight ? 'bg-amber-100 text-amber-700' : 'bg-amber-500/10 text-amber-500'
          }`}>
            +{primaryMission.xpReward} XP
          </div>
        </div>
        
        <button
          onClick={() => onStartSession(primaryMission.subject, primaryMission.targetMinutes)}
          className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            isLight 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95' 
              : 'bg-indigo-500 text-white hover:bg-indigo-400 active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.3)]'
          }`}
        >
          <Zap size={18} />
          <span>Iniciar {primaryMission.targetMinutes} min agora</span>
        </button>
      </div>

      {/* Additional Missions */}
      {missions.slice(1).map((mission, idx) => (
        <div 
          key={mission.id}
          className={`p-4 rounded-xl mb-2 transition-all duration-300 cursor-pointer ${
            isLight 
              ? 'bg-zinc-50 hover:bg-zinc-100 border border-zinc-200' 
              : 'bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-700/30'
          }`}
          onClick={() => onStartSession(mission.subject, mission.targetMinutes)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className={`text-sm font-bold ${isLight ? 'text-zinc-900' : 'text-zinc-200'}`}>
                {mission.title}
              </h4>
              <p className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                {mission.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold ${
                isLight ? 'text-amber-600' : 'text-amber-500'
              }`}>
                +{mission.xpReward} XP
              </span>
              <Clock size={16} className={isLight ? 'text-zinc-400' : 'text-zinc-500'} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NextBestActionCard;
