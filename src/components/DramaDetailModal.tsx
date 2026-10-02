import React, { useState } from 'react';
import { Drama, Episode } from '../types/drama';
import { X, Play, Bookmark, Star, Eye, Calendar, Lock, Volume2 } from 'lucide-react';

interface DramaDetailModalProps {
  drama: Drama | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayEpisode: (drama: Drama, episode: Episode) => void;
  savedEpisodeNumber?: number;
  isFavorite: boolean;
  onToggleFavorite: (dramaId: string) => void;
  unlockedEpisodeIds: number[];
  vipActive: boolean;
  onUnlockEpisode: (episode: Episode) => void;
}

export const DramaDetailModal: React.FC<DramaDetailModalProps> = ({
  drama,
  isOpen,
  onClose,
  onPlayEpisode,
  savedEpisodeNumber,
  isFavorite,
  onToggleFavorite,
  unlockedEpisodeIds,
  vipActive,
  onUnlockEpisode
}) => {
  const [activeTab, setActiveTab] = useState<'episodes' | 'about'>('episodes');
  const [activeRange, setActiveRange] = useState<number>(0);

  if (!isOpen || !drama) return null;

  const totalEps = drama.totalEpisodes;
  const rangeSize = 30;
  const numRanges = Math.ceil(totalEps / rangeSize);
  const ranges = Array.from({ length: numRanges }, (_, i) => {
    const start = i * rangeSize + 1;
    const end = Math.min((i + 1) * rangeSize, totalEps);
    return { index: i, label: `${start}-${end}`, start, end };
  });

  const currentRangeObj = ranges[activeRange] || ranges[0];
  const episodesInCurrentRange: { epNum: number; episodeData?: Episode }[] = [];

  for (let num = currentRangeObj.start; num <= currentRangeObj.end; num++) {
    const epData = drama.episodes.find((e) => e.episodeNumber === num);
    episodesInCurrentRange.push({ epNum: num, episodeData: epData });
  }

  const isUnlocked = (epNum: number, epData?: Episode) => {
    if (vipActive) return true;
    if (epNum <= 4) return true;
    if (epData && !epData.isLocked) return true;
    if (epData && unlockedEpisodeIds.includes(epData.id)) return true;
    return false;
  };

  const handleStartWatching = () => {
    const epNumToPlay = savedEpisodeNumber || 1;
    const targetEp = drama.episodes.find((e) => e.episodeNumber === epNumToPlay) || {
      id: epNumToPlay * 100,
      episodeNumber: epNumToPlay,
      title: `Episode ${epNumToPlay}`,
      duration: 90,
      videoUrl: drama.episodes[0].videoUrl,
      isLocked: false
    };
    onPlayEpisode(drama, targetEp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full sm:max-w-2xl bg-slate-900 border border-white/10 rounded-none sm:rounded-2xl shadow-2xl flex flex-col max-h-screen sm:max-h-[90vh] overflow-hidden animate-fade-in text-white my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Section */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-b from-slate-800 to-slate-900 border-b border-white/10">
          <div className="flex gap-4 sm:gap-6 items-start">
            {/* Poster */}
            <div className="w-28 sm:w-36 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl shrink-0 bg-slate-800 relative">
              <img
                src={drama.coverImage}
                alt={drama.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
                {drama.category}
              </span>
              <h2 className="text-lg sm:text-2xl font-bold text-white mt-1 leading-tight">
                {drama.title}
              </h2>

              {/* Quiet unboxed metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-2 font-medium">
                <span className="flex items-center gap-1 text-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                  <span>{drama.rating}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>{drama.views}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>{drama.totalEpisodes} Episodes</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{drama.releaseYear}</span>
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {drama.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={handleStartWatching}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {savedEpisodeNumber ? `Resume Ep. ${savedEpisodeNumber}` : 'Watch Ep. 1'}
                  </span>
                </button>

                <button
                  onClick={() => onToggleFavorite(drama.id)}
                  className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors ${
                    isFavorite
                      ? 'bg-red-600/10 border-red-500 text-red-400'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? 'Saved' : 'Watchlist'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 border-b border-white/10 flex items-center gap-6 bg-slate-900 text-sm">
          <button
            onClick={() => setActiveTab('episodes')}
            className={`py-3 font-semibold relative transition-colors ${
              activeTab === 'episodes' ? 'text-red-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            Episodes ({drama.totalEpisodes})
            {activeTab === 'episodes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 font-semibold relative transition-colors ${
              activeTab === 'about' ? 'text-red-500' : 'text-slate-400 hover:text-white'
            }`}
          >
            Details & Cast
            {activeTab === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'episodes' ? (
            <div>
              {/* Range Tabs */}
              {ranges.length > 1 && (
                <div className="flex items-center gap-1.5 pb-3 overflow-x-auto no-scrollbar">
                  {ranges.map((r) => (
                    <button
                      key={r.index}
                      onClick={() => setActiveRange(r.index)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                        activeRange === r.index
                          ? 'bg-red-600 text-white font-semibold'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Episode Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {episodesInCurrentRange.map(({ epNum, episodeData }) => {
                  const isCurrent = epNum === (savedEpisodeNumber || 1);
                  const unlocked = isUnlocked(epNum, episodeData);

                  return (
                    <button
                      key={epNum}
                      onClick={() => {
                        const ep = episodeData || {
                          id: epNum * 100,
                          episodeNumber: epNum,
                          title: `Episode ${epNum}`,
                          duration: 90,
                          videoUrl: drama.episodes[0].videoUrl,
                          isLocked: !unlocked,
                          requiredCoins: 10
                        };
                        if (unlocked) {
                          onPlayEpisode(drama, ep);
                          onClose();
                        } else {
                          onUnlockEpisode(ep);
                        }
                      }}
                      className={`relative aspect-square rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                          : unlocked
                          ? 'bg-white/5 hover:bg-white/10 text-slate-200'
                          : 'bg-white/[0.02] text-slate-500 hover:bg-white/5 border border-dashed border-white/10'
                      }`}
                    >
                      <span>{epNum}</span>
                      {isCurrent ? (
                        <Volume2 className="w-3 h-3 mt-0.5 text-white animate-pulse" />
                      ) : !unlocked ? (
                        <Lock className="w-2.5 h-2.5 text-amber-400 absolute top-1 right-1" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-sm">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Synopsis
                </h4>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                  {drama.synopsis}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Lead Cast
                </h4>
                <div className="flex flex-wrap gap-2">
                  {drama.cast.map((actor) => (
                    <span
                      key={actor}
                      className="px-3 py-1 rounded-lg bg-white/5 text-slate-300 text-xs border border-white/5"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
