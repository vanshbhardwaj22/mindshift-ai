import React from 'react';
import { 
  Smile, 
  Frown, 
  Zap, 
  Coffee, 
  User, 
  Heart, 
  Clock, 
  Activity, 
  Tv,
  Sun,
  Droplets,
  Flame
} from 'lucide-react';
import { Mood, Habit } from './types';

export const MOOD_OPTIONS: { label: string; value: Mood; icon: React.ReactNode; color: string }[] = [
  { label: 'Happy', value: 'Happy', icon: <Smile size={20} />, color: 'bg-yellow-100 text-yellow-700' },
  { label: 'Sad', value: 'Sad', icon: <Frown size={20} />, color: 'bg-blue-100 text-blue-700' },
  { label: 'Angry', value: 'Angry', icon: <Zap size={20} />, color: 'bg-red-100 text-red-700' },
  { label: 'Bored', value: 'Bored', icon: <Coffee size={20} />, color: 'bg-stone-100 text-stone-700' },
  { label: 'Lonely', value: 'Lonely', icon: <User size={20} />, color: 'bg-purple-100 text-purple-700' },
  { label: 'Horny', value: 'Horny', icon: <Heart size={20} />, color: 'bg-pink-100 text-pink-700' },
  { label: 'Tired', value: 'Tired', icon: <Clock size={20} />, color: 'bg-gray-100 text-gray-700' },
  { label: 'Procrastinating', value: 'Procrastinating', icon: <Activity size={20} />, color: 'bg-orange-100 text-orange-700' },
  { label: 'Watch Movie', value: 'Want to Watch Movie', icon: <Tv size={20} />, color: 'bg-indigo-100 text-indigo-700' },
];

export const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', name: 'Morning Meditation', icon: 'Sun', color: 'text-yellow-500 bg-yellow-50', completedDays: [] },
  { id: 'h2', name: 'Cold Shower', icon: 'Droplets', color: 'text-blue-500 bg-blue-50', completedDays: [] },
  { id: 'h3', name: 'No Junk Food', icon: 'Flame', color: 'text-orange-500 bg-orange-50', completedDays: [] },
];

export const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'];
