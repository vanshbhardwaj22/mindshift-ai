import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Coffee, Focus, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FocusTimerProps {
  timeRemaining: number;
  isActive: boolean;
  mode: 'focus' | 'short' | 'long';
  onToggle: () => void;
  onReset: () => void;
  onModeChange: (mode: 'focus' | 'short' | 'long') => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  timeRemaining,
  isActive,
  mode,
  onToggle,
  onReset,
  onModeChange,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' ? 25 * 60 : mode === 'short' ? 5 * 60 : 15 * 60;
  const progress = (timeRemaining / totalTime) * 100;

  return (
    <section className="relative overflow-hidden p-8 rounded-[3rem] glass-morphism border-white/20">
      {/* Background Pulse Effect */}
      {isActive && (
        <div className={cn(
          "absolute inset-0 -z-10 animate-slow-pulse blur-3xl rounded-full opacity-20",
          mode === 'focus' ? "bg-emerald-500" : mode === 'short' ? "bg-blue-500" : "bg-purple-500"
        )} />
      )}

      <div className="flex flex-col items-center gap-8">
        {/* Mode Toggles */}
        <div className="flex p-1 bg-black/5 rounded-2xl w-full">
          {(['focus', 'short', 'long'] as const).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-widest transition-all rounded-xl",
                mode === m 
                  ? "bg-white text-black shadow-sm" 
                  : "text-black/40 hover:text-black/60"
              )}
            >
              {m === 'focus' && <Focus size={14} />}
              {m === 'short' && <Coffee size={14} />}
              {m === 'long' && <Moon size={14} />}
              {m}
            </button>
          ))}
        </div>

        {/* Timer Circle */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-black/5"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray="754"
              animate={{ strokeDashoffset: 754 * (1 - progress / 100) }}
              transition={{ duration: 1, ease: "linear" }}
              className={cn(
                "transition-colors",
                mode === 'focus' ? "text-emerald-500" : mode === 'short' ? "text-blue-500" : "text-purple-500"
              )}
            />
          </svg>
          
          <div className="text-center group cursor-pointer" onClick={onToggle}>
            <motion.span 
              key={timeRemaining}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl font-light tracking-tighter tabular-nums"
            >
              {formatTime(timeRemaining)}
            </motion.span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/30 mt-2">
              {isActive ? "Flow Active" : "Paused"}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 w-full">
          <button 
            onClick={onReset}
            className="p-4 bg-black/5 text-black/40 rounded-2xl hover:text-black/60 active:scale-95 transition-all"
          >
            <RotateCcw size={20} />
          </button>
          
          <button 
            onClick={onToggle}
            className={cn(
              "flex-1 py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all",
              mode === 'focus' ? "bg-emerald-600 shadow-emerald-500/20" : 
              mode === 'short' ? "bg-blue-600 shadow-blue-500/20" : 
              "bg-purple-600 shadow-purple-500/20"
            )}
          >
            {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            {isActive ? "Pause Focus" : "Start Flow"}
          </button>
        </div>
      </div>
    </section>
  );
};
