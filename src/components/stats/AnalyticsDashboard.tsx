import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Brain, 
  Target, 
  ShieldAlert, 
  History as HistoryIcon 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { MoodEntry, MoodInsights } from '../../types';
import { COLORS, MOOD_OPTIONS } from '../../constants';
import { cn } from '../../lib/utils';

interface AnalyticsDashboardProps {
  history: MoodEntry[];
  insights: MoodInsights | null;
  isGeneratingInsights: boolean;
  handleGenerateInsights: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  history,
  insights,
  isGeneratingInsights,
  handleGenerateInsights
}) => {
  const getMoodData = () => {
    const counts: Record<string, number> = {};
    history.forEach(h => {
      counts[h.mood] = (counts[h.mood] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  return (
    <motion.div
      key="stats"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light">Mood <span className="italic serif">Analytics</span></h2>
        <button 
          onClick={handleGenerateInsights}
          disabled={isGeneratingInsights || history.length === 0}
          className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-50"
        >
          {isGeneratingInsights ? "Analyzing..." : "AI Insights"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-3xl border border-black/5 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-black/30">
            <Target size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Productivity</span>
          </div>
          <p className="text-2xl font-semibold">{insights?.productivityScore || '--'}%</p>
        </div>
        <div className="bg-white p-4 rounded-3xl border border-black/5 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-black/30">
            <ShieldAlert size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Discipline</span>
          </div>
          <p className="text-2xl font-semibold">{insights?.disciplineIndex || '--'}%</p>
        </div>
      </div>

      {/* Mood Frequency Chart */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-black/30 flex items-center gap-2">
          <TrendingUp size={16} />
          Mood Frequency
        </h3>
        <div className="h-64 w-full">
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getMoodData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {getMoodData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-black/20 italic text-sm">
              Log some moods to see patterns
            </div>
          )}
        </div>
      </section>

      {/* AI Insights Section */}
      <AnimatePresence>
        {insights && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-900 text-white p-8 rounded-[2.5rem] shadow-xl space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Brain size={20} />
              </div>
              <h3 className="font-semibold text-lg">AI Flow Insights</h3>
            </div>
            
            <p className="text-emerald-100/80 leading-relaxed italic serif text-lg">
              "{insights.summary}"
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Detected Patterns</p>
                <ul className="space-y-1">
                  {insights.patterns.map((p, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Recommendations</p>
                <ul className="space-y-1">
                  {insights.recommendations.map((r, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Recent History List */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-black/30 flex items-center gap-2">
          <HistoryIcon size={16} />
          Recent History
        </h3>
        <div className="space-y-3">
          {history.map(entry => (
            <div key={entry.id} className="bg-white p-4 rounded-2xl border border-black/5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-10 rounded-full",
                  COLORS[MOOD_OPTIONS.findIndex(o => o.value === entry.mood) % COLORS.length] || 'bg-gray-200'
                )} />
                <div>
                  <p className="font-semibold text-sm">{entry.mood}</p>
                  <p className="text-[10px] text-black/30 font-bold uppercase tracking-wider">
                    {new Date(entry.timestamp).toLocaleDateString()} • {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs italic serif text-black/60 truncate max-w-[120px]">{entry.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
