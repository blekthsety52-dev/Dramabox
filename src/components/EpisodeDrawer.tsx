import React, { useState } from 'react';
import { Drama, Episode } from '../types/drama';
import { X, Lock, CheckCircle2, Sparkles, Volume2 } from 'lucide-react';

interface EpisodeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  drama: Drama;
  currentEpisodeNumber: number;
  onSelectEpisode: (episode: Episode) => void;
  unlockedEpisodeIds: number[];
  vipActive: boolean;
  coins: number;
  onUnlockEpisode: (episode: Episode) => void;
}

export const EpisodeDrawer: React.FC<EpisodeDrawerProps> = ({
  isOpen,
  onClose,
  drama,
  currentEpisodeNumber,
  onSelectEpisode,
  unlockedEpisodeIds,
  vipActive,
  coins,
  onUnlockEpisode
}) => {
  const [activeRange, setActiveRange] = useState<number>(0);

  if (!isOpen) return null;

  // Generate complete list of episodes up to totalEpisodes
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

  const isEpisodeUnlocked = (epNum: number, epData?: Episode) => {
    if (vipActive) return true;
    if (epNum <= 4) return true; // first 4 are always free teaser episodes
    if (epData && !epData.isLocked) return true;
    if (epData && unlockedEpisodeIds.includes(epData.id)) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer / Modal Container */}
      <div className="relative z-10 w-full sm:max-w-md bg-slate-900 border-t sm:border border-white/10 rounded-t-3xl sm:rounded-2xl max-h-[85vh] sm:max-h-[75vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Mobile Grab Handle */}
        <div className="sm:hidden w-10 h-1 bg-white/20 rounded-full mx-auto my-2.5" />

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white line-clamp-1">
              {drama.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select Episode · Total {drama.totalEpisodes} Episodes
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Range Segmented Control Tabs */}
        {ranges.length > 1 && (
          <div className="flex items-center gap-1.5 px-5 py-2.5 overflow-x-auto no-scrollbar border-b border-white/5">
            {ranges.map((r) => (
              <button
                key={r.index}
                onClick={() => setActiveRange(r.index)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeRange === r.index
                    ? 'bg-red-600 text-white font-semibold shadow-sm'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}

        {/* Episode Grid */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-5 gap-2.5 content-start">
          {episodesInCurrentRange.map(({ epNum, episodeData }) => {
            const isPlaying = epNum === currentEpisodeNumber;
            const unlocked = isEpisodeUnlocked(epNum, episodeData);

            return (
              <button
                key={epNum}
                onClick={() => {
                  if (unlocked) {
                    // Use actual episode or mock fallback episode object
                    const ep = episodeData || {
                      id: epNum * 100,
                      episodeNumber: epNum,
                      title: `Episode ${epNum}`,
                      duration: 90,
                      videoUrl: drama.episodes[0].videoUrl,
                      isLocked: false
                    };
                    onSelectEpisode(ep);
                    onClose();
                  } else {
                    const ep = episodeData || {
                      id: epNum * 100,
                      episodeNumber: epNum,
                      title: `Episode ${epNum}`,
                      duration: 90,
                      videoUrl: drama.episodes[0].videoUrl,
                      isLocked: true,
                      requiredCoins: 10
                    };
                    onUnlockEpisode(ep);
                  }
                }}
                className={`relative aspect-square rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all ${
                  isPlaying
                    ? 'bg-red-600 text-white ring-2 ring-red-400 shadow-lg scale-105'
                    : unlocked
                    ? 'bg-slate-800/90 text-slate-200 hover:bg-slate-700 active:scale-95'
                    : 'bg-slate-800/40 text-slate-500 hover:bg-slate-800/70 border border-dashed border-white/10'
                }`}
              >
                {isPlaying ? (
                  <div className="flex flex-col items-center gap-0.5">
                    <Volume2 className="w-3.5 h-3.5 animate-pulse text-white" />
                    <span className="text-[11px] font-bold">{epNum}</span>
                  </div>
                ) : (
                  <>
                    <span>{epNum}</span>
                    {!unlocked && (
                      <Lock className="w-3 h-3 text-amber-400 absolute top-1.5 right-1.5" />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info bar */}
        <div className="p-3.5 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Ep 1-4 Free
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              10 Coins/Ep
            </span>
          </div>

          <div className="text-slate-300 font-medium">
            Balance: <span className="text-amber-400 font-bold">{coins}</span> Coins
          </div>
        </div>
      </div>
    </div>
  );
};
