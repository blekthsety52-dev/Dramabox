import React, { useState, useMemo } from 'react';
import { Drama } from '../types/drama';
import { Search, X, Play, TrendingUp, Star, Eye } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  dramas: Drama[];
  onSelectDrama: (drama: Drama) => void;
  onPlayDrama: (drama: Drama) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  dramas,
  onSelectDrama,
  onPlayDrama
}) => {
  const [query, setQuery] = useState('');

  const trendingKeywords = [
    'Billionaire',
    'Secret Identity',
    'Werewolf Alpha',
    'Revenge',
    'Contract Marriage',
    'God of War'
  ];

  const filteredDramas = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return dramas.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.synopsis.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)) ||
        d.cast.some((c) => c.toLowerCase().includes(q))
    );
  }, [query, dramas]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-16">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in text-white">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-red-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, genre, actor, or plot hook..."
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
        </div>

        {/* Search Results or Trending Tags */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {!query.trim() ? (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingKeywords.map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setQuery(kw)}
                    className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs text-slate-300 border border-white/5 transition-colors"
                  >
                    {kw}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Recommended For You
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dramas.slice(0, 3).map((drama) => (
                    <div
                      key={drama.id}
                      onClick={() => {
                        onSelectDrama(drama);
                        onClose();
                      }}
                      className="cursor-pointer group flex flex-col"
                    >
                      <div className="aspect-[3/4] rounded-lg overflow-hidden relative bg-slate-800">
                        <img
                          src={drama.coverImage}
                          alt={drama.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute bottom-1.5 left-1.5 text-[10px] text-white font-medium">
                          {drama.totalEpisodes} Eps
                        </span>
                      </div>
                      <span className="text-xs font-medium text-white truncate mt-1.5 group-hover:text-red-400 transition-colors">
                        {drama.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredDramas.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
              <Search className="w-10 h-10 mb-3 opacity-30 text-slate-500" />
              <p className="text-sm font-medium">No dramas found matching &quot;{query}&quot;</p>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for &quot;Billionaire&quot;, &quot;Revenge&quot;, or &quot;Werewolf&quot;
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 mb-1">
                Found {filteredDramas.length} drama{filteredDramas.length > 1 ? 's' : ''}
              </div>
              {filteredDramas.map((drama) => (
                <div
                  key={drama.id}
                  onClick={() => {
                    onSelectDrama(drama);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors group"
                >
                  <img
                    src={drama.coverImage}
                    alt={drama.title}
                    className="w-12 h-16 rounded-lg object-cover bg-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-red-400 transition-colors">
                      {drama.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>{drama.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5 text-amber-300">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {drama.rating}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3 h-3 text-slate-400" />
                        {drama.views}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                      {drama.synopsis}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayDrama(drama);
                      onClose();
                    }}
                    className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shrink-0 shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
