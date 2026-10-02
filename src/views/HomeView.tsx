import React, { useState, useMemo } from 'react';
import { Drama, Episode, UserHistoryItem } from '../types/drama';
import { DramaCard } from '../components/DramaCard';
import { CATEGORIES } from '../data/dramasData';
import { Play, Bookmark, Star, Sparkles, TrendingUp, History, Clock, Film } from 'lucide-react';

interface HomeViewProps {
  dramas: Drama[];
  onSelectDrama: (drama: Drama) => void;
  onPlayDrama: (drama: Drama, episode?: Episode) => void;
  favorites: string[];
  onToggleFavorite: (dramaId: string) => void;
  watchHistory: UserHistoryItem[];
  onOpenRewards: () => void;
  onOpenPromo: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  dramas,
  onSelectDrama,
  onPlayDrama,
  favorites,
  onToggleFavorite,
  watchHistory,
  onOpenRewards,
  onOpenPromo
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Featured Drama for the top hero banner
  const featuredDrama = dramas[0];

  const filteredDramas = useMemo(() => {
    if (selectedCategory === 'All') return dramas;
    if (selectedCategory === 'Trending') return dramas.filter((d) => d.isTrending);
    return dramas.filter((d) => d.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [dramas, selectedCategory]);

  // Continue Watching dramas matched from history
  const continueWatchingItems = useMemo(() => {
    return watchHistory
      .map((item) => {
        const drama = dramas.find((d) => d.id === item.dramaId);
        if (!drama) return null;
        return { item, drama };
      })
      .filter(Boolean) as { item: UserHistoryItem; drama: Drama }[];
  }, [watchHistory, dramas]);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-12">
      {/* Featured Drama Hero Banner */}
      {featuredDrama && (
        <section className="relative w-full max-w-7xl mx-auto px-4 pt-4 sm:pt-6">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl h-[420px] sm:h-[480px]">
            {/* Backdrop Image */}
            <img
              src={featuredDrama.coverImage}
              alt={featuredDrama.title}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-65 scale-105"
            />

            {/* Gradient Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />

            {/* Content Lockup */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-red-600/30">
                  <TrendingUp className="w-3 h-3" />
                  #1 Trending Drama
                </span>
                <span className="text-xs text-slate-300">
                  {featuredDrama.views} Views
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                {featuredDrama.title}
              </h1>

              {/* Quiet unboxed metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-2 font-medium">
                <span className="flex items-center gap-1 text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span>{featuredDrama.rating}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>{featuredDrama.category}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredDrama.totalEpisodes} Episodes</span>
                <span aria-hidden="true">·</span>
                <span>{featuredDrama.status}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 mt-2.5 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow">
                {featuredDrama.synopsis}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={() => onPlayDrama(featuredDrama)}
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-red-600/30 transition-all"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Watch Ep. 1 Free</span>
                </button>

                <button
                  onClick={() => onSelectDrama(featuredDrama)}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/10 transition-colors"
                >
                  Details
                </button>

                <button
                  onClick={onOpenPromo}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-red-600/30 to-amber-600/20 hover:from-red-600/40 hover:to-amber-600/30 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-red-500/40 transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Film className="w-4 h-4 text-red-400" />
                  <span className="hidden sm:inline">Animated Promo</span>
                  <span className="sm:hidden">Promo</span>
                </button>

                <button
                  onClick={() => onToggleFavorite(featuredDrama.id)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-md border transition-colors ${
                    favorites.includes(featuredDrama.id)
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  }`}
                  aria-label="Add to Watchlist"
                >
                  <Bookmark className={`w-4 h-4 ${favorites.includes(featuredDrama.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 mt-8 space-y-8">
        {/* Continue Watching Section */}
        {continueWatchingItems.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-red-500" />
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Continue Watching
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {continueWatchingItems.slice(0, 5).map(({ item, drama }) => {
                const percent = Math.min(
                  100,
                  Math.round((item.progressSeconds / (item.durationSeconds || 90)) * 100)
                );
                return (
                  <div
                    key={item.dramaId}
                    onClick={() => onPlayDrama(drama)}
                    className="group relative cursor-pointer flex flex-col bg-slate-900 border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all"
                  >
                    <div className="aspect-[16/9] w-full relative overflow-hidden bg-slate-800">
                      <img
                        src={drama.coverImage}
                        alt={drama.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      {/* Progress Bar along bottom of thumbnail */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div
                          style={{ width: `${percent}%` }}
                          className="h-full bg-red-600"
                        />
                      </div>
                    </div>

                    <div className="p-2.5">
                      <h4 className="text-xs font-semibold text-white truncate group-hover:text-red-400 transition-colors">
                        {drama.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                        <span className="text-red-400 font-semibold">
                          Ep. {item.episodeNumber}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {percent}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Category Segmented Filter Tabs */}
        <section>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all focus-visible:outline-none ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Top Leaderboard / Trending Dramas */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-red-500" />
                <span>Top Weekly Leaderboard</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Most watched vertical short dramas ranked by viewership
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
            {dramas.map((drama) => (
              <DramaCard
                key={drama.id}
                drama={drama}
                showRank={true}
                onSelect={onSelectDrama}
                onPlay={onPlayDrama}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.includes(drama.id)}
              />
            ))}
          </div>
        </section>

        {/* VIP Rewards Teaser Banner */}
        <section className="p-5 rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/60 border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Binge Without Boundaries
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Collect daily coins or start your 3-day VIP trial to unlock 500+ episodes today.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenRewards}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg transition-all whitespace-nowrap active:scale-95"
          >
            Claim Free Coins & VIP
          </button>
        </section>

        {/* Filtered Drama Collection */}
        {selectedCategory !== 'All' && (
          <section>
            <div className="mb-4">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {selectedCategory} Dramas ({filteredDramas.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
              {filteredDramas.map((drama) => (
                <DramaCard
                  key={drama.id}
                  drama={drama}
                  onSelect={onSelectDrama}
                  onPlay={onPlayDrama}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={favorites.includes(drama.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
