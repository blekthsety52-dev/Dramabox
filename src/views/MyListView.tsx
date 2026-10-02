import React, { useState } from 'react';
import { Drama, Episode, UserHistoryItem } from '../types/drama';
import { DramaCard } from '../components/DramaCard';
import { Bookmark, History, Play, Trash2, Clock, Sparkles } from 'lucide-react';

interface MyListViewProps {
  dramas: Drama[];
  favorites: string[];
  watchHistory: UserHistoryItem[];
  onSelectDrama: (drama: Drama) => void;
  onPlayDrama: (drama: Drama, episode?: Episode) => void;
  onToggleFavorite: (dramaId: string) => void;
  onClearHistory: () => void;
  onNavigateHome: () => void;
}

export const MyListView: React.FC<MyListViewProps> = ({
  dramas,
  favorites,
  watchHistory,
  onSelectDrama,
  onPlayDrama,
  onToggleFavorite,
  onClearHistory,
  onNavigateHome
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'history'>('watchlist');

  const favoriteDramas = dramas.filter((d) => favorites.includes(d.id));

  const historyItems = watchHistory
    .map((item) => {
      const drama = dramas.find((d) => d.id === item.dramaId);
      if (!drama) return null;
      return { item, drama };
    })
    .filter(Boolean) as { item: UserHistoryItem; drama: Drama }[];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-12 pt-4 px-4 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            My Library
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Your saved dramas, bookmarks, and watching history
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-white/10 mb-6 text-sm">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`py-3 font-semibold relative transition-colors flex items-center gap-2 ${
            activeTab === 'watchlist' ? 'text-red-500' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Watchlist ({favoriteDramas.length})</span>
          {activeTab === 'watchlist' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 font-semibold relative transition-colors flex items-center gap-2 ${
            activeTab === 'history' ? 'text-red-500' : 'text-slate-400 hover:text-white'
          }`}
        >
          <History className="w-4 h-4" />
          <span>History ({historyItems.length})</span>
          {activeTab === 'history' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'watchlist' ? (
        <div>
          {favoriteDramas.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center text-slate-400 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Your Watchlist is Empty</h3>
              <p className="text-xs text-slate-400 mb-6">
                Save the most dramatic, addictive short drama series to watch whenever you have a free minute.
              </p>
              <button
                onClick={onNavigateHome}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Trending Dramas</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
              {favoriteDramas.map((drama) => (
                <DramaCard
                  key={drama.id}
                  drama={drama}
                  onSelect={onSelectDrama}
                  onPlay={onPlayDrama}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={true}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {historyItems.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center text-slate-400 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <History className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">No Watch History Yet</h3>
              <p className="text-xs text-slate-400 mb-6">
                Start watching any drama and your progress will automatically save here so you never lose your place.
              </p>
              <button
                onClick={onNavigateHome}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Streaming Now</span>
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={onClearHistory}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All History</span>
                </button>
              </div>

              <div className="space-y-3">
                {historyItems.map(({ item, drama }) => {
                  const percent = Math.min(
                    100,
                    Math.round((item.progressSeconds / (item.durationSeconds || 90)) * 100)
                  );

                  return (
                    <div
                      key={item.dramaId}
                      className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors group cursor-pointer"
                      onClick={() => onPlayDrama(drama)}
                    >
                      {/* Poster */}
                      <div className="w-16 h-22 rounded-xl overflow-hidden bg-slate-800 shrink-0 relative">
                        <img
                          src={drama.coverImage}
                          alt={drama.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors">
                          {drama.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <span className="text-red-400 font-semibold">
                            Episode {item.episodeNumber}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {percent}% watched
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full max-w-xs h-1.5 bg-white/10 rounded-full overflow-hidden mt-2">
                          <div
                            style={{ width: `${percent}%` }}
                            className="h-full bg-red-600 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Resume Action */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayDrama(drama);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0 transition-transform active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">Resume</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
