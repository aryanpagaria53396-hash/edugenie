export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface QuizState {
  selectedAnswer?: string;
  isSubmitted: boolean;
  isCorrect?: boolean;
}

export interface ApiStatus {
  status: string;
  hasApiKey: boolean;
  defaultModel: string;
  fallbackModel: string;
  version: string;
  appName: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  type: 'qa' | 'explain' | 'summarize' | 'quiz' | 'roadmap';
  title: string;
  query: string;
  result: any;
}
