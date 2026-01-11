
export type Tab = 'dashboard' | 'focus' | 'resumo' | 'weekly' | 'stats' | 'questoes' | 'calendario' | 'conquistas' | 'settings' | 'share' | 'ajuda' | 'provas' | 'subjects_manage' | 'revisao';

export type Language = 'pt-BR' | 'en-US' | 'es-ES' | 'ru-RU';

export interface StudyLog {
  id: number;
  date: string;
  subject: string;
  topic?: string;
  duration: number; // in seconds
  type: 'Pomodoro' | 'Cronômetro';
}

export interface QuestionLog {
  id: number;
  date: string;
  subject: string;
  correct: number;
  incorrect: number;
}

export interface QuestionData {
  correct: number;
  incorrect: number;
}

export interface ReviewItem {
  id: number;
  date: string;
  subject: string;
  topic?: string;
  notes?: string;
  completed: boolean;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  username: string;
  language: Language;
  isTestMode?: boolean;
  isEpicMode?: boolean;
}

export interface AppState {
  subjects: string[];
  subjectColors: Record<string, string>; // subject -> hex color
  topics: Record<string, string[]>; // subject -> [topic1, topic2...]
  logs: StudyLog[];
  goals: Record<string, number>; // hours per week
  questions: Record<string, QuestionData>; // subject -> {correct, incorrect}
  questionLogs: QuestionLog[];
  reviews: ReviewItem[]; // items marked for review
  unlockedAchievements?: string[]; // IDs of action-based achievements
  viewedAchievements?: string[]; // IDs of achievements the user has already clicked/seen
  selectedAchievementId?: string; // ID of the achievement to highlight in sidebar
  settings: UserSettings;
  examDate?: string;
  examName?: string;
}

export type TimerMode = 'pomodoro' | 'stopwatch';
export type PomoState = 'work' | 'break';
