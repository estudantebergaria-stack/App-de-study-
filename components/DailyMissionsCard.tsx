import React from 'react';
import { Target, CheckCircle, Circle, Zap } from 'lucide-react';
import { DailyMission, isMissionCompleted } from '../utils';
import { StudyLog } from '../types';

interface DailyMissionsCardProps {
  missions: DailyMission[];
  logs: StudyLog[];
  onStartMission?: (mission: DailyMission) => void;
  theme?: 'dark' | 'light';
  t: any;
}

const DailyMissionsCard: React.FC<DailyMissionsCardProps> = ({ 
  missions, 
  logs,
  onStartMission,
  theme = 'dark',
  t 
}) => {
  const isLight = theme === 'light';
  
  const completedCount = missions.filter(m => isMissionCompleted(m, logs)).length;
  const totalCount = missions.length;

  return (
    <div className={`p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 border ${
      isLight ? 'bg-white border-zinc-200' : 'glass-panel bg-gradient-to-br from-amber-600/5 to-transparent'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${
            isLight ? 'bg-amber-100' : 'bg-amber-500/10'
          }`}>
            <Target className="text-amber-500" size={24} />
          </div>
          <div>
            <h2 className={`text-xl font-bold ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
              Missões Diárias
            </h2>
            <p className={`text-xs ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              {completedCount}/{totalCount} concluídas
            </p>
          </div>
        </div>

        {completedCount === totalCount && totalCount > 0 && (
          <div className={`px-4 py-2 rounded-full text-xs font-bold ${
            isLight ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-500/10 text-emerald-500'
          }`}>
            ✓ Completo!
          </div>
        )}
      </div>

      {missions.length === 0 ? (
        <div className={`text-center py-12 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
          <p>🎉 Todas as missões concluídas!</p>
          <p className="text-sm mt-2">Continue estudando para ganhar mais XP</p>
        </div>
      ) : (
        <div className="space-y-3">
          {missions.map((mission) => {
            const isCompleted = isMissionCompleted(mission, logs);
            
            return (
              <div 
                key={mission.id}
                className={`p-5 rounded-2xl border transition-all duration-300 ${
                  isCompleted
                    ? isLight 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-emerald-500/5 border-emerald-500/20'
                    : isLight
                    ? 'bg-zinc-50 border-zinc-200'
                    : 'bg-zinc-800/30 border-zinc-700/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Completion Icon */}
                  <div className="mt-1">
                    {isCompleted ? (
                      <CheckCircle 
                        size={20} 
                        className={isLight ? 'text-emerald-600' : 'text-emerald-500'} 
                      />
                    ) : (
                      <Circle 
                        size={20} 
                        className={isLight ? 'text-zinc-400' : 'text-zinc-600'} 
                      />
                    )}
                  </div>

                  {/* Mission Info */}
                  <div className="flex-1">
                    <h3 className={`font-bold mb-1 ${
                      isCompleted
                        ? isLight ? 'text-emerald-700 line-through' : 'text-emerald-400 line-through'
                        : isLight ? 'text-zinc-900' : 'text-zinc-100'
                    }`}>
                      {mission.title}
                    </h3>
                    <p className={`text-sm ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}>
                      {mission.description}
                    </p>
                    
                    {/* XP Reward */}
                    <div className="flex items-center gap-2 mt-2">
                      <Zap size={14} className="text-amber-500" fill="currentColor" />
                      <span className={`text-xs font-bold ${
                        isLight ? 'text-amber-600' : 'text-amber-500'
                      }`}>
                        +{mission.xpReward} XP
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {!isCompleted && onStartMission && (
                    <button
                      onClick={() => onStartMission(mission)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 whitespace-nowrap ${
                        isLight 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95' 
                          : 'bg-indigo-500 text-white hover:bg-indigo-400 active:scale-95'
                      }`}
                    >
                      Iniciar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Progress Summary */}
      {totalCount > 0 && (
        <div className={`mt-6 pt-6 border-t ${isLight ? 'border-zinc-200' : 'border-zinc-700/30'}`}>
          <div className={`h-2 rounded-full overflow-hidden ${
            isLight ? 'bg-zinc-200' : 'bg-zinc-700'
          }`}>
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyMissionsCard;
