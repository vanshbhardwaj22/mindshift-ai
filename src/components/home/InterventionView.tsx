import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Sparkles, 
  Ghost, 
  Quote, 
  Music, 
  Wind, 
  CheckCircle, 
  ShieldAlert 
} from 'lucide-react';
import { Mood } from '../../types';
import { cn } from '../../lib/utils';

interface InterventionViewProps {
  currentMood: Mood | null;
  intervention: any;
  streak: number;
  isChallenging: boolean;
  challengeTimer: number;
  startChallenge: () => void;
  handleRetryIntervention: () => void;
  isAnalyzing: boolean;
  setView: (view: 'input' | 'result') => void;
}

export const InterventionView: React.FC<InterventionViewProps> = ({
  currentMood,
  intervention,
  streak,
  isChallenging,
  challengeTimer,
  startChallenge,
  handleRetryIntervention,
  isAnalyzing,
  setView
}) => {
  return (
    <motion.div
      key="result-view"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-8"
    >
      {/* Streak Badge */}
      <div className="flex justify-center">
        <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-2xl flex items-center gap-2 shadow-sm">
          <Zap size={16} className="fill-orange-500" />
          <span className="text-sm font-bold">Self-Control Streak: {streak}</span>
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles size={12} />
          Mood Detected: {currentMood}
        </div>
        <h2 className="text-3xl font-light">Flow <span className="italic serif">Restored</span></h2>
      </div>

      <section className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-2xl shadow-emerald-900/5 space-y-6 relative overflow-hidden">
        {isChallenging ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-black/5"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="377"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: 377 * (1 - challengeTimer / 20) }}
                  className="text-emerald-500"
                />
              </svg>
              <span className="text-4xl font-bold">{challengeTimer}s</span>
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-xl">Stay Strong</h3>
              <p className="text-black/50 text-sm italic serif">The urge is temporary. You are permanent.</p>
            </div>
            <div className="w-full bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">Alternative Action:</p>
              <p className="text-sm text-emerald-800 font-medium">Take 5 deep breaths and drink a glass of water.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              {intervention.type === 'joke' && <Ghost size={120} />}
              {intervention.type === 'quote' && <Quote size={120} />}
              {intervention.type === 'song' && <Music size={120} />}
              {intervention.type === 'exercise' && <Wind size={120} />}
              {intervention.type === 'task' && <CheckCircle size={120} />}
              {intervention.type === 'self-control' && <ShieldAlert size={120} />}
            </div>

            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-2xl",
                intervention.type === 'self-control' ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
              )}>
                {intervention.type === 'joke' && <Ghost size={24} />}
                {intervention.type === 'quote' && <Quote size={24} />}
                {intervention.type === 'song' && <Music size={24} />}
                {intervention.type === 'exercise' && <Wind size={24} />}
                {intervention.type === 'task' && <CheckCircle size={24} />}
                {intervention.type === 'self-control' && <ShieldAlert size={24} />}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-black/30">{intervention.type}</p>
                <h3 className="font-semibold text-xl">{intervention.title}</h3>
                {intervention.metadata?.artist && (
                  <p className="text-xs text-black/50 font-medium italic serif">by {intervention.metadata.artist}</p>
                )}
              </div>
            </div>

            <p className="text-black/70 leading-relaxed italic serif text-2xl">
              "{intervention.content}"
            </p>

            {intervention.metadata?.reason && (
              <p className="text-xs text-black/40 font-medium bg-black/5 p-3 rounded-xl">
                <span className="font-bold uppercase tracking-tighter mr-1">Why:</span>
                {intervention.metadata.reason}
              </p>
            )}

            <div className="pt-6 flex gap-3">
              <button 
                onClick={() => {
                  if (intervention.type === 'song' && intervention.metadata?.search_query) {
                    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(intervention.metadata.search_query)}`, '_blank');
                  } else if (intervention.type === 'self-control') {
                    startChallenge();
                  }
                }}
                className={cn(
                  "flex-1 py-4 text-white rounded-2xl font-semibold shadow-lg active:scale-95 transition-all",
                  intervention.type === 'self-control' ? "bg-red-600 shadow-red-600/20" : "bg-emerald-600 shadow-emerald-600/20"
                )}
              >
                {intervention.action_label}
              </button>
              <button 
                onClick={handleRetryIntervention}
                disabled={isAnalyzing}
                className="flex-1 py-4 bg-black/5 text-black/60 rounded-2xl font-semibold active:scale-95 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? "Loading..." : "Try another"}
              </button>
            </div>
          </>
        )}
      </section>

      <button 
        onClick={() => setView('input')}
        className="w-full py-4 text-sm font-medium text-black/40 hover:text-black/60 transition-colors"
      >
        Log another mood
      </button>
    </motion.div>
  );
};
