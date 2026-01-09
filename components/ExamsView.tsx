
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Target, Clock, Zap, Star, Eye, EyeOff } from 'lucide-react';

interface ExamsViewProps {
  examDate?: string;
  examName?: string;
  onUpdateExam: (name: string, date: string) => void;
  theme: 'dark' | 'light';
  t: any;
}

const ExamsView: React.FC<ExamsViewProps> = ({ examDate, examName, onUpdateExam, theme, t }) => {
  const isLight = theme === 'light';
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [showWarning, setShowWarning] = useState(false);

  const quote = useMemo(() => {
    const quotes = t.motivationQuotes || [];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [t.motivationQuotes]);

  useEffect(() => {
    if (!examDate) return;

    const targetDate = new Date(examDate);
    if (isNaN(targetDate.getTime())) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const distance = target - now;

      if (isNaN(distance) || distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: -1 });
        clearInterval(timer);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, total: distance });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [examDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const yearMatch = val.match(/^(\d+)/);
    if (yearMatch && yearMatch[1].length > 4) {
      return;
    }
    onUpdateExam(examName || '', val);
  };

  const formattedChosenDate = useMemo(() => {
    if (!examDate) return null;
    const date = new Date(examDate);
    if (isNaN(date.getTime())) return null;
    
    return new Intl.DateTimeFormat(t.locale || 'pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(date);
  }, [examDate, t.locale]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-lg shadow-rose-600/20">
            <Target size={24} />
          </div>
          <h1 className={`text-3xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{t.provas}</h1>
        </div>
        <p className={`${isLight ? 'text-slate-500' : 'text-zinc-500'} font-medium`}>{t.examTabSubtitle}</p>
      </div>

      <div className={`p-8 rounded-[2.5rem] border shadow-2xl transition-all duration-500 ${
        isLight ? 'bg-white border-slate-100' : 'glass-panel'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>{t.examNameLabel}</label>
            <input 
              type="text"
              value={examName || ''}
              onChange={(e) => onUpdateExam(e.target.value, examDate || '')}
              placeholder="Ex: ENEM 2025"
              className={`w-full px-4 py-3 rounded-xl border text-sm font-bold outline-none transition-all ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-rose-500' : 'bg-zinc-950/50 border-zinc-800 text-white focus:border-rose-500'
              }`}
            />
          </div>
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>{t.examDateLabel}</label>
            <input 
              type="datetime-local"
              value={examDate || ''}
              onChange={handleDateChange}
              max="9999-12-31T23:59"
              className={`w-full px-4 py-3 rounded-xl border text-sm font-bold outline-none transition-all ${
                isLight ? 'bg-slate-50 border-slate-200 text-slate-900 focus:border-rose-500' : 'bg-zinc-950/50 border-zinc-800 text-white focus:border-rose-500'
              }`}
            />
          </div>
        </div>

        {examDate && !isNaN(new Date(examDate).getTime()) ? (
          <div className="flex flex-col items-center">
            {formattedChosenDate && (
              <div className={`mb-6 text-xs font-bold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                {formattedChosenDate}
              </div>
            )}
            
            {timeLeft.total < 0 ? (
               <div className="text-center py-10 space-y-4">
                 <div className="text-4xl font-black text-emerald-500 uppercase tracking-tighter animate-bounce">{t.examFinished}</div>
                 <div className="text-6xl">✨ 🍀 ✨</div>
               </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                {[
                  { value: timeLeft.days, label: t.daysLabel },
                  { value: timeLeft.hours, label: t.hoursLabel },
                  { value: timeLeft.minutes, label: t.minutesLabel },
                  { value: timeLeft.seconds, label: t.secondsLabel }
                ].map((item, idx) => (
                  <div key={idx} className={`p-6 rounded-3xl border text-center flex flex-col items-center justify-center transition-all ${
                    isLight ? 'bg-slate-50 border-slate-100' : 'bg-zinc-900/50 border-zinc-800/50'
                  }`}>
                    <span className={`text-4xl md:text-5xl font-mono font-black mb-1 ${isLight ? 'text-rose-600' : 'text-rose-500'}`}>
                      {item.value.toString().padStart(2, '0')}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            <div className={`mt-10 p-6 w-full rounded-2xl border text-center relative overflow-hidden ${
              isLight ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-rose-950/20 border-rose-500/20 text-rose-100'
            }`}>
              <div className="absolute top-0 left-0 p-4 opacity-5 pointer-events-none">
                 <Zap size={48} />
              </div>
              <p className="text-sm md:text-base font-black italic tracking-wide relative z-10 leading-relaxed">
                "{quote}"
              </p>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center flex flex-col items-center gap-4 opacity-40">
            <Calendar size={48} className="text-zinc-600" />
            <p className="font-bold text-zinc-500 uppercase tracking-widest text-xs px-10">
              {examDate && isNaN(new Date(examDate).getTime()) ? t.examInvalidDate : t.examPlaceholderHint}
            </p>
          </div>
        )}
      </div>

      <div className={`p-8 rounded-[2.5rem] border text-center space-y-6 relative overflow-hidden transition-all duration-700 max-w-xl mx-auto shadow-2xl ${
        isLight 
          ? 'bg-red-900 text-white border-red-800 shadow-red-900/10' 
          : 'bg-[#2d0a0a] text-white border-red-900/20 shadow-black/60'
      }`}>
         <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12">
            <Star size={64} fill="white" />
         </div>
         
         <div className="space-y-2 relative z-10 px-4">
           <h2 className="text-xl font-black tracking-tight">{t.examConstancyTitle}</h2>
           <p className="text-sm font-bold opacity-90 max-w-sm mx-auto leading-relaxed">
             {t.examConstancyDesc}
           </p>
         </div>

         <div className="relative z-10 flex flex-col items-center pt-2">
            <button 
              onClick={() => setShowWarning(!showWarning)}
              className={`p-3 rounded-2xl transition-all shadow-md ${
                isLight ? 'bg-white/10 hover:bg-white/20' : 'bg-red-950/40 hover:bg-red-900/50'
              }`}
              title="Aviso de Ansiedade"
            >
              {showWarning ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
            
            {showWarning && (
              <div className={`mt-6 p-6 rounded-[1.5rem] animate-slide-down border text-xs leading-relaxed font-bold shadow-inner ${
                isLight ? 'bg-black/20 border-white/10' : 'bg-black/30 border-white/5'
              }`}>
                ⚠️ Caso você sinta que colocar alguma data de alguma prova aqui te deixará mais ansioso do que o recomendável, por favor, não faça isto. Você é mais importante do que qualquer prova neste mundo.
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ExamsView;
