import React from 'react';
import { Smile, BarChart3, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavigationProps {
  activeTab: 'home' | 'stats' | 'settings';
  setActiveTab: (tab: 'home' | 'stats' | 'settings') => void;
  setView: (view: 'input' | 'result') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, setView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-black/5 pb-8 pt-4">
      <div className="max-w-md mx-auto px-12 flex justify-between items-center">
        <button 
          onClick={() => { setActiveTab('home'); setView('input'); }}
          className={cn("p-2 transition-all", activeTab === 'home' ? "text-emerald-600 scale-110" : "text-black/30")}
        >
          <Smile size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('stats')}
          className={cn("p-2 transition-all", activeTab === 'stats' ? "text-emerald-600 scale-110" : "text-black/30")}
        >
          <BarChart3 size={24} />
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn("p-2 transition-all", activeTab === 'settings' ? "text-emerald-600 scale-110" : "text-black/30")}
        >
          <Settings size={24} />
        </button>
      </div>
    </nav>
  );
};
