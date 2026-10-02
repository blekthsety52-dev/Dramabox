import React from 'react';
import { Sparkles, Coins, Gift, Check, Flame, Award, Zap, ShieldCheck } from 'lucide-react';

interface RewardsViewProps {
  coins: number;
  vipActive: boolean;
  dailyCheckInDone: boolean;
  checkInStreak: number;
  onClaimDaily: () => void;
  onActivateVIP: () => void;
  onClaimTask: (coinsReward: number, taskName: string) => void;
  onBuyCoins: (amount: number) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({
  coins,
  vipActive,
  dailyCheckInDone,
  checkInStreak,
  onClaimDaily,
  onActivateVIP,
  onClaimTask,
  onBuyCoins
}) => {
  const streakDays = [
    { day: 1, reward: 20 },
    { day: 2, reward: 30 },
    { day: 3, reward: 40 },
    { day: 4, reward: 50 },
    { day: 5, reward: 60 },
    { day: 6, reward: 80 },
    { day: 7, reward: 120 }
  ];

  const coinPackages = [
    { coins: 100, bonus: '+10', price: '$0.99', popular: false },
    { coins: 300, bonus: '+50', price: '$2.99', popular: true },
    { coins: 700, bonus: '+150', price: '$5.99', popular: false },
    { coins: 1500, bonus: '+500', price: '$11.99', popular: false }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24 md:pb-12 pt-4 px-4 max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Gift className="w-6 h-6 text-amber-400" />
          <span>VIP & Coin Rewards</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Earn free coins daily or unlock VIP for unlimited uninterrupted streaming
        </p>
      </div>

      {/* Wallet Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider">
            Available Coin Balance
          </span>
          <div className="flex items-center gap-2 mt-1">
            <Coins className="w-8 h-8 text-amber-400" />
            <span className="text-3xl sm:text-4xl font-black text-white font-mono tabular-nums">
              {coins}
            </span>
            <span className="text-xs font-bold text-amber-400">Coins</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cost: 10 Coins per locked episode. Free episodes 1–4 require 0 coins.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          {vipActive ? (
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>VIP Pass Active · All Episodes Unlocked</span>
            </div>
          ) : (
            <button
              onClick={onActivateVIP}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>Activate 3-Day Free VIP Trial</span>
            </button>
          )}
        </div>
      </div>

      {/* 7-Day Check-in Streak */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              7-Day Daily Sign-in Reward
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Current streak: <span className="text-amber-400 font-bold">{checkInStreak}</span> days
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {streakDays.map((item) => {
            const isChecked = item.day <= checkInStreak;
            const isToday = item.day === checkInStreak + (dailyCheckInDone ? 0 : 1);

            return (
              <div
                key={item.day}
                className={`p-2.5 rounded-xl flex flex-col items-center justify-center text-center border transition-all ${
                  isChecked
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : isToday
                    ? 'bg-red-600/20 border-red-500 text-white ring-2 ring-red-500/50'
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                <span className="text-[11px] font-medium">Day {item.day}</span>
                <span className="text-xs sm:text-sm font-bold my-1 text-amber-400">
                  +{item.reward}
                </span>
                {isChecked ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-slate-500">🪙</span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onClaimDaily}
          disabled={dailyCheckInDone}
          className="mt-4 w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-white/10 text-slate-950 disabled:text-slate-500 font-bold text-xs transition-colors flex items-center justify-center gap-2"
        >
          {dailyCheckInDone ? (
            <>
              <Check className="w-4 h-4" />
              <span>Today&apos;s Bonus Claimed (+50 Coins)</span>
            </>
          ) : (
            <>
              <Gift className="w-4 h-4" />
              <span>Check-in to Claim Daily Coins (+50)</span>
            </>
          )}
        </button>
      </div>

      {/* Free Coin Tasks */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
        <h2 className="text-sm sm:text-base font-bold text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Earn Free Coins</span>
        </h2>

        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-white">Stream 3 Drama Episodes</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Watch any trending short series</p>
            </div>
            <button
              onClick={() => onClaimTask(30, 'Stream 3 Drama Episodes')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition-colors"
            >
              +30 Coins
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-white">Save a Drama to Watchlist</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Collect your favorite stories</p>
            </div>
            <button
              onClick={() => onClaimTask(20, 'Save a Drama to Watchlist')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition-colors"
            >
              +20 Coins
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-white">Share Drama Link With Friends</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Invite others to binge-watch</p>
            </div>
            <button
              onClick={() => onClaimTask(35, 'Share Drama Link')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs transition-colors"
            >
              +35 Coins
            </button>
          </div>
        </div>
      </div>

      {/* Instant Coin Refill (Simulator) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-white/10">
        <h2 className="text-sm sm:text-base font-bold text-white mb-1">
          Coin Packs
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Instant unlock bundles (Simulation for prototyping)
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {coinPackages.map((pkg) => (
            <div
              key={pkg.coins}
              className={`p-4 rounded-xl flex flex-col items-center justify-between border relative ${
                pkg.popular
                  ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/40'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-extrabold tracking-wider uppercase shadow">
                  Best Value
                </span>
              )}
              <div className="text-center mt-1">
                <span className="text-lg font-black text-white font-mono">{pkg.coins}</span>
                <span className="text-[10px] text-amber-400 font-bold ml-1">{pkg.bonus}</span>
                <p className="text-[10px] text-slate-400">Coins</p>
              </div>

              <button
                onClick={() => onBuyCoins(pkg.coins)}
                className="mt-3 w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs transition-all"
              >
                + Claim {pkg.coins}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
