import React, { useState, useMemo } from 'react';
import { Drama } from '../types/drama';
import { DramaCard } from '../components/DramaCard';
import { Search, Compass, SlidersHorizontal, Star } from 'lucide-react';

interface DiscoverViewProps {
  dramas: Drama[];
  onSelectDrama: (drama: Drama) => void;
  onPlayDrama: (drama: Drama) => void;
  favorites: string[];
  onToggleFavorite: (dramaId: string) => void;
  onOpenSearch: () => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  dramas,
  onSelectDrama,
  onPlayDrama,
  favorites,
  onToggleFavorite,
  onOpenSearch
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Updating'>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'episodes'>('popular');

  const genres = ['All', 'Billionaire', 'Romance', 'Werewolf', 'Revenge', 'Action'];

  const filteredDramas = useMemo(() => {
    return dramas
      .filter((d) => {
        if (selectedGenre !== 'All' && d.category.toLowerCase() !== selectedGenre.toLowerCase()) {
          return false;
        }
        if (statusFilter !== 'All' && d.status !== statusFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'episodes') return b.totalEpisodes - a.totalEpisodes;
        return (b.rank || 99) - (a.rank || 99);
      });
  }, [dramas, selectedGenre, statusFilter, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-12 pt-4 px-4 max-w-7xl mx-auto">
      {/* Search Header Banner */}
      <div className="relative mb-6">
        <button
          onClick={onOpenSearch}
          className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 text-xs sm:text-sm flex items-center justify-between transition-colors shadow-lg"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-red-500" />
            <span>Search &quot;Billionaire Heir&quot;, &quot;Alpha King&quot;, &quot;Heiress Revenge&quot;...</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-white/10 text-[11px] font-medium text-slate-300">
            Search
          </span>
        </button>
      </div>

      {/* Title & Tagline */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 tracking-tight">
            <Compass className="w-5 h-5 text-red-500" />
            <span>Discover Dramas</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Browse our catalog of high-tension vertical dramas
          </p>
        </div>
      </div>

      {/* Genre Filters (Segmented horizontal buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedGenre === genre
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Filter Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-white/10 mb-6 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>Status:</span>
          {(['All', 'Completed', 'Updating'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-1 rounded-md transition-colors ${
                statusFilter === st ? 'bg-white/10 text-white font-bold' : 'hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
          >
            <option value="popular" className="bg-slate-900">Most Popular</option>
            <option value="rating" className="bg-slate-900">Top Rated</option>
            <option value="episodes" className="bg-slate-900">Most Episodes</option>
          </select>
        </div>
      </div>

      {/* Grid of Results */}
      {filteredDramas.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <Star className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No dramas found matching your criteria</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};
