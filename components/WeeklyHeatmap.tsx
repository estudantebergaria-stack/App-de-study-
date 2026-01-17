import React from 'react';
import { Calendar } from 'lucide-react';

interface WeeklyHeatmapProps {
  weekData: number[]; // 7 elements (Mon-Sun), values in minutes
  dailyGoal?: number; // Daily goal in minutes
  theme?: 'dark' | 'light';
  t: any;
}

const WeeklyHeatmap: React.FC<WeeklyHeatmapProps> = ({ 
  weekData, 
  dailyGoal = 30,
  theme = 'dark',
  t 
}) => {
  const isLight = theme === 'light';
  const dayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  
  // Find max for color scaling
  const maxMinutes = Math.max(...weekData, dailyGoal);
  
  const getIntensityColor = (minutes: number) => {
    if (minutes === 0) {
      return isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-zinc-800/30 border-zinc-700/30';
    }
    
    const intensity = Math.min(1, minutes / maxMinutes);
    
    if (intensity >= 0.8) {
      return isLight ? 'bg-emerald-400 border-emerald-500' : 'bg-emerald-500 border-emerald-400';
    } else if (intensity >= 0.6) {
      return isLight ? 'bg-emerald-300 border-emerald-400' : 'bg-emerald-500/80 border-emerald-500/60';
    } else if (intensity >= 0.4) {
      return isLight ? 'bg-amber-300 border-amber-400' : 'bg-amber-500/80 border-amber-500/60';
    } else if (intensity >= 0.2) {
      return isLight ? 'bg-amber-200 border-amber-300' : 'bg-amber-500/60 border-amber-500/40';
    } else {
      return isLight ? 'bg-amber-100 border-amber-200' : 'bg-amber-500/40 border-amber-500/20';
    }
  };

  const formatMinutes = (minutes: number) => {
    if (minutes === 0) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0) return `${mins}m`;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className={`p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 border ${
      isLight ? 'bg-white border-zinc-200' : 'glass-panel bg-gradient-to-br from-cyan-600/5 to-transparent'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-2xl ${
          isLight ? 'bg-cyan-100' : 'bg-cyan-500/10'
        }`}>
          <Calendar className="text-cyan-500" size={24} />
        </div>
        <h2 className={`text-xl font-bold ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
          Heatmap Semanal
        </h2>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-7 gap-3">
        {weekData.map((minutes, idx) => {
          const meetsGoal = minutes >= dailyGoal;
          
          return (
            <div key={idx} className="flex flex-col items-center">
              {/* Day Label */}
              <div className={`text-xs font-bold mb-2 ${
                isLight ? 'text-zinc-600' : 'text-zinc-400'
              }`}>
                {dayLabels[idx]}
              </div>
              
              {/* Heat Cell */}
              <div className="relative group">
                <div 
                  className={`w-14 h-14 rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                    getIntensityColor(minutes)
                  } ${meetsGoal ? `ring-2 ring-emerald-500 ring-offset-2 ${isLight ? 'ring-offset-white' : 'ring-offset-zinc-900'}` : ''}`}
                >
                  <span className={`text-xs font-bold ${
                    minutes === 0 
                      ? isLight ? 'text-zinc-400' : 'text-zinc-600'
                      : isLight ? 'text-zinc-900' : 'text-white'
                  }`}>
                    {Math.round(minutes)}
                  </span>
                </div>
                
                {/* Tooltip */}
                <div className={`absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                  isLight ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'
                }`}>
                  {formatMinutes(minutes)}
                  {meetsGoal && ' ✓'}
                </div>
              </div>
              
              {/* Goal Indicator */}
              {dailyGoal > 0 && (
                <div className={`mt-2 h-1 w-14 rounded-full ${
                  isLight ? 'bg-zinc-200' : 'bg-zinc-700'
                }`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      meetsGoal ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, (minutes / dailyGoal) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className={`mt-6 pt-6 border-t ${isLight ? 'border-zinc-200' : 'border-zinc-700/30'}`}>
        <div className="flex items-center justify-between text-xs">
          <div className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>
            Meta diária: <span className="font-bold">{dailyGoal} min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>Menos</span>
            <div className="flex gap-1">
              <div className={`w-4 h-4 rounded ${isLight ? 'bg-zinc-100' : 'bg-zinc-800/30'}`} />
              <div className={`w-4 h-4 rounded ${isLight ? 'bg-amber-200' : 'bg-amber-500/40'}`} />
              <div className={`w-4 h-4 rounded ${isLight ? 'bg-amber-300' : 'bg-amber-500/80'}`} />
              <div className={`w-4 h-4 rounded ${isLight ? 'bg-emerald-300' : 'bg-emerald-500/80'}`} />
              <div className={`w-4 h-4 rounded ${isLight ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
            </div>
            <span className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>Mais</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyHeatmap;
