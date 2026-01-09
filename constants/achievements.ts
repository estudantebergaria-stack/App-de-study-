
import { AppState, StudyLog } from '../types';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'legendary' | 'divine';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  check?: (state: AppState) => boolean;
}

const calculateTotalQuestions = (s: AppState) => 
  Object.values(s.questions).reduce((acc, q) => acc + q.correct + q.incorrect, 0);

const getDurationTotal = (s: AppState) =>
  s.logs.reduce((acc, log) => acc + log.duration, 0);

const getDaysStudied = (logs: StudyLog[]) => {
  const days = new Set(logs.map(l => l.date.split('T')[0]));
  return Array.from(days).sort();
};

const getStartOfWeekISO = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day;
  const start = new Date(d.setDate(diff));
  start.setHours(0,0,0,0);
  return start.toISOString().split('T')[0];
};

const checkStreak = (logs: StudyLog[], requiredDays: number) => {
  const days = getDaysStudied(logs);
  if (days.length < requiredDays) return false;
  
  let currentStreak = 1;
  let maxStreak = 1;
  
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i-1]);
    const curr = new Date(days[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diff === 1) {
      currentStreak++;
    } else {
      currentStreak = 1;
    }
    maxStreak = Math.max(maxStreak, currentStreak);
  }
  return maxStreak >= requiredDays;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  // --- INICIANTE (EASY) - Total: 15 ---
  { id: 'easy-1', title: 'Aquecimento', description: 'Estudou 30 minutos em um dia', difficulty: 'easy', check: (s) => s.logs.some(l => l.duration >= 1800) },
  { id: 'easy-2', title: 'Primeiro Degrau', description: 'Estudou 1 hora em um dia', difficulty: 'easy', check: (s) => s.logs.some(l => l.duration >= 3600) },
  { id: 'easy-3', title: 'Foco em Dobro', description: 'Estudou 2 dias seguidos', difficulty: 'easy', check: (s) => checkStreak(s.logs, 2) },
  { id: 'easy-4', title: 'Arquiteto', description: 'Criou sua primeira matéria no app', difficulty: 'easy', check: (s) => s.subjects.length > 0 },
  { id: 'easy-5', title: 'Ciclo Inicial', description: 'Concluiu 1 sessão de Pomodoro', difficulty: 'easy', check: (s) => s.logs.some(l => l.type === 'Pomodoro') },
  { id: 'easy-6', title: 'Trindade de Foco', description: 'Concluiu 3 sessões de Pomodoro no mesmo dia', difficulty: 'easy', check: (s) => {
    const dailyCounts: Record<string, number> = {};
    s.logs.filter(l => l.type === 'Pomodoro').forEach(l => {
      const d = l.date.split('T')[0];
      dailyCounts[d] = (dailyCounts[d] || 0) + 1;
    });
    return Object.values(dailyCounts).some(count => count >= 3);
  }},
  { id: 'easy-7', title: 'Planejador', description: 'Adicionou sua primeira meta semanal', difficulty: 'easy', check: (s) => Object.values(s.goals).some(g => g > 0) },
  { id: 'easy-8', title: 'Rotina Viva', description: 'Registrou 5 sessões de estudo', difficulty: 'easy', check: (s) => s.logs.length >= 5 },
  { id: 'easy-9', title: 'Polímata Iniciante', description: 'Estudou em 2 matérias diferentes no mesmo dia', difficulty: 'easy', check: (s) => {
    const dailySubjects: Record<string, Set<string>> = {};
    s.logs.forEach(l => {
      const d = l.date.split('T')[0];
      if (!dailySubjects[d]) dailySubjects[d] = new Set();
      dailySubjects[d].add(l.subject);
    });
    return Object.values(dailySubjects).some(subs => subs.size >= 2);
  }},
  { id: 'easy-10', title: 'Consistência Inicial', description: 'Registrou 10 sessões de estudo no total', difficulty: 'easy', check: (s) => s.logs.length >= 10 },
  { id: 'easy-11', title: 'Explorador', description: 'Adicionou 3 tópicos/assuntos em uma única matéria', difficulty: 'easy', check: (s) => Object.values(s.topics).some(t => t.length >= 3) },
  { id: 'easy-12', title: 'Madrugador', description: 'Estudou antes das 8h da manhã', difficulty: 'easy', check: (s) => s.logs.some(l => { const h = new Date(l.date).getHours(); return h >= 4 && h < 8; }) },
  { id: 'easy-13', title: 'Coruja', description: 'Estudou após as 22h', difficulty: 'easy', check: (s) => s.logs.some(l => { const h = new Date(l.date).getHours(); return h >= 22 || h < 4; }) },
  { id: 'easy-23', title: 'Colecionador', description: 'Adicionou 3 matérias diferentes', difficulty: 'easy', check: (s) => s.subjects.length >= 3 },
  { id: 'easy-q25', title: 'Iniciante em Questões', description: 'Resolveu 25 questões no total', difficulty: 'easy', check: (s) => calculateTotalQuestions(s) >= 25 },

  // --- APRENDIZ (MEDIUM) - Total: 10 ---
  { id: 'med-1', title: 'Hábito Formado', description: 'Estudou por 5 dias seguidos', difficulty: 'medium', check: (s) => checkStreak(s.logs, 5) },
  { id: 'med-2', title: 'Primeiras Dez', description: 'Acumulou 10 horas totais de estudo', difficulty: 'medium', check: (s) => getDurationTotal(s) >= 36000 },
  { id: 'med-3', title: 'Maratonista', description: 'Estudou por 4 horas em um único dia', difficulty: 'medium', check: (s) => {
    const dailyHours: Record<string, number> = {};
    s.logs.forEach(l => { const d = l.date.split('T')[0]; dailyHours[d] = (dailyHours[d] || 0) + l.duration; });
    return Object.values(dailyHours).some(h => h >= 14400);
  }},
  { id: 'med-4', title: 'Equilibrado', description: 'Registrou estudos em 5 matérias diferentes no total', difficulty: 'medium', check: (s) => s.subjects.length >= 5 },
  { id: 'med-5', title: 'Sprint Semanal', description: 'Completou 10 sessões de Pomodoro em uma semana', difficulty: 'medium', check: (s) => {
    const weekStart = getStartOfWeekISO();
    return s.logs.filter(l => l.date >= weekStart && l.type === 'Pomodoro').length >= 10;
  }},
  { id: 'med-6', title: 'Evolução Consciente', description: 'Resolveu 200 questões no total', difficulty: 'medium', check: (s) => calculateTotalQuestions(s) >= 200 },
  { id: 'med-26', title: 'Disciplina de Ferro', description: 'Estudou 1 hora por dia em 5 dias diferentes', difficulty: 'medium', check: (s) => {
    const days = getDaysStudied(s.logs);
    const validDays = days.filter(d => s.logs.filter(l => l.date.startsWith(d)).reduce((acc, curr) => acc + curr.duration, 0) >= 3600);
    return validDays.length >= 5;
  }},
  { id: 'med-50', title: 'Meio Centurião', description: 'Completou 50 sessões de estudo no total', difficulty: 'medium', check: (s) => s.logs.length >= 50 },
  { id: 'med-q100', title: 'Aprendiz em Questões', description: 'Resolveu 100 questões no total', difficulty: 'medium', check: (s) => calculateTotalQuestions(s) >= 100 },
  { id: 'med-q500', title: 'Guerreiro de Questões', description: 'Resolveu 500 questões no total', difficulty: 'medium', check: (s) => calculateTotalQuestions(s) >= 500 },

  // --- ESPECIALISTA (HARD) - Total: 8 ---
  { id: 'hard-1', title: 'Inabalável', description: 'Estudou por 10 dias seguidos', difficulty: 'hard', check: (s) => checkStreak(s.logs, 10) },
  { id: 'hard-2', title: 'Meio Milhar', description: 'Acumulou 50 horas totais de estudo', difficulty: 'hard', check: (s) => getDurationTotal(s) >= 180000 },
  { id: 'hard-3', title: 'Veterano', description: 'Completou 200 sessões de estudo no total', difficulty: 'hard', check: (s) => s.logs.length >= 200 },
  { id: 'hard-4', title: 'Mestre do Tempo', description: 'Acumulou 100 horas totais de estudo', difficulty: 'hard', check: (s) => getDurationTotal(s) >= 360000 },
  { id: 'hard-5', title: 'Sábio', description: 'Manteve aproveitamento acima de 80% em mais de 100 questões', difficulty: 'hard', check: (s) => {
    const total = calculateTotalQuestions(s);
    if (total < 100) return false;
    let correct = 0;
    Object.values(s.questions).forEach(q => correct += q.correct);
    return (correct / total) >= 0.8;
  }},
  { id: 'hard-6', title: 'Persistência Suprema', description: 'Manteve uma sequência de 15 dias de estudo', difficulty: 'hard', check: (s) => checkStreak(s.logs, 15) },
  { id: 'hard-53', title: 'Centurião Pomodoro', description: 'Concluiu 100 sessões de Pomodoro', difficulty: 'hard', check: (s) => s.logs.filter(l => l.type === 'Pomodoro').length >= 100 },
  { id: 'hard-q250', title: 'Especialista em Questões', description: 'Resolveu 250 questões no total', difficulty: 'hard', check: (s) => calculateTotalQuestions(s) >= 250 },

  // --- LENDÁRIO (LEGENDARY) - Total: 6 ---
  { id: 'leg-1', title: 'Lenda Viva', description: 'Estudou por 30 dias seguidos', difficulty: 'legendary', check: (s) => checkStreak(s.logs, 30) },
  { id: 'leg-2', title: 'Imortal', description: 'Acumulou 250 horas totais de estudo', difficulty: 'legendary', check: (s) => getDurationTotal(s) >= 900000 },
  { id: 'leg-3', title: 'Guardião do Conhecimento', description: 'Acumulou 500 horas totais de estudo', difficulty: 'legendary', check: (s) => getDurationTotal(s) >= 1800000 },
  { id: 'leg-4', title: 'Sniper de Elite', description: 'Resolveu 5.000 questões no total', difficulty: 'legendary', check: (s) => calculateTotalQuestions(s) >= 5000 },
  { id: 'leg-100', title: 'Mestre Supremo', description: 'Consagrou seu nome com 1.000 horas de estudo.', difficulty: 'legendary', check: (s) => getDurationTotal(s) >= 3600000 },
  { id: 'leg-q1000', title: 'Lendário em Questões', description: 'Resolveu 1.000 questões no total', difficulty: 'legendary', check: (s) => calculateTotalQuestions(s) >= 1000 },

  // --- DIVINO (DIVINE) - Total: 1 ---
  { id: 'div-101', title: 'Divindade do Focus', description: 'Desbloqueou todas as conquistas do Focus!', difficulty: 'divine', check: (s) => {
    const unlockedCount = s.unlockedAchievements?.length || 0;
    return unlockedCount >= (ACHIEVEMENTS.length - 1);
  }}
];

export const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy': return 'text-emerald-400';
    case 'medium': return 'text-indigo-400';
    case 'hard': return 'text-yellow-400';
    case 'legendary': return 'text-red-600';
    case 'divine': return 'text-amber-400';
    default: return 'text-zinc-400';
  }
};
