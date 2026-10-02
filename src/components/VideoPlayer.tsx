import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Drama, Episode } from '../types/drama';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Layers,
  Sparkles,
  Lock,
  FastForward,
  Captions
} from 'lucide-react';

interface HeartAnimation {
  id: number;
  x: number;
  y: number;
}

interface VideoPlayerProps {
  drama: Drama;
  currentEpisode: Episode;
  allDramas: Drama[];
  onSelectDrama: (drama: Drama) => void;
  onSelectEpisode: (episode: Episode) => void;
  onBack: () => void;
  onOpenEpisodes: () => void;
  onOpenComments: () => void;
  onOpenShare: () => void;
  isFavorite: boolean;
  onToggleFavorite: (dramaId: string) => void;
  unlockedEpisodeIds: number[];
  vipActive: boolean;
  coins: number;
  onUnlockEpisode: (episode: Episode) => void;
  onUpdateHistory: (dramaId: string, episodeId: number, epNum: number, progress: number, duration: number) => void;
  onToast: (msg: string) => void;
  desktopViewMode: 'phone' | 'fluid';
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  drama,
  currentEpisode,
  allDramas,
  onSelectDrama,
  onSelectEpisode,
  onBack,
  onOpenEpisodes,
  onOpenComments,
  onOpenShare,
  isFavorite,
  onToggleFavorite,
  unlockedEpisodeIds,
  vipActive,
  coins,
  onUnlockEpisode,
  onUpdateHistory,
  onToast,
  desktopViewMode
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(currentEpisode.duration || 90);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Subtitles
  const [subtitleLanguage, setSubtitleLanguage] = useState<'off' | 'en' | 'es' | 'zh'>('en');
  const [showSubtitleMenu, setShowSubtitleMenu] = useState<boolean>(false);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');

  // UI Interactivity
  const [isLiked, setIsLiked] = useState<boolean>(drama.isLiked || false);
  const [likesCount, setLikesCount] = useState<number>(drama.likesCount);
  const [hearts, setHearts] = useState<HeartAnimation[]>([]);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [playPulse, setPlayPulse] = useState<boolean>(false);

  // Gestures
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const touchStartY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const lastTapTime = useRef<number>(0);

  // Next episode countdown
  const [countdownRemaining, setCountdownRemaining] = useState<number | null>(null);

  // Check if locked
  const isUnlocked =
    vipActive ||
    currentEpisode.episodeNumber <= 4 ||
    !currentEpisode.isLocked ||
    unlockedEpisodeIds.includes(currentEpisode.id);

  // Reset states on episode change
  useEffect(() => {
    setCurrentTime(0);
    setVideoError(false);
    setIsLoading(true);
    setCountdownRemaining(null);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = playbackSpeed;
      if (isUnlocked) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [currentEpisode.id, isUnlocked]);

  // Canvas visual loop as backup/cinematic ambience
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let hue = 0;
    const renderLoop = () => {
      if (videoError || !isUnlocked) {
        hue = (hue + 0.3) % 360;
        const w = (canvas.width = canvas.offsetWidth || 360);
        const h = (canvas.height = canvas.offsetHeight || 640);

        const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, h * 0.8);
        grad.addColorStop(0, `hsla(${hue}, 70%, 15%, 1)`);
        grad.addColorStop(0.6, `hsla(${(hue + 40) % 360}, 60%, 8%, 1)`);
        grad.addColorStop(1, '#020617');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        for (let i = 0; i < 15; i++) {
          const x = (Math.sin(hue * 0.02 + i) * 0.5 + 0.5) * w;
          const y = ((hue * 2 + i * 40) % h);
          ctx.beginPath();
          ctx.arc(x, y, (i % 4) + 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animId);
  }, [videoError, isUnlocked]);

  // Subtitle synchronization
  useEffect(() => {
    if (subtitleLanguage === 'off' || !currentEpisode.subtitles) {
      setCurrentSubtitle('');
      return;
    }

    const cues = currentEpisode.subtitles[subtitleLanguage] || currentEpisode.subtitles.en || [];
    const activeCue = cues.find((c) => currentTime >= c.start && currentTime <= c.end);
    setCurrentSubtitle(activeCue ? activeCue.text : '');
  }, [currentTime, subtitleLanguage, currentEpisode]);

  // Auto-hide controls
  const triggerShowControls = useCallback(() => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const t = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSpeedMenu(false);
        setShowSubtitleMenu(false);
      }
    }, 3500);
    setControlsTimeout(t);
  }, [isPlaying, controlsTimeout]);

  // Navigation helpers
  const handleNextEpisode = useCallback(() => {
    const nextEpNum = currentEpisode.episodeNumber + 1;
    if (nextEpNum <= drama.totalEpisodes) {
      const existing = drama.episodes.find((e) => e.episodeNumber === nextEpNum);
      const nextEp = existing || {
        id: nextEpNum * 100,
        episodeNumber: nextEpNum,
        title: `Episode ${nextEpNum}`,
        duration: 90,
        videoUrl: drama.episodes[0].videoUrl,
        isLocked: nextEpNum > 4 && !vipActive
      };
      onSelectEpisode(nextEp);
      onToast(`Switched to Episode ${nextEpNum}`);
    } else {
      const currentIdx = allDramas.findIndex((d) => d.id === drama.id);
      const nextDrama = allDramas[(currentIdx + 1) % allDramas.length];
      onSelectDrama(nextDrama);
      onSelectEpisode(nextDrama.episodes[0]);
      onToast(`Completed drama! Starting ${nextDrama.title}`);
    }
  }, [currentEpisode, drama, allDramas, onSelectEpisode, onSelectDrama, onToast, vipActive]);

  const handlePrevEpisode = useCallback(() => {
    const prevEpNum = currentEpisode.episodeNumber - 1;
    if (prevEpNum >= 1) {
      const existing = drama.episodes.find((e) => e.episodeNumber === prevEpNum);
      const prevEp = existing || {
        id: prevEpNum * 100,
        episodeNumber: prevEpNum,
        title: `Episode ${prevEpNum}`,
        duration: 90,
        videoUrl: drama.episodes[0].videoUrl,
        isLocked: prevEpNum > 4 && !vipActive
      };
      onSelectEpisode(prevEp);
      onToast(`Switched to Episode ${prevEpNum}`);
    } else {
      onToast('Already at the first episode');
    }
  }, [currentEpisode, drama, onSelectEpisode, onToast, vipActive]);

  // Video Time Update & End Detection
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    const dur = videoRef.current.duration || currentEpisode.duration || 90;
    setCurrentTime(time);
    setDuration(dur);

    if (Math.floor(time) % 5 === 0) {
      onUpdateHistory(drama.id, currentEpisode.id, currentEpisode.episodeNumber, time, dur);
    }

    const timeLeft = dur - time;
    if (timeLeft > 0 && timeLeft <= 4 && isPlaying) {
      setCountdownRemaining(Math.ceil(timeLeft));
    } else {
      setCountdownRemaining(null);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    handleNextEpisode();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevEpisode();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextEpisode();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seekRelative(-5);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seekRelative(5);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextEpisode, handlePrevEpisode]);

  const seekRelative = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
      setCurrentTime(videoRef.current.currentTime);
      triggerShowControls();
    }
  };

  const togglePlayPause = () => {
    if (!isUnlocked) return;
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
      setPlayPulse(true);
      setTimeout(() => setPlayPulse(false), 500);
      triggerShowControls();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Gestures Handler (Swipe Up/Down to switch episodes)
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchStartY.current = clientY;
    touchStartX.current = clientX;
    setIsDragging(true);
    setDragOffsetY(0);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - touchStartY.current;
    setDragOffsetY(deltaY * 0.4);
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaY = clientY - touchStartY.current;
    const absDeltaY = Math.abs(deltaY);

    setDragOffsetY(0);

    if (absDeltaY > 50) {
      if (deltaY < 0) {
        handleNextEpisode();
      } else {
        handlePrevEpisode();
      }
    } else {
      handleTapOrDoubleTap(e);
    }
  };

  const handleTapOrDoubleTap = (e: React.TouchEvent | React.MouseEvent) => {
    const now = Date.now();
    const timeDelta = now - lastTapTime.current;
    lastTapTime.current = now;

    const rect = containerRef.current?.getBoundingClientRect();
    const clientX = 'clientX' in e ? e.clientX : 'changedTouches' in e ? e.changedTouches[0].clientX : 0;
    const clientY = 'clientY' in e ? e.clientY : 'changedTouches' in e ? e.changedTouches[0].clientY : 0;

    if (timeDelta < 300 && rect) {
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const newHeart: HeartAnimation = { id: Date.now(), x, y };
      setHearts((prev) => [...prev, newHeart]);
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 900);

      if (!isLiked) {
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
        onToast('Liked episode! ❤️');
      }
    } else {
      togglePlayPause();
    }
  };

  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
      onToast('Liked this episode! ❤️');
    }
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    triggerShowControls();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
    onToast(`Playback speed: ${speed}x`);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={triggerShowControls}
      className={`relative w-full bg-black select-none overflow-hidden ${
        desktopViewMode === 'phone'
          ? 'h-[844px] max-w-[390px] mx-auto rounded-[32px] border-[6px] border-slate-800 shadow-2xl my-4'
          : 'h-[100dvh] md:h-[calc(100vh-3.5rem)] flex items-center justify-center'
      }`}
    >
      {/* 9:16 Video Canvas / Video Element */}
      <div
        style={{
          transform: `translateY(${dragOffsetY}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        className="relative w-full h-full max-w-md aspect-[9/16] bg-slate-950 flex items-center justify-center overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
      >
        {/* Video Element */}
        {isUnlocked ? (
          <video
            ref={videoRef}
            src={currentEpisode.videoUrl}
            playsInline
            autoPlay
            muted={isMuted}
            loop={false}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onLoadedData={() => {
              setIsLoading(false);
              setVideoError(false);
            }}
            onError={() => {
              setVideoError(true);
              setIsLoading(false);
            }}
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : null}

        {/* Fallback procedural canvas for error or locked state */}
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full object-cover ${
            videoError || !isUnlocked ? 'block' : 'hidden'
          }`}
        />

        {/* Video Poster when loading or fallback */}
        {(isLoading || videoError) && isUnlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs font-semibold text-white/90 tracking-wide">
              Loading Episode {currentEpisode.episodeNumber}...
            </span>
          </div>
        )}

        {/* Subtitles Overlay */}
        {currentSubtitle && subtitleLanguage !== 'off' && isUnlocked && (
          <div className="absolute bottom-24 left-4 right-16 z-20 pointer-events-none flex justify-center text-center">
            <span className="px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-sm text-white text-xs sm:text-sm font-semibold tracking-wide border border-white/10 shadow-lg text-wrap max-w-xs">
              {currentSubtitle}
            </span>
          </div>
        )}

        {/* Locked Episode Paywall Overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              Episode {currentEpisode.episodeNumber} is Locked
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mb-6">
              Unlock this episode with coins or activate your Free VIP Pass to binge all dramas without limits.
            </p>

            <div className="w-full max-w-xs space-y-2.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUnlockEpisode(currentEpisode);
                }}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Unlock for 10 Coins (Balance: {coins})</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenEpisodes();
                }}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
              >
                Browse All Episodes
              </button>
            </div>
          </div>
        )}

        {/* Next Episode Countdown Banner */}
        {countdownRemaining !== null && isUnlocked && (
          <div className="absolute top-16 left-4 right-4 z-30 pointer-events-auto">
            <div className="p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-red-500/40 text-white flex items-center justify-between shadow-2xl animate-fade-in">
              <div className="flex items-center gap-2">
                <FastForward className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="text-xs font-semibold">
                  Next Ep. in {countdownRemaining}s...
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextEpisode();
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Watch Now
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCountdownRemaining(null);
                  }}
                  className="text-slate-400 hover:text-white text-xs p-1"
                >
                  Replay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Drag Hint Indicator (Vertical swipe gesture preview) */}
        {isDragging && Math.abs(dragOffsetY) > 20 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-center justify-center text-white">
            <div className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 flex items-center gap-2 text-xs font-bold animate-pulse">
              {dragOffsetY < 0 ? (
                <>
                  <ChevronUp className="w-4 h-4 text-red-500" />
                  <span>Release for Next Episode</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-red-500" />
                  <span>Release for Prev Episode</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Heart Burst Animations on Double Tap */}
        {hearts.map((h) => (
          <div
            key={h.id}
            style={{ left: h.x - 24, top: h.y - 24 }}
            className="absolute z-30 pointer-events-none animate-heart-burst"
          >
            <Heart className="w-12 h-12 text-red-500 fill-red-500 filter drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
          </div>
        ))}

        {/* Center Play/Pause Pulse Icon */}
        {playPulse && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white animate-scale-fade">
              {isPlaying ? (
                <Play className="w-8 h-8 fill-current ml-1" />
              ) : (
                <Pause className="w-8 h-8 fill-current" />
              )}
            </div>
          </div>
        )}

        {/* Top Control Bar */}
        <div
          className={`absolute top-0 left-0 right-0 z-25 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Back button & Drama Title */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBack();
              }}
              className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center shrink-0 border border-white/10"
              aria-label="Back to browse"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-white truncate drop-shadow">
                {drama.title}
              </h2>
              <span className="text-[11px] text-red-400 font-semibold drop-shadow">
                Ep. {currentEpisode.episodeNumber}/{drama.totalEpisodes}
              </span>
            </div>
          </div>

          {/* Action buttons (Mute, Speed, CC, Fullscreen) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Sound Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted((prev) => !prev);
              }}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/10"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Playback Speed Menu Trigger */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeedMenu((prev) => !prev);
                  setShowSubtitleMenu(false);
                }}
                className="px-2 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 flex items-center justify-center"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute right-0 top-10 w-24 bg-slate-900 border border-white/10 rounded-xl p-1 shadow-2xl z-30 flex flex-col gap-0.5">
                  {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeedSelect(s);
                      }}
                      className={`px-2 py-1 text-xs rounded-lg text-left transition-colors ${
                        playbackSpeed === s ? 'bg-red-600 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtitles Menu Trigger */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSubtitleMenu((prev) => !prev);
                  setShowSpeedMenu(false);
                }}
                className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center border transition-colors ${
                  subtitleLanguage !== 'off'
                    ? 'bg-red-600 text-white border-red-500'
                    : 'bg-black/40 hover:bg-black/70 text-white border-white/10'
                }`}
                aria-label="Subtitles"
              >
                <Captions className="w-4 h-4" />
              </button>

              {showSubtitleMenu && (
                <div className="absolute right-0 top-10 w-28 bg-slate-900 border border-white/10 rounded-xl p-1 shadow-2xl z-30 flex flex-col gap-0.5">
                  {[
                    { id: 'off', label: 'Off' },
                    { id: 'en', label: 'English' },
                    { id: 'es', label: 'Español' },
                    { id: 'zh', label: '中文' }
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSubtitleLanguage(sub.id as any);
                        setShowSubtitleMenu(false);
                        onToast(`Subtitles: ${sub.label}`);
                      }}
                      className={`px-2 py-1 text-xs rounded-lg text-left transition-colors ${
                        subtitleLanguage === sub.id
                          ? 'bg-red-600 text-white font-bold'
                          : 'text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/10"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Right Action Rail */}
        <div className="absolute right-3 bottom-20 z-25 flex flex-col items-center gap-4 text-white">
          {/* Creator Profile */}
          <div className="relative flex flex-col items-center">
            <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-lg bg-slate-800">
              <img
                src={drama.coverImage}
                alt="Drama"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToast('Followed drama creator!');
              }}
              className="absolute -bottom-1.5 w-4 h-4 rounded-full bg-red-600 text-white font-black text-xs flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform"
            >
              +
            </button>
          </div>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleLike();
            }}
            className="flex flex-col items-center group focus-visible:outline-none"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-transform group-active:scale-125 ${
                isLiked ? 'bg-red-600 text-white' : 'bg-black/40 hover:bg-black/70 text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[10px] font-semibold mt-1 drop-shadow tabular-nums">
              {(likesCount / 1000).toFixed(1)}k
            </span>
          </button>

          {/* Comments Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments();
            }}
            className="flex flex-col items-center group focus-visible:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center transition-transform group-active:scale-110">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold mt-1 drop-shadow tabular-nums">
              {drama.comments.length}
            </span>
          </button>

          {/* Watchlist / Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(drama.id);
            }}
            className="flex flex-col items-center group focus-visible:outline-none"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-transform group-active:scale-110 ${
                isFavorite ? 'bg-red-600 text-white' : 'bg-black/40 hover:bg-black/70 text-white'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[10px] font-semibold mt-1 drop-shadow">
              {isFavorite ? 'Saved' : 'Collect'}
            </span>
          </button>

          {/* Episode List Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenEpisodes();
            }}
            className="flex flex-col items-center group focus-visible:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center transition-transform group-active:scale-110">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold mt-1 drop-shadow">
              {drama.totalEpisodes} Eps
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenShare();
            }}
            className="flex flex-col items-center group focus-visible:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center transition-transform group-active:scale-110">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold mt-1 drop-shadow">
              Share
            </span>
          </button>
        </div>

        {/* Bottom Metadata & Scrubber Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-25 p-4 pt-12 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Episode & Title Info */}
          <div className="pr-14 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-500">
                Episode {currentEpisode.episodeNumber}
              </span>
              <span className="text-[11px] text-white/50">·</span>
              <span className="text-xs text-white/90 font-medium truncate">
                {currentEpisode.title}
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
              {drama.synopsis}
            </p>
          </div>

          {/* Scrubber Progress Bar */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-slate-300 w-8 tabular-nums">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={handleScrubberChange}
              className="flex-1 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
            />
            <span className="text-[10px] font-mono text-slate-400 w-8 tabular-nums text-right">
              {formatTime(duration)}
            </span>
          </div>

          {/* Quick Prev / Next Episode Buttons & Play/Pause */}
          <div className="flex items-center justify-between text-xs text-white">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevEpisode();
              }}
              disabled={currentEpisode.episodeNumber <= 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none font-semibold transition-colors"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Prev Ep</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextEpisode();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 font-semibold transition-colors shadow-md"
            >
              <span>Next Ep</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
