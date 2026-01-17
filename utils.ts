
import { StudyLog } from './types';

export const formatTime = (s: number) => {
  const h = Math.floor(s / 3600).toString().padStart(2, '0');
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return h === '00' ? `${m}:${sec}` : `${h}:${m}:${sec}`;
};

export const formatTimeShort = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h === 0 && m === 0) return `${s}s`;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export const toLocalISO = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayISO = () => toLocalISO(new Date());

/**
 * Returns start and end date keys for the current week (Monday-Sunday).
 */
export const getWeekRange = (): { start: string; end: string } => {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Move to Monday
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return {
    start: toLocalISO(monday),
    end: toLocalISO(sunday)
  };
};

/**
 * Returns start and end date keys for the previous week.
 */
export const getPreviousWeekRange = (): { start: string; end: string } => {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  
  const lastMonday = new Date(now);
  lastMonday.setDate(now.getDate() + diff - 7);
  lastMonday.setHours(0, 0, 0, 0);
  
  const lastSunday = new Date(lastMonday);
  lastSunday.setDate(lastMonday.getDate() + 6);
  lastSunday.setHours(23, 59, 59, 999);
  
  return {
    start: toLocalISO(lastMonday),
    end: toLocalISO(lastSunday)
  };
};

/**
 * Creates a topic key from subject and topic.
 */
export const createTopicKey = (subject: string, topic: string): string => {
  return `${subject}::${topic}`;
};

/**
 * Parses a topic key to extract subject and topic.
 */
export const parseTopicKey = (key: string): { subject: string; topic: string } => {
  const parts = key.split('::');
  return {
    subject: parts[0] || '',
    topic: parts[1] || ''
  };
};

/**
 * Calculates the base interval in days based on review count.
 */
export const getBaseInterval = (reviewCount: number): number => {
  if (reviewCount <= 1) return 1;
  // Exponential growth with base 1.7, capped at 180 days
  const interval = Math.pow(1.7, reviewCount - 1);
  return Math.min(180, Math.round(interval));
};

/**
 * Calculates the difficulty multiplier based on accuracy (0-1 range).
 */
export const getDifficultyMultiplier = (accuracy: number): number => {
  // Clamp accuracy to valid range [0, 1]
  const validAccuracy = Math.max(0, Math.min(1, accuracy));
  // New formula that rewards high performance (>80%) with multiplier > 1.0
  // Median performance results in multiplier <= 1.0
  const mult = 0.6 + Math.pow(validAccuracy, 3) * 1.4;
  return mult;
};

/**
 * Calculates days between two date strings (YYYY-MM-DD).
 */
export const daysBetween = (dateStr1: string, dateStr2: string): number => {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Calcula a sequência de dias seguidos (streak).
 */
export const calculateStreak = (logs: StudyLog[]): number => {
  if (!logs || logs.length === 0) return 0;

  // Extrai datas únicas locais e ordena (mais nova para mais velha)
  const uniqueDays = Array.from(
    new Set(logs.map(l => toLocalISO(new Date(l.date))))
  ).sort((a, b) => b.localeCompare(a));

  if (uniqueDays.length === 0) return 0;

  const today = getTodayISO();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = toLocalISO(yesterdayDate);

  // Se o dia mais recente de estudo não for hoje nem ontem, a sequência quebrou
  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) {
    return 0;
  }

  let streak = 0;
  // Começamos a verificação a partir do dia de estudo mais recente encontrado
  let checkDate = new Date(uniqueDays[0].replace(/-/g, '/'));

  for (const dayStr of uniqueDays) {
    const currentCheckStr = toLocalISO(checkDate);
    
    if (dayStr === currentCheckStr) {
      streak++;
      // Prepara a data do dia anterior para a próxima iteração
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Se houver um buraco na sequência, paramos
      break;
    }
  }

  return streak;
};

/**
 * Verifica se o tema Elite foi desbloqueado (100 horas de estudo).
 */
export const isEliteThemeUnlocked = (logs: StudyLog[]): boolean => {
  const totalSeconds = logs.reduce((acc, log) => acc + log.duration, 0);
  const totalHours = totalSeconds / 3600;
  return totalHours >= 100;
};

/**
 * Verifica se o tema Mestre foi desbloqueado (30 dias consecutivos).
 */
export const isMestreThemeUnlocked = (logs: StudyLog[]): boolean => {
  return calculateStreak(logs) >= 30;
};

/**
 * Calculates a subject score (0-100) based on three dimensions:
 * - Focus: Weekly time vs goal
 * - Review: Time since last review vs ideal interval
 * - Consistency: Days studied this week
 */
export interface SubjectScore {
  subject: string;
  overall: number; // 0-100
  focus: number; // 0-100
  review: number; // 0-100
  consistency: number; // 0-100
  weeklyMinutes: number;
  goalMinutes: number;
  daysSinceLastStudy: number;
  daysStudiedThisWeek: number;
}

export const calculateSubjectScore = (
  subject: string,
  logs: StudyLog[],
  goals: Record<string, number>,
  reviewStates?: Record<string, any>
): SubjectScore => {
  const today = getTodayISO();
  const { start, end } = getWeekRange();
  
  // Get logs for this subject this week
  const weekLogs = logs.filter(l => 
    l.subject === subject && 
    l.date >= start && 
    l.date <= end
  );
  
  const weeklyMinutes = weekLogs.reduce((acc, l) => acc + l.duration, 0) / 60;
  const goalMinutes = (goals[subject] || 0) * 60; // Convert hours to minutes
  
  // Focus score: weekly time vs goal
  let focusScore = 0;
  if (goalMinutes > 0) {
    focusScore = Math.min(100, (weeklyMinutes / goalMinutes) * 100);
  } else {
    // If no goal set, give partial credit if studied at all
    focusScore = weeklyMinutes > 0 ? 50 : 0;
  }
  
  // Consistency score: days studied this week (max 7)
  const daysStudiedThisWeek = new Set(
    weekLogs.map(l => toLocalISO(new Date(l.date)))
  ).size;
  const consistencyScore = (daysStudiedThisWeek / 7) * 100;
  
  // Review score: how recently studied (inverse of days since last study)
  const subjectLogs = logs.filter(l => l.subject === subject);
  let daysSinceLastStudy = 999;
  let reviewScore = 0;
  
  if (subjectLogs.length > 0) {
    const lastLog = subjectLogs.reduce((latest, log) => 
      log.date > latest.date ? log : latest
    );
    daysSinceLastStudy = daysBetween(toLocalISO(new Date(lastLog.date)), today);
    
    // Ideal is to study every day (0 days since), worst is 14+ days
    reviewScore = Math.max(0, 100 - (daysSinceLastStudy * 7));
  }
  
  // Overall score: weighted average
  const overall = (focusScore * 0.4 + reviewScore * 0.3 + consistencyScore * 0.3);
  
  return {
    subject,
    overall: Math.round(overall),
    focus: Math.round(focusScore),
    review: Math.round(reviewScore),
    consistency: Math.round(consistencyScore),
    weeklyMinutes: Math.round(weeklyMinutes),
    goalMinutes: Math.round(goalMinutes),
    daysSinceLastStudy,
    daysStudiedThisWeek
  };
};

/**
 * Gets the week's study days as a 7-element array (Mon-Sun)
 * where each element is the minutes studied that day
 */
export const getWeekHeatmapData = (logs: StudyLog[]): number[] => {
  const { start } = getWeekRange();
  const weekData = new Array(7).fill(0);
  
  const startDate = new Date(start.replace(/-/g, '/'));
  
  logs.forEach(log => {
    const logDate = new Date(log.date);
    const daysDiff = Math.floor((logDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff >= 0 && daysDiff < 7) {
      weekData[daysDiff] += log.duration / 60; // Convert to minutes
    }
  });
  
  return weekData;
};

/**
 * Generates daily missions based on subject scores
 */
export interface DailyMission {
  id: string;
  type: 'study' | 'review' | 'complete_goal';
  subject: string;
  title: string;
  description: string;
  targetMinutes: number;
  xpReward: number;
}

export const generateDailyMissions = (
  subjects: string[],
  logs: StudyLog[],
  goals: Record<string, number>
): DailyMission[] => {
  const missions: DailyMission[] = [];
  const scores = subjects.map(s => calculateSubjectScore(s, logs, goals));
  
  // Find most neglected subject (lowest review score)
  const mostNeglected = [...scores].sort((a, b) => a.review - b.review)[0];
  if (mostNeglected && mostNeglected.daysSinceLastStudy > 2) {
    missions.push({
      id: `review-${mostNeglected.subject}`,
      type: 'review',
      subject: mostNeglected.subject,
      title: `Revisar ${mostNeglected.subject}`,
      description: `Sem revisão há ${mostNeglected.daysSinceLastStudy} dias`,
      targetMinutes: 10,
      xpReward: 150
    });
  }
  
  // Find subject furthest from weekly goal
  const furthestFromGoal = [...scores]
    .filter(s => s.goalMinutes > 0)
    .sort((a, b) => {
      const aDiff = a.goalMinutes - a.weeklyMinutes;
      const bDiff = b.goalMinutes - b.weeklyMinutes;
      return bDiff - aDiff;
    })[0];
  
  if (furthestFromGoal && furthestFromGoal.weeklyMinutes < furthestFromGoal.goalMinutes) {
    const remaining = furthestFromGoal.goalMinutes - furthestFromGoal.weeklyMinutes;
    missions.push({
      id: `goal-${furthestFromGoal.subject}`,
      type: 'study',
      subject: furthestFromGoal.subject,
      title: `Estudar ${furthestFromGoal.subject}`,
      description: `Abaixo da meta semanal (${Math.round(furthestFromGoal.weeklyMinutes)}/${furthestFromGoal.goalMinutes} min)`,
      targetMinutes: Math.min(25, Math.round(remaining)),
      xpReward: 200
    });
  }
  
  // Add a daily completion mission
  const today = getTodayISO();
  const todayLogs = logs.filter(l => toLocalISO(new Date(l.date)) === today);
  const todayMinutes = todayLogs.reduce((acc, l) => acc + l.duration, 0) / 60;
  const dailyGoal = 45; // Default daily goal
  
  if (todayMinutes < dailyGoal) {
    missions.push({
      id: 'daily-complete',
      type: 'complete_goal',
      subject: '',
      title: `Completar ${dailyGoal} min hoje`,
      description: `Você está a ${Math.round(dailyGoal - todayMinutes)} min da meta diária`,
      targetMinutes: dailyGoal,
      xpReward: 250
    });
  }
  
  return missions.slice(0, 3); // Return max 3 missions
};

/**
 * XP and Leveling System
 */

export interface LevelInfo {
  level: number;
  name: string;
  xpRequired: number; // Total XP needed to reach this level (from level 1)
  xpForNext: number; // Remaining XP needed to reach the next level
}

export const LEVEL_NAMES = [
  'Iniciante',      // 1
  'Aprendiz',       // 2
  'Estudante',      // 3
  'Dedicado',       // 4
  'Focado',         // 5
  'Persistente',    // 6
  'Determinado',    // 7
  'Comprometido',   // 8
  'Expert',         // 9
  'Mestre',         // 10
  'Lenda',          // 11+
];

/**
 * Calculate XP required for a given level
 * Formula: level^2 * 500 (exponential growth)
 */
export const getXPForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return Math.floor(Math.pow(level, 2) * 500);
};

/**
 * Calculate level from total XP
 */
export const calculateLevel = (totalXP: number): number => {
  let level = 1;
  while (getXPForLevel(level + 1) <= totalXP) {
    level++;
  }
  return level;
};

/**
 * Get level info for current XP
 */
export const getLevelInfo = (totalXP: number): LevelInfo => {
  const level = calculateLevel(totalXP);
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  
  return {
    level,
    name: LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)],
    xpRequired: currentLevelXP,
    xpForNext: nextLevelXP - totalXP
  };
};

/**
 * Calculate XP earned from a study session
 * - Base: 10 XP per minute for study, 15 XP per minute for review
 * - Streak bonus: up to 2x multiplier for daily streak
 * - Anti-abuse: Diminishing returns after 90 continuous minutes
 */
export const calculateSessionXP = (
  durationSeconds: number,
  isReview: boolean,
  currentStreak: number,
  continuousMinutes: number = 0
): number => {
  const minutes = durationSeconds / 60;
  
  // Base XP rate
  const baseRate = isReview ? 15 : 10; // Review gives more XP
  
  // Streak multiplier (1.0 to 2.0 based on streak)
  // Caps at 30 days for 2x
  const streakMultiplier = 1 + Math.min(currentStreak / 30, 1.0);
  
  // Diminishing returns for marathon sessions
  let effectiveMinutes = minutes;
  if (continuousMinutes > 90) {
    const excessMinutes = continuousMinutes - 90;
    const penaltyFactor = Math.max(0.3, 1 - (excessMinutes / 180)); // Down to 30% after 180 additional minutes
    // Apply full rate to first 90 minutes, then penalized rate to excess
    const currentSessionExcess = Math.min(minutes, Math.max(0, continuousMinutes - 90 + minutes) - (continuousMinutes - 90));
    effectiveMinutes = (minutes - currentSessionExcess) + (currentSessionExcess * penaltyFactor);
  }
  
  const xp = Math.floor(effectiveMinutes * baseRate * streakMultiplier);
  return Math.max(0, xp);
};

/**
 * Check if a mission is completed
 */
export const isMissionCompleted = (
  mission: DailyMission,
  logs: StudyLog[]
): boolean => {
  const today = getTodayISO();
  const todayLogs = logs.filter(l => toLocalISO(new Date(l.date)) === today);
  
  if (mission.type === 'complete_goal') {
    const todayMinutes = todayLogs.reduce((acc, l) => acc + l.duration, 0) / 60;
    return todayMinutes >= mission.targetMinutes;
  } else if (mission.subject) {
    const subjectMinutes = todayLogs
      .filter(l => l.subject === mission.subject)
      .reduce((acc, l) => acc + l.duration, 0) / 60;
    return subjectMinutes >= mission.targetMinutes;
  }
  
  return false;
};
