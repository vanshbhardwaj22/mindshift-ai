import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Activity } from 'lucide-react';

// Components
import { Navigation } from './components/layout/Navigation';
import { HabitTracker } from './components/home/HabitTracker';
import { MoodInput } from './components/home/MoodInput';
import { InterventionView } from './components/home/InterventionView';
import { AnalyticsDashboard } from './components/stats/AnalyticsDashboard';
import { SettingsView } from './components/settings/SettingsView';
import { FocusTimer } from './components/home/FocusTimer';

// Services
import { analyzeMood, getIntervention } from './services/geminiService';
import { generateMoodInsights } from './services/analyticsService';

// Types & Constants
import { Mood, MoodEntry, MoodInsights, Habit } from './types';
import { DEFAULT_HABITS } from './constants';
import { cn } from './lib/utils';

export default function App() {
  // --- State Management ---
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [intervention, setIntervention] = useState<any>(null);
  const [history, setHistory] = useState<MoodEntry[]>([
    { id: '1', timestamp: Date.now() - 86400000 * 3, mood: 'Happy', note: 'Great day at work!', intensity: 9 },
    { id: '2', timestamp: Date.now() - 86400000 * 2.5, mood: 'Tired', note: 'Long commute', intensity: 4 },
    { id: '3', timestamp: Date.now() - 86400000 * 2, mood: 'Procrastinating', note: 'Struggling with a task', intensity: 7 },
    { id: '4', timestamp: Date.now() - 86400000 * 1.5, mood: 'Angry', note: 'Traffic was bad', intensity: 8 },
    { id: '5', timestamp: Date.now() - 86400000 * 1, mood: 'Happy', note: 'Gym session felt good', intensity: 9 },
  ]);
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'settings'>('home');
  const [view, setView] = useState<'input' | 'result'>('input');
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [insights, setInsights] = useState<MoodInsights | null>(null);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [clarificationNeeded, setClarificationNeeded] = useState(false);
  const [challengeTimer, setChallengeTimer] = useState(0);
  const [isChallenging, setIsChallenging] = useState(false);
  const [streak, setStreak] = useState(0);

  // --- Focus Timer State ---
  const [focusMode, setFocusMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [focusTimeRemaining, setFocusTimeRemaining] = useState(25 * 60);
  const [isFocusActive, setIsFocusActive] = useState(false);

  const recognitionRef = useRef<any>(null);

  // --- Voice Recognition Setup ---
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  // --- Challenge Timer Logic ---
  useEffect(() => {
    let interval: any;
    if (isChallenging && challengeTimer > 0) {
      interval = setInterval(() => {
        setChallengeTimer((prev) => prev - 1);
      }, 1000);
    } else if (challengeTimer === 0 && isChallenging) {
      setIsChallenging(false);
      setStreak(prev => prev + 1);
    }
    return () => clearInterval(interval);
  }, [isChallenging, challengeTimer]);

  // --- Focus Timer Logic ---
  useEffect(() => {
    let interval: any;
    if (isFocusActive && focusTimeRemaining > 0) {
      interval = setInterval(() => {
        setFocusTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (focusTimeRemaining === 0 && isFocusActive) {
      setIsFocusActive(false);
      // Optional: Play a sound or show notification
      alert(`${focusMode.charAt(0).toUpperCase() + focusMode.slice(1)} session complete!`);
    }
    return () => clearInterval(interval);
  }, [isFocusActive, focusTimeRemaining, focusMode]);

  // --- Handlers ---
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const logUserResponse = (action: 'helped' | 'retried') => {
    setHistory(prev => {
      const newHistory = [...prev];
      if (newHistory.length > 0 && newHistory[0].intervention) {
        newHistory[0] = {
          ...newHistory[0],
          intervention: { ...newHistory[0].intervention, action_taken: action }
        };
      }
      return newHistory;
    });
  };

  const handleManualMood = async (mood: Mood) => {
    setIsAnalyzing(true);
    setCurrentMood(mood);
    try {
      const interventionResult = await getIntervention(mood);
      setIntervention(interventionResult);
      setView('result');

      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        mood: mood,
        note: `Manual selection: ${mood}`,
        intensity: 8,
        intervention: { type: interventionResult.type, title: interventionResult.title }
      };
      setHistory(prev => [newEntry, ...prev]);
    } catch (error) {
      console.error("Error getting intervention:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setClarificationNeeded(false);
    try {
      const result = await analyzeMood(input);
      if (result.confidence < 0.6) {
        setClarificationNeeded(true);
        setIsAnalyzing(false);
        return;
      }
      setCurrentMood(result.mood_label);
      const interventionResult = await getIntervention(result.mood_label, input);
      setIntervention(interventionResult);
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        mood: result.mood_label,
        note: input,
        intensity: Math.round(result.confidence * 10),
        intervention: { type: interventionResult.type, title: interventionResult.title }
      };
      setHistory(prev => [newEntry, ...prev]);
      setInput('');
      setView('result');
    } catch (error) {
      console.error("Error analyzing mood:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetryIntervention = async () => {
    if (!currentMood) return;
    logUserResponse('retried');
    setIsAnalyzing(true);
    try {
      const interventionResult = await getIntervention(currentMood, input);
      setIntervention(interventionResult);
    } catch (error) {
      console.error("Error retrying intervention:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateInsights = async () => {
    if (history.length === 0) return;
    setIsGeneratingInsights(true);
    try {
      const result = await generateMoodInsights(history, habits);
      setInsights(result);
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const toggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDays.includes(today);
        return {
          ...habit,
          completedDays: isCompleted
            ? habit.completedDays.filter(d => d !== today)
            : [...habit.completedDays, today]
        };
      }
      return habit;
    }));
  };

  const startChallenge = () => {
    setChallengeTimer(20);
    setIsChallenging(true);
  };

  const handleFocusToggle = () => setIsFocusActive(!isFocusActive);
  const handleFocusReset = () => {
    setIsFocusActive(false);
    const times = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
    setFocusTimeRemaining(times[focusMode]);
  };
  const handleFocusModeChange = (mode: 'focus' | 'short' | 'long') => {
    setIsFocusActive(false);
    setFocusMode(mode);
    const times = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
    setFocusTimeRemaining(times[mode]);
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F5F5F0]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-black/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
            <Activity size={18} />
          </div>
          <h1 className="text-xl font-medium tracking-tight">MindShift<span className="font-bold text-emerald-600"> AI</span></h1>
        </div>
        <div className="w-8 h-8 rounded-full bg-black/5 border border-black/5 flex items-center justify-center overflow-hidden">
          <img src="https://picsum.photos/seed/user/100/100" alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-8 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && view === 'input' && (
            <div className="space-y-8">
              <HabitTracker habits={habits} onToggle={toggleHabit} />

              <FocusTimer
                timeRemaining={focusTimeRemaining}
                isActive={isFocusActive}
                mode={focusMode}
                onToggle={handleFocusToggle}
                onReset={handleFocusReset}
                onModeChange={handleFocusModeChange}
              />

              <MoodInput
                input={input}
                setInput={setInput}
                isRecording={isRecording}
                toggleRecording={toggleRecording}
                isAnalyzing={isAnalyzing}
                handleAnalyze={handleAnalyze}
                handleManualMood={handleManualMood}
                clarificationNeeded={clarificationNeeded}
              />
            </div>
          )}

          {activeTab === 'home' && view === 'result' && intervention && (
            <InterventionView
              currentMood={currentMood}
              intervention={intervention}
              streak={streak}
              isChallenging={isChallenging}
              challengeTimer={challengeTimer}
              startChallenge={startChallenge}
              handleRetryIntervention={handleRetryIntervention}
              isAnalyzing={isAnalyzing}
              setView={setView}
            />
          )}

          {activeTab === 'stats' && (
            <AnalyticsDashboard
              history={history}
              insights={insights}
              isGeneratingInsights={isGeneratingInsights}
              handleGenerateInsights={handleGenerateInsights}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView setHistory={setHistory} />
          )}
        </AnimatePresence>
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} setView={setView} />
    </div>
  );
}
