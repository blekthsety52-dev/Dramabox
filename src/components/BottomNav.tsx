import React from 'react';
import { Home, PlaySquare, Compass, Bookmark, Gift } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  savedCount = 0
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'player', label: 'Stream', icon: PlaySquare, isPrimary: true },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'mylist', label: 'My List', icon: Bookmark, badge: savedCount > 0 ? savedCount : undefined },
    { id: 'rewards', label: 'Rewards', icon: Gift }
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-white/10 px-2 pb-safe"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative transition-transform active:scale-95 focus-visible:outline-none ${
                isActive ? 'text-red-500' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.isPrimary ? (
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                    isActive
                      ? 'bg-red-600 text-white scale-105 shadow-red-600/40'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 fill-current" />
                </div>
              ) : (
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 px-1.5 py-0.2 text-[9px] font-bold bg-red-600 text-white rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </div>
              )}
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-semibold text-red-500' : 'font-normal'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
