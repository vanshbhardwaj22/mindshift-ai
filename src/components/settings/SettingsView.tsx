import React from 'react';
import { motion } from 'motion/react';

interface SettingsViewProps {
  setHistory: (history: any[]) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ setHistory }) => {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-light">App <span className="italic serif">Settings</span></h2>

      <section className="bg-white p-6 rounded-[2.5rem] border border-black/5 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-black/30">Data Management</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-black/5 rounded-2xl">
              <div>
                <p className="text-sm font-semibold">Auto-Cleanup</p>
                <p className="text-[10px] text-black/40">Delete logs older than 30 days</p>
              </div>
              <div className="w-10 h-6 bg-emerald-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>
            <button
              onClick={() => setHistory([])}
              className="w-full p-4 bg-red-50 text-red-600 text-sm font-semibold rounded-2xl border border-red-100 active:scale-95 transition-all"
            >
              Clear All History
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-black/30">Privacy</h3>
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100">
            <p className="text-xs leading-relaxed">
              Your mood data is processed locally and via Gemini AI. We do not store your personal identity with your emotional logs.
            </p>
          </div>
        </div>
      </section>

      <div className="text-center">
        <p className="text-[10px] text-black/20 font-bold uppercase tracking-widest">MindShift AI v1.0.0</p>
      </div>
    </motion.div>
  );
};
