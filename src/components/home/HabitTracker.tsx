import React from 'react';
import { Habit } from '../../types';
import { cn } from '../../lib/utils';
import { CheckCircle, Sun, Droplets, Flame } from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  onToggle: (id: string) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggle }) => {
  const today = new Date().toISOString().split('T')[0];
  const completedCount = habits.filter(h => h.completedDays.includes(today)).length;

  const getHabitIcon = (iconName: string, size = 20) => {
    switch (iconName) {
      case 'Sun': return <Sun size={size} />;
      case 'Droplets': return <Droplets size={size} />;
      case 'Flame': return <Flame size={size} />;
      default: return <CheckCircle size={size} />;
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-black/30">Daily Discipline</h3>
        <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
          {completedCount}/{habits.length} Done
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {habits.map(habit => {
          const isCompleted = habit.completedDays.includes(today);
          return (
            <button
              key={habit.id}
              onClick={() => onToggle(habit.id)}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98]",
                isCompleted 
                  ? "bg-emerald-50 border-emerald-100 shadow-sm" 
                  : "bg-white border-black/5 shadow-sm"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl", habit.color)}>
                  {getHabitIcon(habit.icon)}
                </div>
                <span className={cn("text-sm font-semibold", isCompleted ? "text-emerald-900" : "text-black/70")}>
                  {habit.name}
                </span>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                isCompleted ? "bg-emerald-500 border-emerald-500 text-white" : "border-black/10"
              )}>
                {isCompleted && <CheckCircle size={14} />}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
