import React, { useState, useEffect } from 'react';
import { Drama, Episode, UserHistoryItem } from './types/drama';
import { INITIAL_DRAMAS, INITIAL_USER_STATE } from './data/dramasData';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { VideoPlayer } from './components/VideoPlayer';
import { EpisodeDrawer } from './components/EpisodeDrawer';
import { CommentsDrawer } from './components/CommentsDrawer';
import { ShareModal } from './components/ShareModal';
import { DramaDetailModal } from './components/DramaDetailModal';
import { SearchModal } from './components/SearchModal';
import { RewardsModal } from './components/RewardsModal';
import { AnimatedPromoModal } from './components/AnimatedPromoModal';
import { Toast, ToastMessage } from './components/Toast';

import { HomeView } from './views/HomeView';
import { DiscoverView } from './views/DiscoverView';
import { MyListView } from './views/MyListView';
import { RewardsView } from './views/RewardsView';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [desktopViewMode, setDesktopViewMode] = useState<'phone' | 'fluid'>('fluid');

  // Dramas State
  const [dramas, setDramas] = useState<Drama[]>(INITIAL_DRAMAS);
  const [activeDrama, setActiveDrama] = useState<Drama>(INITIAL_DRAMAS[0]);
  const [activeEpisode, setActiveEpisode] = useState<Episode>(INITIAL_DRAMAS[0].episodes[0]);

  // User Library & Persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dramabox_favorites');
      return saved ? JSON.parse(saved) : ['secret-billionaire-heir'];
    } catch {
      return ['secret-billionaire-heir'];
    }
  });

  const [watchHistory, setWatchHistory] = useState<UserHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('dramabox_history');
      return saved
        ? JSON.parse(saved)
        : [
            {
              dramaId: 'secret-billionaire-heir',
              episodeId: 101,
              episodeNumber: 1,
              progressSeconds: 45,
              durationSeconds: 95,
              updatedAt: Date.now() - 3600000
            }
          ];
    } catch {
      return [];
    }
  });

  const [unlockedEpisodeIds, setUnlockedEpisodeIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('dramabox_unlocked_episodes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userState, setUserState] = useState(() => {
    try {
      const saved = localStorage.getItem('dramabox_user_state');
      return saved ? JSON.parse(saved) : INITIAL_USER_STATE;
    } catch {
      return INITIAL_USER_STATE;
    }
  });

  // Modal Dialogs
  const [selectedDramaDetail, setSelectedDramaDetail] = useState<Drama | null>(null);
  const [isEpisodeDrawerOpen, setIsEpisodeDrawerOpen] = useState(false);
  const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('dramabox_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('dramabox_history', JSON.stringify(watchHistory));
  }, [watchHistory]);

  useEffect(() => {
    localStorage.setItem('dramabox_unlocked_episodes', JSON.stringify(unlockedEpisodeIds));
  }, [unlockedEpisodeIds]);

  useEffect(() => {
    localStorage.setItem('dramabox_user_state', JSON.stringify(userState));
  }, [userState]);

  const addToast = (text: string, type: 'success' | 'info' | 'reward' = 'success') => {
    const id = `t_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Playback & Drama Selection
  const handlePlayDrama = (drama: Drama, episode?: Episode) => {
    setActiveDrama(drama);
    if (episode) {
      setActiveEpisode(episode);
    } else {
      // Find saved history episode or default to 1
      const hist = watchHistory.find((h) => h.dramaId === drama.id);
      if (hist) {
        const found = drama.episodes.find((e) => e.episodeNumber === hist.episodeNumber);
        setActiveEpisode(found || drama.episodes[0]);
      } else {
        setActiveEpisode(drama.episodes[0]);
      }
    }
    setCurrentTab('player');
  };

  const handleSelectEpisode = (episode: Episode) => {
    setActiveEpisode(episode);
  };

  const handleToggleFavorite = (dramaId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(dramaId);
      if (exists) {
        addToast('Removed from Watchlist', 'info');
        return prev.filter((id) => id !== dramaId);
      } else {
        addToast('Added to Watchlist ❤️', 'success');
        return [...prev, dramaId];
      }
    });
  };

  const handleUpdateHistory = (
    dramaId: string,
    episodeId: number,
    episodeNumber: number,
    progressSeconds: number,
    durationSeconds: number
  ) => {
    setWatchHistory((prev) => {
      const filtered = prev.filter((h) => h.dramaId !== dramaId);
      return [
        {
          dramaId,
          episodeId,
          episodeNumber,
          progressSeconds,
          durationSeconds,
          updatedAt: Date.now()
        },
        ...filtered
      ];
    });
  };

  const handleClearHistory = () => {
    setWatchHistory([]);
    addToast('Watch history cleared', 'info');
  };

  // Coins & Unlock System
  const handleUnlockEpisode = (episode: Episode) => {
    const cost = episode.requiredCoins || 10;
    if (userState.coins >= cost) {
      setUserState((prev: typeof INITIAL_USER_STATE) => ({
        ...prev,
        coins: prev.coins - cost
      }));
      setUnlockedEpisodeIds((prev) => [...prev, episode.id]);
      setActiveEpisode(episode);
      addToast(`Episode ${episode.episodeNumber} Unlocked! (-${cost} Coins)`, 'reward');
    } else {
      addToast('Not enough coins! Claim daily bonus or activate VIP', 'info');
      setIsRewardsModalOpen(true);
    }
  };

  const handleClaimDailyCheckIn = () => {
    if (userState.dailyCheckInDone) return;
    setUserState((prev: typeof INITIAL_USER_STATE) => ({
      ...prev,
      coins: prev.coins + 50,
      dailyCheckInDone: true,
      checkInStreak: prev.checkInStreak + 1
    }));
    addToast('Claimed +50 Daily Coins! 🎉', 'reward');
  };

  const handleActivateVIP = () => {
    setUserState((prev: typeof INITIAL_USER_STATE) => ({
      ...prev,
      vipActive: true,
      vipDaysLeft: 3
    }));
    addToast('VIP Pass Activated! All Episodes Unlocked 👑', 'reward');
    setIsRewardsModalOpen(false);
  };

  const handleClaimTask = (coinsReward: number, taskName: string) => {
    setUserState((prev: typeof INITIAL_USER_STATE) => ({
      ...prev,
      coins: prev.coins + coinsReward
    }));
    addToast(`+${coinsReward} Coins earned: ${taskName}!`, 'reward');
  };

  const handleBuyCoins = (amount: number) => {
    setUserState((prev: typeof INITIAL_USER_STATE) => ({
      ...prev,
      coins: prev.coins + amount
    }));
    addToast(`+${amount} Coins added to your balance!`, 'reward');
  };

  const handleAddComment = (commentText: string) => {
    const newComment = {
      id: `c_${Date.now()}`,
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      text: commentText,
      likes: 0,
      timestamp: 'Just now'
    };

    setDramas((prev) =>
      prev.map((d) => {
        if (d.id === activeDrama.id) {
          return {
            ...d,
            comments: [newComment, ...d.comments]
          };
        }
        return d;
      })
    );

    setActiveDrama((prev) => ({
      ...prev,
      comments: [newComment, ...prev.comments]
    }));

    addToast('Comment posted! 💬', 'success');
  };

  const handleToggleViewMode = () => {
    setDesktopViewMode((prev) => (prev === 'phone' ? 'fluid' : 'phone'));
    addToast(desktopViewMode === 'phone' ? 'Switched to Fluid Desktop Mode' : 'Switched to Phone Preview Mode', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased selection:bg-red-600 selection:text-white flex flex-col">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Top Bar Header (Adhering to Top Bar Contract) */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenRewards={() => setIsRewardsModalOpen(true)}
        onOpenPromo={() => setIsPromoModalOpen(true)}
        coins={userState.coins}
        vipActive={userState.vipActive}
        desktopViewMode={desktopViewMode}
        onToggleViewMode={handleToggleViewMode}
      />

      {/* Main View Area */}
      <main className="flex-1 relative">
        {currentTab === 'home' && (
          <HomeView
            dramas={dramas}
            onSelectDrama={(drama) => setSelectedDramaDetail(drama)}
            onPlayDrama={handlePlayDrama}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            watchHistory={watchHistory}
            onOpenRewards={() => setIsRewardsModalOpen(true)}
            onOpenPromo={() => setIsPromoModalOpen(true)}
          />
        )}

        {currentTab === 'player' && (
          <VideoPlayer
            drama={activeDrama}
            currentEpisode={activeEpisode}
            allDramas={dramas}
            onSelectDrama={(drama) => setActiveDrama(drama)}
            onSelectEpisode={handleSelectEpisode}
            onBack={() => setCurrentTab('home')}
            onOpenEpisodes={() => setIsEpisodeDrawerOpen(true)}
            onOpenComments={() => setIsCommentsDrawerOpen(true)}
            onOpenShare={() => setIsShareModalOpen(true)}
            isFavorite={favorites.includes(activeDrama.id)}
            onToggleFavorite={handleToggleFavorite}
            unlockedEpisodeIds={unlockedEpisodeIds}
            vipActive={userState.vipActive}
            coins={userState.coins}
            onUnlockEpisode={handleUnlockEpisode}
            onUpdateHistory={handleUpdateHistory}
            onToast={(msg) => addToast(msg, 'info')}
            desktopViewMode={desktopViewMode}
          />
        )}

        {currentTab === 'discover' && (
          <DiscoverView
            dramas={dramas}
            onSelectDrama={(drama) => setSelectedDramaDetail(drama)}
            onPlayDrama={handlePlayDrama}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenSearch={() => setIsSearchModalOpen(true)}
          />
        )}

        {currentTab === 'mylist' && (
          <MyListView
            dramas={dramas}
            favorites={favorites}
            watchHistory={watchHistory}
            onSelectDrama={(drama) => setSelectedDramaDetail(drama)}
            onPlayDrama={handlePlayDrama}
            onToggleFavorite={handleToggleFavorite}
            onClearHistory={handleClearHistory}
            onNavigateHome={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'rewards' && (
          <RewardsView
            coins={userState.coins}
            vipActive={userState.vipActive}
            dailyCheckInDone={userState.dailyCheckInDone}
            checkInStreak={userState.checkInStreak}
            onClaimDaily={handleClaimDailyCheckIn}
            onActivateVIP={handleActivateVIP}
            onClaimTask={handleClaimTask}
            onBuyCoins={handleBuyCoins}
          />
        )}
      </main>

      {/* Mobile Bottom Tab Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        savedCount={favorites.length}
      />

      {/* Episode Selection Drawer */}
      <EpisodeDrawer
        isOpen={isEpisodeDrawerOpen}
        onClose={() => setIsEpisodeDrawerOpen(false)}
        drama={activeDrama}
        currentEpisodeNumber={activeEpisode.episodeNumber}
        onSelectEpisode={handleSelectEpisode}
        unlockedEpisodeIds={unlockedEpisodeIds}
        vipActive={userState.vipActive}
        coins={userState.coins}
        onUnlockEpisode={handleUnlockEpisode}
      />

      {/* Community Comments Drawer */}
      <CommentsDrawer
        isOpen={isCommentsDrawerOpen}
        onClose={() => setIsCommentsDrawerOpen(false)}
        dramaTitle={activeDrama.title}
        episodeNumber={activeEpisode.episodeNumber}
        comments={activeDrama.comments}
        onAddComment={handleAddComment}
      />

      {/* Social Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        drama={activeDrama}
        episodeNumber={activeEpisode.episodeNumber}
        onToast={(msg) => addToast(msg, 'success')}
      />

      {/* Full Drama Details & Episode Browser Modal */}
      <DramaDetailModal
        drama={selectedDramaDetail}
        isOpen={selectedDramaDetail !== null}
        onClose={() => setSelectedDramaDetail(null)}
        onPlayEpisode={handlePlayDrama}
        savedEpisodeNumber={
          watchHistory.find((h) => h.dramaId === selectedDramaDetail?.id)?.episodeNumber
        }
        isFavorite={selectedDramaDetail ? favorites.includes(selectedDramaDetail.id) : false}
        onToggleFavorite={handleToggleFavorite}
        unlockedEpisodeIds={unlockedEpisodeIds}
        vipActive={userState.vipActive}
        onUnlockEpisode={handleUnlockEpisode}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        dramas={dramas}
        onSelectDrama={(drama) => setSelectedDramaDetail(drama)}
        onPlayDrama={handlePlayDrama}
      />

      {/* VIP & Coins Modal */}
      <RewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
        coins={userState.coins}
        vipActive={userState.vipActive}
        dailyCheckInDone={userState.dailyCheckInDone}
        checkInStreak={userState.checkInStreak}
        onClaimDaily={handleClaimDailyCheckIn}
        onActivateVIP={handleActivateVIP}
        onClaimTask={handleClaimTask}
      />

      {/* Animated Video Promo Studio Modal */}
      <AnimatedPromoModal
        isOpen={isPromoModalOpen}
        onClose={() => setIsPromoModalOpen(false)}
        dramas={dramas}
        onToast={(msg) => addToast(msg, 'info')}
      />
    </div>
  );
}
