import React, { useState, useRef, useEffect } from 'react';
import {
  Timer,
  Zap,
  Activity,
  Award,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Gauge
} from 'lucide-react';
import { TemporalScore, CollectorProfile } from '../types/watch';
import { horologyAudio } from '../utils/audio';
import { recordTemporalScore } from '../utils/storage';

interface TemporalLabProps {
  onScoreRecorded: (updatedProfile: CollectorProfile) => void;
  soundEnabled: boolean;
  onNavigate: (page: 'collector') => void;
}

export const TemporalLab: React.FC<TemporalLabProps> = ({
  onScoreRecorded,
  soundEnabled,
  onNavigate
}) => {
  const [activeMode, setActiveMode] = useState<'deadbeat' | 'reflex' | 'cadence'>('deadbeat');

  // Deadbeat Synchronizer State
  const [deadbeatTarget, setDeadbeatTarget] = useState<number>(3000); // 3 seconds in ms
  const [deadbeatRunning, setDeadbeatRunning] = useState<boolean>(false);
  const [deadbeatElapsed, setDeadbeatElapsed] = useState<number>(0);
  const [deadbeatResult, setDeadbeatResult] = useState<{
    delta: number;
    actual: number;
    rating: string;
    score: number;
  } | null>(null);

  // Escapement Reflex State
  const [reflexState, setReflexState] = useState<'idle' | 'armed' | 'triggered' | 'finished' | 'fault'>('idle');
  const [reflexTime, setReflexTime] = useState<number | null>(null);
  const reflexStartRef = useRef<number>(0);
  const reflexTimeoutRef = useRef<number | null>(null);

  // Cadence Balancer State (4Hz = 28,800 vph, 250ms interval)
  const [cadenceTargetHz] = useState<number>(4); // 4Hz = 250ms
  const [cadenceTaps, setCadenceTaps] = useState<number[]>([]);
  const [cadenceResult, setCadenceResult] = useState<{
    accuracy: number;
    avgIntervalMs: number;
    bpm: number;
    rating: string;
  } | null>(null);

  const timerAnimRef = useRef<number | null>(null);
  const deadbeatStartRef = useRef<number>(0);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerAnimRef.current) cancelAnimationFrame(timerAnimRef.current);
      if (reflexTimeoutRef.current) clearTimeout(reflexTimeoutRef.current);
    };
  }, []);

  // --- 1. Deadbeat Synchronizer Functions ---
  const startDeadbeat = () => {
    horologyAudio.playHapticClick();
    setDeadbeatResult(null);
    setDeadbeatElapsed(0);
    setDeadbeatRunning(true);
    deadbeatStartRef.current = performance.now();

    const tick = () => {
      const now = performance.now();
      const elapsed = Math.round(now - deadbeatStartRef.current);
      setDeadbeatElapsed(elapsed);
      timerAnimRef.current = requestAnimationFrame(tick);
    };
    timerAnimRef.current = requestAnimationFrame(tick);
  };

  const stopDeadbeat = () => {
    if (!deadbeatRunning) return;
    if (timerAnimRef.current) cancelAnimationFrame(timerAnimRef.current);
    const now = performance.now();
    const actual = Math.round(now - deadbeatStartRef.current);
    setDeadbeatRunning(false);
    setDeadbeatElapsed(actual);

    const delta = Math.abs(actual - deadbeatTarget);
    let rating = 'Desynchronized Drift';
    if (delta <= 15) {
      rating = 'COSC Superlative Chronometer Grade';
      horologyAudio.playMinuteRepeaterChime(1318);
    } else if (delta <= 45) {
      rating = 'Swiss Certified Chronometer';
      horologyAudio.playMinuteRepeaterChime(1046);
    } else if (delta <= 120) {
      rating = 'Commercial Horology Standard';
      horologyAudio.playHapticClick();
    } else {
      horologyAudio.playHapticClick();
    }

    const res = { delta, actual, rating, score: delta };
    setDeadbeatResult(res);

    const scorePayload: TemporalScore = {
      id: `score-${Date.now()}`,
      gameMode: 'deadbeat',
      score: delta,
      rating,
      timestamp: Date.now(),
      target: deadbeatTarget
    };
    const updated = recordTemporalScore(scorePayload);
    onScoreRecorded(updated);
  };

  // --- 2. Escapement Reflex Functions ---
  const armReflex = () => {
    horologyAudio.playHapticClick();
    setReflexState('armed');
    setReflexTime(null);

    // Random trigger delay between 1.8s and 4.5s
    const delay = Math.floor(1800 + Math.random() * 2700);
    reflexTimeoutRef.current = window.setTimeout(() => {
      setReflexState('triggered');
      reflexStartRef.current = performance.now();
      horologyAudio.playMechanicalTick(false);
    }, delay);
  };

  const triggerReflexClick = () => {
    if (reflexState === 'armed') {
      // Clicked too early!
      if (reflexTimeoutRef.current) clearTimeout(reflexTimeoutRef.current);
      setReflexState('fault');
      horologyAudio.playHapticClick();
      return;
    }

    if (reflexState === 'triggered') {
      const reactionMs = Math.round(performance.now() - reflexStartRef.current);
      setReflexTime(reactionMs);
      setReflexState('finished');

      let rating = 'Standard Reflex';
      if (reactionMs < 190) {
        rating = 'Quantum Escapement Speed (<190ms)';
        horologyAudio.playMinuteRepeaterChime(1174);
      } else if (reactionMs < 240) {
        rating = 'Master Artisan Reflex (<240ms)';
        horologyAudio.playMinuteRepeaterChime(987);
      } else {
        rating = 'Standard Human Reflex';
        horologyAudio.playHapticClick();
      }

      const scorePayload: TemporalScore = {
        id: `reflex-${Date.now()}`,
        gameMode: 'reflex',
        score: reactionMs,
        rating,
        timestamp: Date.now()
      };
      const updated = recordTemporalScore(scorePayload);
      onScoreRecorded(updated);
    }
  };

  // --- 3. Cadence Balancer Functions ---
  const handleCadenceTap = () => {
    const now = performance.now();
    horologyAudio.playMechanicalTick(cadenceTaps.length % 2 === 0);

    const nextTaps = [...cadenceTaps, now];
    setCadenceTaps(nextTaps);

    if (nextTaps.length >= 8) {
      // Calculate intervals
      const intervals: number[] = [];
      for (let i = 1; i < nextTaps.length; i++) {
        intervals.push(nextTaps[i] - nextTaps[i - 1]);
      }

      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const targetInterval = 1000 / cadenceTargetHz; // 250ms for 4Hz
      const errorRatio = Math.abs(avgInterval - targetInterval) / targetInterval;
      const accuracy = Math.max(0, Math.round((1 - errorRatio) * 100));

      const bpm = Math.round((60000 / avgInterval));
      let rating = 'Irregular Oscillation';
      if (accuracy >= 94) {
        rating = '28,800 VPH High-Frequency Resonance';
        horologyAudio.playMinuteRepeaterChime(1318);
      } else if (accuracy >= 85) {
        rating = 'Synchronized Escapement Rhythm';
        horologyAudio.playMinuteRepeaterChime(880);
      } else {
        rating = 'Isochronism Variance';
      }

      const res = {
        accuracy,
        avgIntervalMs: Math.round(avgInterval),
        bpm,
        rating
      };
      setCadenceResult(res);

      const scorePayload: TemporalScore = {
        id: `cadence-${Date.now()}`,
        gameMode: 'cadence',
        score: accuracy,
        rating,
        timestamp: Date.now()
      };
      const updated = recordTemporalScore(scorePayload);
      onScoreRecorded(updated);
    }
  };

  const resetCadence = () => {
    setCadenceTaps([]);
    setCadenceResult(null);
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500">
              Chronometric Precision Simulator
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-white mt-1">
              Temporal Calibration Lab
            </h1>
            <p className="text-zinc-400 text-sm max-w-xl mt-2 leading-relaxed">
              Test your internal human clock against Swiss COSC tolerances. Calibrate blind intervals, instant escapement reflex, and 28,800 VPH balance wheel cadence.
            </p>
          </div>

          <button
            onClick={() => onNavigate('collector')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-amber-500 text-zinc-200 text-xs font-medium transition-colors whitespace-nowrap self-start sm:self-end"
          >
            <Trophy size={14} className="text-amber-400" />
            <span>View Collector Leaderboard</span>
          </button>
        </div>
      </div>

      {/* 2. Challenge Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            id: 'deadbeat',
            title: 'Deadbeat Synchronizer',
            subtitle: 'Blind Interval Precision (COSC)',
            icon: <Timer size={18} />
          },
          {
            id: 'reflex',
            title: 'Escapement Reflex',
            subtitle: 'Sub-Millisecond Impulse Reaction',
            icon: <Zap size={18} />
          },
          {
            id: 'cadence',
            title: 'Cadence Balancer',
            subtitle: '28,800 VPH (4Hz) Tap Tempo',
            icon: <Activity size={18} />
          }
        ].map(challenge => {
          const isActive = activeMode === challenge.id;
          return (
            <button
              key={challenge.id}
              onClick={() => {
                horologyAudio.playHapticClick();
                setActiveMode(challenge.id as any);
              }}
              className={`text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                isActive
                  ? 'bg-zinc-900 border-amber-500 shadow-md ring-1 ring-amber-500/20'
                  : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${isActive ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                {challenge.icon}
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-zinc-200'}`}>
                  {challenge.title}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">{challenge.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Challenge Workbench Area */}
      <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-10 min-h-[440px] flex flex-col justify-between">
        
        {/* MODE 1: DEADBEAT SYNCHRONIZER */}
        {activeMode === 'deadbeat' && (
          <div className="space-y-8 max-w-2xl mx-auto text-center w-full">
            <div>
              <span className="text-xs font-mono uppercase text-amber-500">Trial 01 // Deadbeat Seconds</span>
              <h2 className="font-display text-2xl font-bold text-white mt-1">
                Blind Chronometer Synchronization
              </h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                The timer will display for the first 1.0 second, then occlude completely. Stop the mechanism precisely on your target interval.
              </p>
            </div>

            {/* Target Selector */}
            <div className="flex items-center justify-center gap-3">
              {[1000, 3000, 5000].map(target => (
                <button
                  key={target}
                  disabled={deadbeatRunning}
                  onClick={() => setDeadbeatTarget(target)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors ${
                    deadbeatTarget === target
                      ? 'bg-amber-500 text-zinc-950'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {(target / 1000).toFixed(1)}s Target
                </button>
              ))}
            </div>

            {/* Dial Display */}
            <div className="relative w-64 h-64 mx-auto rounded-full border-2 border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center shadow-inner">
              <div className="absolute inset-2 rounded-full border border-zinc-800/60" />

              {deadbeatRunning && deadbeatElapsed > 1000 ? (
                <div className="text-center px-4 space-y-1">
                  <span className="text-xs font-mono text-amber-400 animate-pulse block">BLIND SYNCHRONY</span>
                  <p className="text-[10px] text-zinc-500">Sense the precise target...</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-mono text-4xl font-bold tabular-nums text-white">
                    {(deadbeatElapsed / 1000).toFixed(3)}s
                  </p>
                  <p className="font-mono text-xs text-zinc-500 mt-1">
                    TARGET: {(deadbeatTarget / 1000).toFixed(3)}s
                  </p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div>
              {!deadbeatRunning ? (
                <button
                  onClick={startDeadbeat}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg hover:shadow-amber-500/20 transition-all"
                >
                  Release Chronograph (START)
                </button>
              ) : (
                <button
                  onClick={stopDeadbeat}
                  className="px-10 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-base shadow-xl animate-pulse transition-all"
                >
                  STOP MECHANISM
                </button>
              )}
            </div>

            {/* Results Output */}
            {deadbeatResult && (
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
                  <Award size={18} />
                  <span>{deadbeatResult.rating}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 font-mono text-xs max-w-xs mx-auto">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-zinc-500">Elapsed Time</p>
                    <p className="text-white text-base font-bold mt-0.5">
                      {(deadbeatResult.actual / 1000).toFixed(3)}s
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-zinc-500">Delta Variance</p>
                    <p className={`text-base font-bold mt-0.5 ${deadbeatResult.delta <= 15 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      ±{deadbeatResult.delta} ms
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MODE 2: ESCAPEMENT REFLEX */}
        {activeMode === 'reflex' && (
          <div className="space-y-8 max-w-2xl mx-auto text-center w-full">
            <div>
              <span className="text-xs font-mono uppercase text-amber-500">Trial 02 // Micro-Reflex</span>
              <h2 className="font-display text-2xl font-bold text-white mt-1">
                Quantum Escapement Reflex
              </h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                Click ARM. Wait for the sudden escapement release impulse, then click as rapidly as possible.
              </p>
            </div>

            {/* Interactive Flash Pad */}
            <div
              onClick={triggerReflexClick}
              className={`w-full max-w-md mx-auto h-56 rounded-3xl border-2 flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-150 ${
                reflexState === 'idle'
                  ? 'bg-zinc-950 border-zinc-800 text-zinc-500'
                  : reflexState === 'armed'
                  ? 'bg-amber-950/20 border-amber-800/80 text-amber-300'
                  : reflexState === 'triggered'
                  ? 'bg-emerald-500 border-white text-zinc-950 scale-105 shadow-2xl'
                  : reflexState === 'fault'
                  ? 'bg-rose-950/50 border-rose-700 text-rose-300'
                  : 'bg-zinc-950 border-zinc-800 text-white'
              }`}
            >
              {reflexState === 'idle' && (
                <div className="space-y-2">
                  <Zap size={32} className="mx-auto text-zinc-600" />
                  <p className="text-xs font-mono">STANDBY — CLICK 'ARM' BELOW</p>
                </div>
              )}

              {reflexState === 'armed' && (
                <div className="space-y-2">
                  <div className="w-4 h-4 rounded-full bg-amber-400 animate-ping mx-auto" />
                  <p className="text-sm font-bold font-mono">TENSION APPLIED... PREPARE</p>
                  <p className="text-[10px] text-amber-400/80">DO NOT CLICK PREMATURELY</p>
                </div>
              )}

              {reflexState === 'triggered' && (
                <div className="space-y-1">
                  <p className="text-3xl font-black font-mono">RELEASE!</p>
                  <p className="text-xs font-semibold">CLICK NOW!</p>
                </div>
              )}

              {reflexState === 'fault' && (
                <div className="space-y-2">
                  <AlertCircle size={32} className="mx-auto text-rose-400" />
                  <p className="text-sm font-bold">PREMATURE ESCAPEMENT RELEASE</p>
                  <p className="text-xs text-rose-300/80">You clicked before the impulse. Click Arm to retry.</p>
                </div>
              )}

              {reflexState === 'finished' && reflexTime !== null && (
                <div className="space-y-1">
                  <p className="text-zinc-400 text-xs font-mono">REACTION LATENCY</p>
                  <p className="font-mono text-5xl font-black text-amber-400">{reflexTime} ms</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div>
              {reflexState !== 'armed' && reflexState !== 'triggered' && (
                <button
                  onClick={armReflex}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm shadow-lg transition-all"
                >
                  Arm Escapement Mechanism
                </button>
              )}
            </div>
          </div>
        )}

        {/* MODE 3: CADENCE BALANCER */}
        {activeMode === 'cadence' && (
          <div className="space-y-8 max-w-2xl mx-auto text-center w-full">
            <div>
              <span className="text-xs font-mono uppercase text-amber-500">Trial 03 // Balance Wheel Isochronism</span>
              <h2 className="font-display text-2xl font-bold text-white mt-1">
                28,800 VPH (4Hz) Cadence Harmonizer
              </h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                Tap the virtual balance wheel to calibrate a steady 4 beats per second (250ms per half-oscillation).
              </p>
            </div>

            {/* Tap Pad */}
            <div
              onClick={handleCadenceTap}
              className="w-56 h-56 mx-auto rounded-full border-4 border-amber-500/40 bg-zinc-950 hover:bg-zinc-900 active:scale-95 cursor-pointer flex flex-col items-center justify-center transition-transform select-none shadow-xl"
            >
              <Activity size={36} className="text-amber-400 mb-2" />
              <p className="font-display text-base font-bold text-white">TAP CADENCE</p>
              <p className="font-mono text-xs text-zinc-500 mt-1">
                {cadenceTaps.length} / 8 Beats
              </p>
            </div>

            {/* Results */}
            {cadenceResult && (
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
                  <CheckCircle2 size={18} />
                  <span>{cadenceResult.rating}</span>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono text-xs max-w-sm mx-auto">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-zinc-500">Accuracy</p>
                    <p className="text-white text-base font-bold mt-0.5">{cadenceResult.accuracy}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-zinc-500">Interval</p>
                    <p className="text-white text-base font-bold mt-0.5">{cadenceResult.avgIntervalMs} ms</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                    <p className="text-zinc-500">Calculated VPH</p>
                    <p className="text-white text-base font-bold mt-0.5">{cadenceResult.bpm * 60}</p>
                  </div>
                </div>

                <button
                  onClick={resetCadence}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white pt-1"
                >
                  <RotateCcw size={12} />
                  <span>Reset Cadence Balancer</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="text-center pt-6 border-t border-zinc-800/80 text-xs text-zinc-500 font-mono">
          <span>COSC SWISS TOLERANCE: -4/+6 SECONDS PER DAY · REAL-TIME MILLISECOND RESOLUTION</span>
        </div>

      </div>

    </div>
  );
};
