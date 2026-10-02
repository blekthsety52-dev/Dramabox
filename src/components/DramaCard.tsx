import React, { useState } from 'react';
import { Drama } from '../types/drama';
import { Play, Bookmark, Star, Eye } from 'lucide-react';

interface DramaCardProps {
  drama: Drama;
  onSelect: (drama: Drama) => void;
  onPlay: (drama: Drama) => void;
  onToggleFavorite?: (dramaId: string) => void;
  isFavorite?: boolean;
  showRank?: boolean;
}

export const DramaCard: React.FC<DramaCardProps> = ({
  drama,
  onSelect,
  onPlay,
  onToggleFavorite,
  isFavorite = false,
  showRank = false
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onSelect(drama)}
      className="group relative cursor-pointer flex flex-col focus-visible:outline-none"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-slate-800 shadow-md group-hover:shadow-red-600/10 group-hover:shadow-xl transition-all duration-300">
        {!imageError ? (
          <img
            src={drama.coverImage}
            alt={drama.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-center">
            <span className="text-red-500 font-bold text-xs tracking-wider uppercase mb-1">DramaBox Original</span>
            <span className="text-white text-sm font-semibold line-clamp-2">{drama.title}</span>
          </div>
        )}

        {/* Ambient measured gradient scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-black/20 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto">
          {showRank && drama.rank ? (
            <span className="w-6 h-6 rounded-md bg-red-600 text-white font-extrabold text-xs flex items-center justify-center shadow-lg">
              {drama.rank}
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-white/90 drop-shadow">
              {drama.status}
            </span>
          )}

          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(drama.id);
              }}
              aria-label="Bookmark drama"
              className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
                isFavorite
                  ? 'bg-red-600 text-white'
                  : 'bg-black/40 hover:bg-black/70 text-white/90'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
          )}
        </div>

        {/* Bottom Poster Info Overlay */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/90 pointer-events-none drop-shadow">
          <span className="flex items-center gap-1 font-medium">
            <Eye className="w-3 h-3 text-red-400" />
            <span>{drama.views}</span>
          </span>
          <span className="font-semibold text-amber-300 flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
            <span>{drama.rating}</span>
          </span>
        </div>

        {/* Hover Quick Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(drama);
            }}
            className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-600/40 hover:scale-110 active:scale-95 transition-transform"
            aria-label={`Play ${drama.title}`}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>
      </div>

      {/* Title & Metadata without pill boxes */}
      <div className="mt-2.5">
        <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
          {drama.title}
        </h3>
        {/* Clean unboxed text with typographic separators */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
          <span>{drama.category}</span>
          <span aria-hidden="true">·</span>
          <span>{drama.totalEpisodes} Eps</span>
        </div>
      </div>
    </div>
  );
};
