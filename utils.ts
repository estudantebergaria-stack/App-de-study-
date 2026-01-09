
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
