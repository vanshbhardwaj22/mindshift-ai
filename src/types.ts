export type Mood = 
  | 'Sad' 
  | 'Bored' 
  | 'Angry' 
  | 'Horny' 
  | 'Lonely' 
  | 'Procrastinating' 
  | 'Want to Watch Movie' 
  | 'Happy' 
  | 'Tired'
  | 'Neutral'
  | 'Excited';

export interface MoodEntry {
  id: string;
  timestamp: number;
  mood: Mood;
  note: string;
  intensity: number; // 1-10
  intervention?: {
    type: string;
    title: string;
    action_taken?: 'helped' | 'retried';
  };
}

export interface MoodInsights {
  summary: string;
  dominantMood: Mood;
  productivityScore: number;
  disciplineIndex: number;
  patterns: string[];
  recommendations: string[];
}

export interface Intervention {
  type: 'joke' | 'quote' | 'song' | 'exercise' | 'task';
  content: string;
  title: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  completedDays: string[]; // YYYY-MM-DD
}

export interface UserProfile {
  name: string;
  streak: number;
  lastCompletedChallenge?: number;
  habits: Habit[];
  preferences: {
    notifications: boolean;
    language: 'English' | 'Hindi';
  };
}
