import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { SubjectScore } from '../utils';

interface SubjectDiagnosticsProps {
  scores: SubjectScore[];
  theme?: 'dark' | 'light';
  t: any;
  onActionClick?: (subject: string, action: 'study' | 'review') => void;
}

const SubjectDiagnostics: React.FC<SubjectDiagnosticsProps> = ({ 
  scores, 
  theme = 'dark',
  t,
  onActionClick 
}) => {
  const isLight = theme === 'light';

  const getScoreColor = (score: number) => {
    if (score >= 80) return isLight ? 'text-emerald-600' : 'text-emerald-500';
    if (score >= 60) return isLight ? 'text-amber-600' : 'text-amber-500';
    return isLight ? 'text-red-600' : 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/10 border-amber-500/20';
    return isLight ? 'bg-red-50 border-red-200' : 'bg-red-500/10 border-red-500/20';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle size={20} />;
    if (score >= 60) return <AlertCircle size={20} />;
    return <TrendingDown size={20} />;
  };

  // Sort by overall score (lowest first - most needs attention)
  const sortedScores = [...scores].sort((a, b) => a.overall - b.overall);

  return (
    <div className={`p-8 rounded-[2.5rem] shadow-2xl transition-all duration-500 border ${
      isLight ? 'bg-white border-zinc-200' : 'glass-panel bg-gradient-to-br from-purple-600/5 to-transparent'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-2xl ${
          isLight ? 'bg-purple-100' : 'bg-purple-500/10'
        }`}>
          <TrendingUp className="text-purple-500" size={24} />
        </div>
        <h2 className={`text-xl font-bold ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
          Diagnóstico de Estudos
        </h2>
      </div>

      <div className="space-y-4">
        {sortedScores.map((score) => (
          <div 
            key={score.subject}
            className={`p-5 rounded-2xl border transition-all duration-300 ${
              getScoreBgColor(score.overall)
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={getScoreColor(score.overall)}>
                  {getScoreIcon(score.overall)}
                </div>
                <h3 className={`font-bold text-lg ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
                  {score.subject}
                </h3>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-black ${getScoreColor(score.overall)}`}>
                  {score.overall}
                </div>
                <div className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  /100
                </div>
              </div>
            </div>

            {/* Dimension Bars */}
            <div className="space-y-3 mb-4">
              {/* Focus */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className={`text-xs font-bold ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    Foco
                  </span>
                  <span className={`text-xs font-bold ${getScoreColor(score.focus)}`}>
                    {score.focus}%
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  isLight ? 'bg-zinc-200' : 'bg-zinc-700'
                }`}>
                  <div 
                    className={`h-full transition-all duration-500 ${
                      score.focus >= 80 ? 'bg-emerald-500' : 
                      score.focus >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score.focus}%` }}
                  />
                </div>
                <p className={`text-xs mt-1 ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
                  {score.weeklyMinutes}/{score.goalMinutes} min esta semana
                </p>
              </div>

              {/* Review */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className={`text-xs font-bold ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    Revisão
                  </span>
                  <span className={`text-xs font-bold ${getScoreColor(score.review)}`}>
                    {score.review}%
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  isLight ? 'bg-zinc-200' : 'bg-zinc-700'
                }`}>
                  <div 
                    className={`h-full transition-all duration-500 ${
                      score.review >= 80 ? 'bg-emerald-500' : 
                      score.review >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score.review}%` }}
                  />
                </div>
                <p className={`text-xs mt-1 ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
                  {score.daysSinceLastStudy === 0 ? 'Estudado hoje' : 
                   score.daysSinceLastStudy === 1 ? 'Estudado ontem' :
                   `${score.daysSinceLastStudy} dias sem estudo`}
                </p>
              </div>

              {/* Consistency */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className={`text-xs font-bold ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    Consistência
                  </span>
                  <span className={`text-xs font-bold ${getScoreColor(score.consistency)}`}>
                    {score.consistency}%
                  </span>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${
                  isLight ? 'bg-zinc-200' : 'bg-zinc-700'
                }`}>
                  <div 
                    className={`h-full transition-all duration-500 ${
                      score.consistency >= 80 ? 'bg-emerald-500' : 
                      score.consistency >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score.consistency}%` }}
                  />
                </div>
                <p className={`text-xs mt-1 ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
                  {score.daysStudiedThisWeek} de 7 dias esta semana
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {score.overall < 80 && onActionClick && (
              <div className="flex gap-2">
                {score.focus < 80 && (
                  <button
                    onClick={() => onActionClick(score.subject, 'study')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
                      isLight 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-indigo-500 text-white hover:bg-indigo-400'
                    }`}
                  >
                    Estudar 25 min
                  </button>
                )}
                {score.review < 80 && (
                  <button
                    onClick={() => onActionClick(score.subject, 'review')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
                      isLight 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-purple-500 text-white hover:bg-purple-400'
                    }`}
                  >
                    Revisar 10 min
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {scores.length === 0 && (
        <div className={`text-center py-12 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
          <p>Adicione matérias e metas semanais para ver o diagnóstico</p>
        </div>
      )}
    </div>
  );
};

export default SubjectDiagnostics;
