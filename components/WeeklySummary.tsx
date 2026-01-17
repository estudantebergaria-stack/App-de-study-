import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { StudyLog } from '../types';
import { getWeekRange, getPreviousWeekRange, toLocalISO, calculateSubjectScore } from '../utils';

interface WeeklySummaryProps {
  subjects: string[];
  logs: StudyLog[];
  goals: Record<string, number>;
  theme?: 'dark' | 'light';
  t: any;
  onActionClick?: (subject: string, action: 'study' | 'review') => void;
}

interface WeeklyComparison {
  currentWeekMinutes: number;
  previousWeekMinutes: number;
  change: number;
  changePercent: number;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ 
  subjects, 
  logs, 
  goals,
  theme = 'dark',
  t,
  onActionClick 
}) => {
  const isLight = theme === 'light';

  // Calculate week-over-week comparison
  const weekComparison = React.useMemo((): WeeklyComparison => {
    const { start: currentStart, end: currentEnd } = getWeekRange();
    const { start: prevStart, end: prevEnd } = getPreviousWeekRange();

    const currentWeekLogs = logs.filter(l => {
      const logDate = toLocalISO(new Date(l.date));
      return logDate >= currentStart && logDate <= currentEnd;
    });

    const previousWeekLogs = logs.filter(l => {
      const logDate = toLocalISO(new Date(l.date));
      return logDate >= prevStart && logDate <= prevEnd;
    });

    const currentWeekMinutes = currentWeekLogs.reduce((acc, l) => acc + l.duration, 0) / 60;
    const previousWeekMinutes = previousWeekLogs.reduce((acc, l) => acc + l.duration, 0) / 60;
    const change = currentWeekMinutes - previousWeekMinutes;
    const changePercent = previousWeekMinutes > 0 ? (change / previousWeekMinutes) * 100 : 0;

    return {
      currentWeekMinutes: Math.round(currentWeekMinutes),
      previousWeekMinutes: Math.round(previousWeekMinutes),
      change: Math.round(change),
      changePercent: Math.round(changePercent)
    };
  }, [logs]);

  // Get subject scores and generate insights
  const subjectScores = React.useMemo(() => {
    return subjects.map(subject => calculateSubjectScore(subject, logs, goals));
  }, [subjects, logs, goals]);

  // Generate top 3 recommendations
  const recommendations = React.useMemo(() => {
    const recs: Array<{
      type: 'positive' | 'warning' | 'critical';
      subject: string;
      message: string;
      action: 'study' | 'review';
      actionLabel: string;
    }> = [];

    // Find subjects needing attention
    const needsReview = subjectScores.filter(s => s.review < 60).sort((a, b) => a.review - b.review);
    const needsStudy = subjectScores.filter(s => s.focus < 60 && s.goalMinutes > 0).sort((a, b) => a.focus - b.focus);
    const doingWell = subjectScores.filter(s => s.overall >= 80).sort((a, b) => b.overall - a.overall);

    // Critical: subjects not studied in a while
    if (needsReview.length > 0 && needsReview[0].daysSinceLastStudy > 7) {
      recs.push({
        type: 'critical',
        subject: needsReview[0].subject,
        message: `${needsReview[0].subject} sem revisão há ${needsReview[0].daysSinceLastStudy} dias`,
        action: 'review',
        actionLabel: 'Revisar agora'
      });
    }

    // Warning: subjects below weekly goal
    if (needsStudy.length > 0) {
      const s = needsStudy[0];
      recs.push({
        type: 'warning',
        subject: s.subject,
        message: `${s.subject} abaixo da meta (${s.weeklyMinutes}/${s.goalMinutes} min)`,
        action: 'study',
        actionLabel: 'Estudar 25 min'
      });
    }

    // Positive: subjects doing well
    if (doingWell.length > 0) {
      recs.push({
        type: 'positive',
        subject: doingWell[0].subject,
        message: `Excelente progresso em ${doingWell[0].subject}!`,
        action: 'study',
        actionLabel: 'Continuar'
      });
    }

    return recs.slice(0, 3);
  }, [subjectScores]);

  const isImproving = weekComparison.change > 0;

  return (
    <div className={`p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 border ${
      isLight ? 'bg-white border-zinc-200' : 'glass-panel bg-gradient-to-br from-blue-600/5 to-transparent'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-2xl ${
          isLight ? 'bg-blue-100' : 'bg-blue-500/10'
        }`}>
          <TrendingUp className="text-blue-500" size={24} />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
            Resumo Semanal
          </h2>
          <p className={`text-xs ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Esta semana vs semana passada
          </p>
        </div>
      </div>

      {/* Week Comparison */}
      <div className={`p-5 rounded-2xl mb-6 border ${
        isImproving
          ? isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/5 border-emerald-500/20'
          : isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/5 border-amber-500/20'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className={`text-3xl font-black ${
              isImproving 
                ? isLight ? 'text-emerald-600' : 'text-emerald-500'
                : isLight ? 'text-amber-600' : 'text-amber-500'
            }`}>
              {weekComparison.currentWeekMinutes} min
            </div>
            <div className={`text-xs ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              esta semana
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isImproving ? (
              <TrendingUp className={isLight ? 'text-emerald-600' : 'text-emerald-500'} size={24} />
            ) : (
              <TrendingDown className={isLight ? 'text-amber-600' : 'text-amber-500'} size={24} />
            )}
            <div className="text-right">
              <div className={`text-xl font-black ${
                isImproving 
                  ? isLight ? 'text-emerald-600' : 'text-emerald-500'
                  : isLight ? 'text-amber-600' : 'text-amber-500'
              }`}>
                {isImproving ? '+' : ''}{weekComparison.change} min
              </div>
              <div className={`text-xs ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                ({isImproving ? '+' : ''}{weekComparison.changePercent}%)
              </div>
            </div>
          </div>
        </div>
        
        <div className={`text-xs ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
          Semana passada: {weekComparison.previousWeekMinutes} min
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <h3 className={`text-sm font-bold mb-3 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
          Recomendações para você:
        </h3>
        
        {recommendations.map((rec, idx) => {
          const typeConfig = {
            positive: {
              icon: CheckCircle2,
              colorClass: isLight ? 'text-emerald-600' : 'text-emerald-500',
              bgClass: isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/5 border-emerald-500/20',
              buttonClass: isLight ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-400'
            },
            warning: {
              icon: AlertTriangle,
              colorClass: isLight ? 'text-amber-600' : 'text-amber-500',
              bgClass: isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/5 border-amber-500/20',
              buttonClass: isLight ? 'bg-amber-600 hover:bg-amber-700' : 'bg-amber-500 hover:bg-amber-400'
            },
            critical: {
              icon: AlertTriangle,
              colorClass: isLight ? 'text-red-600' : 'text-red-500',
              bgClass: isLight ? 'bg-red-50 border-red-200' : 'bg-red-500/5 border-red-500/20',
              buttonClass: isLight ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-400'
            }
          };

          const config = typeConfig[rec.type];
          const Icon = config.icon;

          return (
            <div 
              key={idx}
              className={`p-4 rounded-xl border transition-all duration-300 ${config.bgClass}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Icon className={config.colorClass} size={20} />
                  <p className={`text-sm ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
                    {rec.message}
                  </p>
                </div>
                
                {onActionClick && (
                  <button
                    onClick={() => onActionClick(rec.subject, rec.action)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-all duration-300 flex items-center gap-2 ${config.buttonClass}`}
                  >
                    {rec.actionLabel}
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {recommendations.length === 0 && (
          <div className={`text-center py-8 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            <p>🎉 Tudo em dia! Continue assim.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklySummary;
