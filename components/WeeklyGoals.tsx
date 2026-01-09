
import React from 'react';
import { Target } from 'lucide-react';
import { StudyLog } from '../types';
import { formatTimeShort, toLocalISO } from '../utils';

interface WeeklyGoalsProps {
  subjects: string[];
  logs: StudyLog[];
  goals: Record<string, number>;
  onSetGoal: (subject: string, hours: number) => void;
  theme?: 'dark' | 'light';
  t: any;
}

const WeeklyGoals: React.FC<WeeklyGoalsProps> = ({ subjects, logs, goals, onSetGoal, theme = 'dark', t }) => {
  const isLight = theme === 'light';

  const getStartOfWeek = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay(); // 0 Dom, 1 Seg, 2 Ter...
    // Diferença para chegar na última Segunda-feira
    // Se hoje for Domingo(0), volta 6 dias.
    // Se hoje for Segunda(1), volta 0 dias.
    // Se hoje for Terça(2), volta 1 dia...
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return toLocalISO(d);
  };

  const startOfWeek = getStartOfWeek();
  const logsThisWeek = logs.filter(l => toLocalISO(new Date(l.date)) >= startOfWeek);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
            <Target size={24} />
          </div>
          <h1 className={`text-3xl font-black ${isLight ? 'text-zinc-900' : 'text-white'}`}>{t.weeklyGoalsTitle}</h1>
        </div>
        <p className={isLight ? 'text-zinc-500 font-bold' : 'text-zinc-500 font-medium'}>{t.weeklyGoalsSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(sub => {
          const durSec = logsThisWeek.filter(l => l.subject === sub).reduce((a, c) => a + c.duration, 0);
          const durHours = durSec / 3600;
          const goal = goals[sub] || 0;
          const pct = goal > 0 ? Math.min((durHours / goal) * 100, 100) : 0;

          return (
            <div key={sub} className={`p-6 rounded-3xl relative overflow-hidden group border transition-all duration-500 shadow-lg ${
              isLight ? 'bg-white border-zinc-100 shadow-zinc-200/40' : 'glass-panel'
            }`}>
              <div className="flex justify-between items-center mb-6">
                <span className={`font-bold text-lg truncate pr-2 ${isLight ? 'text-zinc-800' : 'text-zinc-100'}`}>{sub}</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    step="0.5" 
                    min="0"
                    value={goal} 
                    onChange={(e) => onSetGoal(sub, parseFloat(e.target.value) || 0)} 
                    className={`w-20 border rounded-xl px-3 py-1.5 text-center text-sm font-bold text-indigo-500 outline-none focus:border-indigo-500 transition-colors ${
                      isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950/50 border-zinc-700'
                    }`}
                  />
                  <span className={`text-xs font-bold uppercase ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>hrs</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className={`flex justify-between text-xs font-bold mb-1 ${isLight ? 'text-zinc-400' : 'text-zinc-400'}`}>
                  <span>{t.summary}</span>
                  <span className={isLight ? 'text-zinc-600' : 'text-zinc-200'}>{pct.toFixed(0)}%</span>
                </div>
                <div className={`h-3 rounded-full overflow-hidden shadow-inner ${isLight ? 'bg-zinc-100' : 'bg-zinc-900'}`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${pct >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className={`flex justify-between text-[11px] font-bold tracking-tight pt-2 ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <span>{formatTimeShort(durSec)}</span>
                  <span>{t.goals}: {goal}h</span>
                </div>
              </div>
            </div>
          );
        })}
        {subjects.length === 0 && (
          <div className={`col-span-full text-center py-20 rounded-3xl border ${isLight ? 'bg-white border-zinc-100 text-zinc-400' : 'glass-panel text-zinc-600'}`}>
            {t.addSubjectsStats}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyGoals;
