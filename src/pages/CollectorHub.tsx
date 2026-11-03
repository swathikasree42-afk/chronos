import React from 'react';
import {
  Award,
  Shield,
  Zap,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Flame,
  Calendar
} from 'lucide-react';
import { CollectorProfile, Currency, WatchConfig } from '../types/watch';
import { VIRTUOSITY_TIERS, formatPrice } from '../data/horologySpecs';
import { horologyAudio } from '../utils/audio';

interface CollectorHubProps {
  profile: CollectorProfile;
  watches: WatchConfig[];
  currency: Currency;
  onNavigate: (page: 'studio' | 'lab' | 'vault') => void;
}

export const CollectorHub: React.FC<CollectorHubProps> = ({
  profile,
  watches,
  currency,
  onNavigate
}) => {
  const currentTier = VIRTUOSITY_TIERS.find(t => t.level === profile.level) || VIRTUOSITY_TIERS[0];
  const nextTier = VIRTUOSITY_TIERS.find(t => t.level === profile.level + 1);

  // Progress percentage to next tier
  const tierXpSpan = (nextTier ? nextTier.minXp : currentTier.maxXp) - currentTier.minXp;
  const currentTierXp = profile.xp - currentTier.minXp;
  const xpPercent = Math.min(100, Math.max(0, Math.round((currentTierXp / tierXpSpan) * 100)));

  // Radar metrics calculation
  // 1. Metallurgy score (based on platinum/gold/carbon in vault)
  const nobleMetalsCount = watches.filter(w => ['platinum', 'rose_gold', 'forged_carbon'].includes(w.caseMetal)).length;
  const metallurgyScore = Math.min(100, 30 + nobleMetalsCount * 25);

  // 2. Complications score (sum of all complications)
  const totalComps = watches.reduce((acc, w) => acc + w.complications.length, 0);
  const complicationsScore = Math.min(100, 20 + totalComps * 12);

  // 3. Chronometric Precision score (based on recent lab scores)
  const bestDeadbeat = (profile.recentScores || [])
    .filter(s => s.gameMode === 'deadbeat')
    .map(s => s.score);
  const minDelta = bestDeadbeat.length > 0 ? Math.min(...bestDeadbeat) : 120;
  const precisionScore = Math.max(20, Math.min(100, 100 - minDelta * 1.5));

  // 4. Atelier Prestige score (based on unlocked achievements & XP)
  const prestigeScore = Math.min(100, Math.round((profile.xp / 4000) * 100));

  // Radar polygon points (center 150, 150, radius 100)
  // Axes: Top (Metallurgy), Right (Complications), Bottom (Prestige), Left (Precision)
  const cx = 150;
  const cy = 150;
  const r = 95;

  const topY = cy - (metallurgyScore / 100) * r;
  const rightX = cx + (complicationsScore / 100) * r;
  const bottomY = cy + (prestigeScore / 100) * r;
  const leftX = cx - (precisionScore / 100) * r;

  const radarPolygon = `${cx},${topY} ${rightX},${cy} ${cx},${bottomY} ${leftX},${cy}`;

  const totalVaultValue = watches.reduce((sum, w) => {
    // Basic approximate or imported calculation
    return sum + (w.caseMetal === 'platinum' ? 76000 : w.caseMetal === 'rose_gold' ? 58000 : 34000);
  }, 0);

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Collector Identity & Virtuosity Tier Banner */}
      <div className="relative rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-500">
              <Shield size={14} />
              <span>Horological Virtuosity Tier // Level {profile.level}</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">
              {profile.title}
            </h1>

            <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
              Privilege unlocked: <span className="text-amber-200 font-medium">{currentTier.privilege}</span>. Continue refining high-complication blueprints and clocking sub-millisecond escapement trials to attain <span className="text-white font-semibold">Chronos Quantum Fellow</span> status.
            </p>

            {/* XP Progress Bar */}
            <div className="space-y-2 pt-2 max-w-md">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">{profile.xp} XP</span>
                <span className="text-amber-400 font-semibold">{nextTier ? `${nextTier.minXp} XP (Tier ${profile.level + 1})` : 'Maximum Tier'}</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-700"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3 font-mono">
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                <Flame size={12} className="text-amber-500" /> Streak
              </span>
              <p className="text-2xl font-bold text-white mt-1">{profile.dailyStreak} Days</p>
              <p className="text-[10px] text-zinc-400">Atelier Activity</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 uppercase flex items-center gap-1">
                <Sparkles size={12} className="text-amber-500" /> Vault Count
              </span>
              <p className="text-2xl font-bold text-white mt-1">{watches.length} Pieces</p>
              <p className="text-[10px] text-zinc-400">Curated Safe</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Radar Analytics & Daily Calibrations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Radar Spider Chart */}
        <div className="lg:col-span-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-amber-500">Horological Balance Index</span>
            <h2 className="font-display text-xl font-bold text-white mt-1">
              Collector Virtuosity Radar
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Multi-axial evaluation of your bespoke atelier commissions and temporal lab precision.
            </p>
          </div>

          {/* SVG Radar */}
          <div className="relative flex items-center justify-center py-6 select-none">
            <svg viewBox="0 0 300 300" className="w-full max-w-[280px] h-auto drop-shadow-lg">
              {/* Concentric Guide Polygons */}
              {[0.25, 0.5, 0.75, 1.0].map((scale, i) => {
                const s = r * scale;
                return (
                  <polygon
                    key={`guide-${i}`}
                    points={`${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`}
                    fill="none"
                    stroke="#27272a"
                    strokeWidth="1"
                    strokeDasharray={scale < 1 ? '3,3' : 'none'}
                  />
                );
              })}

              {/* Crosshair Axes */}
              <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="#3f3f46" strokeWidth="1" />
              <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#3f3f46" strokeWidth="1" />

              {/* Data Polygon */}
              <polygon
                points={radarPolygon}
                fill="rgba(245, 158, 11, 0.25)"
                stroke="#f59e0b"
                strokeWidth="2"
              />

              {/* Apex Data Dots */}
              <circle cx={cx} cy={topY} r="3.5" fill="#f59e0b" />
              <circle cx={rightX} cy={cy} r="3.5" fill="#f59e0b" />
              <circle cx={cx} cy={bottomY} r="3.5" fill="#f59e0b" />
              <circle cx={leftX} cy={cy} r="3.5" fill="#f59e0b" />

              {/* Axis Labels */}
              <text x={cx} y={cy - r - 8} fill="#e4e4e7" fontSize="8" fontWeight="600" textAnchor="middle" fontFamily="var(--font-mono)">
                METALLURGY ({metallurgyScore}%)
              </text>
              <text x={cx + r + 6} y={cy + 3} fill="#e4e4e7" fontSize="8" fontWeight="600" textAnchor="start" fontFamily="var(--font-mono)">
                COMPLICATIONS ({complicationsScore}%)
              </text>
              <text x={cx} y={cy + r + 15} fill="#e4e4e7" fontSize="8" fontWeight="600" textAnchor="middle" fontFamily="var(--font-mono)">
                PRESTIGE ({prestigeScore}%)
              </text>
              <text x={cx - r - 6} y={cy + 3} fill="#e4e4e7" fontSize="8" fontWeight="600" textAnchor="end" fontFamily="var(--font-mono)">
                PRECISION ({precisionScore}%)
              </text>
            </svg>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-400 pt-4 border-t border-zinc-800">
            <div>Noble Alloys in Safe: <span className="text-white font-bold">{nobleMetalsCount}</span></div>
            <div>Complications Mastered: <span className="text-white font-bold">{totalComps}</span></div>
          </div>
        </div>

        {/* Daily Challenges & Calibration Quests */}
        <div className="lg:col-span-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-amber-500">Daily Horological Trials</span>
              <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                <Calendar size={12} /> Resets in 16h
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-white mt-1">
              Temporal Quests
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'COSC Deadbeat Synchronization',
                task: 'Achieve sub-50ms variance on the 3.000s blind interval test.',
                reward: '+150 XP',
                done: bestDeadbeat.some(s => s <= 50),
                link: 'lab' as const
              },
              {
                title: 'High-Complication Blueprint',
                task: 'Equip a Flying Tourbillon and save a timepiece to your Vault.',
                reward: '+200 XP',
                done: watches.some(w => w.complications.includes('tourbillon')),
                link: 'studio' as const
              },
              {
                title: 'Automated Winder Maintenance',
                task: 'Operate all active watch winders in the Virtual Garage.',
                reward: '+100 XP',
                done: watches.length >= 2,
                link: 'vault' as const
              }
            ].map((quest, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 ${quest.done ? 'text-emerald-400' : 'text-zinc-600'}`}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-100">{quest.title}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{quest.task}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-amber-400 block">{quest.reward}</span>
                  {!quest.done && (
                    <button
                      onClick={() => onNavigate(quest.link)}
                      className="text-[10px] text-zinc-400 hover:text-white underline mt-1"
                    >
                      Complete →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
            <span className="text-amber-200">Total Vault Portfolio Valuation</span>
            <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
              {formatPrice(totalVaultValue, currency)}
            </span>
          </div>
        </div>

      </div>

      {/* 3. Horology Achievement Badges */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-mono uppercase text-amber-500">Recognized Horological Mastery</span>
          <h2 className="font-display text-2xl font-bold text-white mt-1">
            Haute Horlogerie Badges
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.achievements.map(ach => {
            const isUnlocked = (ach.progress >= ach.maxProgress) || !!ach.unlockedAt;
            return (
              <div
                key={ach.id}
                className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-zinc-900/80 border-amber-500/40 shadow-sm'
                    : 'bg-zinc-950/40 border-zinc-800/80 opacity-70'
                }`}
              >
                <div className={`p-3 rounded-xl shrink-0 ${
                  isUnlocked ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {isUnlocked ? <Award size={20} /> : <Lock size={20} />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white">{ach.title}</h3>
                    <span className="text-[10px] font-mono text-amber-400">+{ach.xpReward} XP</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">{ach.description}</p>
                  <p className="text-[10px] font-mono text-zinc-500 pt-1">
                    {isUnlocked ? 'UNLOCKED' : `PROGRESS: ${ach.progress} / ${ach.maxProgress}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
