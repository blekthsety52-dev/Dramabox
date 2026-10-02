import React from 'react';
import { Search, Coins, Sparkles, Smartphone, Monitor, Film } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSearch: () => void;
  onOpenRewards: () => void;
  onOpenPromo: () => void;
  coins: number;
  vipActive: boolean;
  desktopViewMode: 'phone' | 'fluid';
  onToggleViewMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenSearch,
  onOpenRewards,
  onOpenPromo,
  coins,
  vipActive,
  desktopViewMode,
  onToggleViewMode
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity flex items-center gap-1.5 focus-visible:outline-none"
        >
          <span className="text-red-500 font-black">DRAMA</span>
          <span className="text-white font-extrabold">BOX</span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectTab('home')}
            className={`transition-colors hover:text-white ${currentTab === 'home' ? 'text-red-500 font-semibold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('player')}
            className={`transition-colors hover:text-white ${currentTab === 'player' ? 'text-red-500 font-semibold' : ''}`}
          >
            Stream
          </button>
          <button
            onClick={() => onSelectTab('discover')}
            className={`transition-colors hover:text-white ${currentTab === 'discover' ? 'text-red-500 font-semibold' : ''}`}
          >
            Discover
          </button>
          <button
            onClick={() => onSelectTab('mylist')}
            className={`transition-colors hover:text-white ${currentTab === 'mylist' ? 'text-red-500 font-semibold' : ''}`}
          >
            My List
          </button>
          <button
            onClick={() => onSelectTab('rewards')}
            className={`transition-colors hover:text-white ${currentTab === 'rewards' ? 'text-red-500 font-semibold' : ''}`}
          >
            VIP & Coins
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          {/* Animated Promo Studio Button */}
          <button
            onClick={onOpenPromo}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-gradient-to-r from-red-600/30 to-rose-600/20 hover:from-red-600/50 hover:to-rose-600/30 text-red-300 hover:text-white text-xs font-semibold border border-red-500/40 transition-all shadow-sm"
          >
            <Film className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="hidden sm:inline">Promo Video</span>
            <span className="sm:hidden">Promo</span>
          </button>

          {/* Desktop Frame Switcher */}
          <button
            onClick={onToggleViewMode}
            title={desktopViewMode === 'phone' ? 'Switch to Fluid Desktop View' : 'Switch to Mobile App Preview'}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 transition-colors border border-white/5"
          >
            {desktopViewMode === 'phone' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px]">Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px]">Phone</span>
              </>
            )}
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            aria-label="Search Dramas"
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-white/5"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Coins / VIP Wallet Badge */}
          <button
            onClick={onOpenRewards}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              vipActive
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40 hover:border-amber-500/60'
                : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
            }`}
          >
            {vipActive ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>VIP Active</span>
              </>
            ) : (
              <>
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{coins}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
