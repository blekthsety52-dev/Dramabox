import React from 'react';
import { X, Sparkles, Gift, Check, Flame, Award } from 'lucide-react';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coins: number;
  vipActive: boolean;
  dailyCheckInDone: boolean;
  checkInStreak: number;
  onClaimDaily: () => void;
  onActivateVIP: () => void;
  onClaimTask: (coinsReward: number, taskName: string) => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  coins,
  vipActive,
  dailyCheckInDone,
  checkInStreak,
  onClaimDaily,
  onActivateVIP,
  onClaimTask
}) => {
  if (!isOpen) return null;

  const streakDays = [
    { day: 1, reward: 20 },
    { day: 2, reward: 30 },
    { day: 3, reward: 40 },
    { day: 4, reward: 50 },
    { day: 5, reward: 60 },
    { day: 6, reward: 80 },
    { day: 7, reward: 120 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto animate-fade-in text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-base">Rewards & VIP Center</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Status Banner */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-200/80 font-medium">My Coin Balance</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-amber-300 font-mono tabular-nums">{coins}</span>
              <span className="text-xs font-semibold text-amber-400">Coins</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Membership</span>
            <div className="text-xs font-bold text-white mt-0.5">
              {vipActive ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> VIP Active
                </span>
              ) : (
                <span className="text-slate-300">Free Tier</span>
              )}
            </div>
          </div>
        </div>

        {/* VIP Pass Card */}
        {!vipActive && (
          <div className="mt-4 p-4 rounded-xl bg-slate-800/80 border border-red-500/30 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Free Trial Available</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-1">
                  Activate 3-Day Free VIP Pass
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Watch all 80+ episodes on all dramas without coins or limits!
                </p>
              </div>
            </div>
            <button
              onClick={onActivateVIP}
              className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>Claim Free VIP Pass Now</span>
            </button>
          </div>
        )}

        {/* 7-Day Check-in Streak */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>7-Day Daily Check-in</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Streak: <span className="text-amber-400 font-bold">{checkInStreak}</span> Days
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {streakDays.map((item) => {
              const isChecked = item.day <= checkInStreak;
              const isToday = item.day === checkInStreak + (dailyCheckInDone ? 0 : 1);

              return (
                <div
                  key={item.day}
                  className={`p-2 rounded-xl flex flex-col items-center justify-center text-center border ${
                    isChecked
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : isToday
                      ? 'bg-red-600/20 border-red-500/60 text-white ring-1 ring-red-500/40'
                      : 'bg-white/5 border-white/5 text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-medium">Day {item.day}</span>
                  <span className="text-xs font-bold my-1 text-amber-400">+{item.reward}</span>
                  {isChecked ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[9px] text-slate-500">🪙</span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={onClaimDaily}
            disabled={dailyCheckInDone}
            className="mt-3 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-white/10 text-slate-950 disabled:text-slate-500 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            {dailyCheckInDone ? (
              <>
                <Check className="w-4 h-4" />
                <span>Today&apos;s Bonus Claimed (+50 Coins)</span>
              </>
            ) : (
              <>
                <Gift className="w-4 h-4" />
                <span>Check-in to Claim +50 Coins</span>
              </>
            )}
          </button>
        </div>

        {/* Daily Tasks */}
        <div className="mt-5 space-y-2.5">
          <div className="text-xs font-bold text-slate-300">Daily Tasks</div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-semibold text-white">Watch 3 Short Episodes</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Stream any trending drama</p>
            </div>
            <button
              onClick={() => onClaimTask(30, 'Watch 3 Short Episodes')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-400 text-xs font-bold transition-colors"
            >
              +30 Coins
            </button>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-semibold text-white">Add a Drama to Watchlist</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Save for later bingeing</p>
            </div>
            <button
              onClick={() => onClaimTask(20, 'Add to Watchlist')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-400 text-xs font-bold transition-colors"
            >
              +20 Coins
            </button>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-semibold text-white">Leave a Scene Reaction</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Comment on any episode</p>
            </div>
            <button
              onClick={() => onClaimTask(25, 'Leave a Scene Reaction')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-400 text-xs font-bold transition-colors"
            >
              +25 Coins
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
