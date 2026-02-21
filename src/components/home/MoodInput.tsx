import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Send, Zap } from 'lucide-react';
import { Mood } from '../../types';
import { MOOD_OPTIONS } from '../../constants';
import { cn } from '../../lib/utils';

interface MoodInputProps {
  input: string;
  setInput: (val: string) => void;
  isRecording: boolean;
  toggleRecording: () => void;
  isAnalyzing: boolean;
  handleAnalyze: () => void;
  handleManualMood: (mood: Mood) => void;
  clarificationNeeded: boolean;
}

export const MoodInput: React.FC<MoodInputProps> = ({
  input,
  setInput,
  isRecording,
  toggleRecording,
  isAnalyzing,
  handleAnalyze,
  handleManualMood,
  clarificationNeeded
}) => {
  return (
    <motion.div
      key="input-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <section className="text-center">
        <h2 className="text-3xl font-light leading-tight">
          How are you <span className="italic serif">feeling</span>?
        </h2>
        <p className="text-black/50 mt-2 text-sm">Select a mood or tell me what's on your mind.</p>
      </section>

      {/* Manual Grid */}
      <section className="grid grid-cols-3 gap-3">
        {MOOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleManualMood(opt.value)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-2xl border border-black/5 shadow-sm transition-all hover:scale-105 active:scale-95",
              opt.color
            )}
          >
            {opt.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider mt-2 text-center leading-tight">
              {opt.label}
            </span>
          </button>
        ))}
      </section>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-black/5"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#F5F5F0] px-4 text-xs font-medium text-black/30 uppercase tracking-widest">or express yourself</span>
        </div>
      </div>

      {/* Text & Voice Input */}
      <section className="space-y-4">
        <AnimatePresence>
          {clarificationNeeded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-orange-50 border border-orange-200 p-4 rounded-2xl text-orange-800 text-sm"
            >
              <p className="font-semibold flex items-center gap-2">
                <Zap size={16} className="text-orange-500" />
                I'm not quite sure I follow...
              </p>
              <p className="mt-1 opacity-80">Could you tell me a bit more about how you're feeling? I want to make sure I give you the right flow.</p>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your flow..."
            className="w-full h-32 p-4 bg-white rounded-2xl border border-black/5 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all resize-none"
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={toggleRecording}
              className={cn(
                "p-3 rounded-xl transition-all",
                isRecording ? "bg-red-500 text-white animate-pulse" : "bg-black/5 text-black/40 hover:bg-black/10"
              )}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !input.trim()}
              className={cn(
                "p-3 rounded-xl transition-all",
                input.trim() ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-black/5 text-black/20"
              )}
            >
              {isAnalyzing ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Zap size={20} />
                </motion.div>
              ) : (
                <Send size={20} />
              )}
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
