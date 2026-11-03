import React from 'react';
import { ArrowRight, Sparkles, Gauge, Compass, ShieldCheck } from 'lucide-react';
import { WatchConfig, Currency } from '../types/watch';
import { MASTER_COLLECTION_TIMEPIECES, formatPrice, METALS } from '../data/horologySpecs';
import { WatchRenderer } from '../components/WatchRenderer';
import { horologyAudio } from '../utils/audio';

interface AtelierOverviewProps {
  currency: Currency;
  onSelectWatchForStudio: (watch: WatchConfig) => void;
  onNavigate: (page: 'studio' | 'vault' | 'lab' | 'collector') => void;
}

export const AtelierOverview: React.FC<AtelierOverviewProps> = ({
  currency,
  onSelectWatchForStudio,
  onNavigate
}) => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. Hero Section: Split Column Showcase */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-900/50 to-zinc-950 border border-zinc-800/80 p-6 sm:p-10 lg:p-14">
        {/* Subtle radial ambient background light */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-zinc-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Editorial Headline & Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400">
              <Sparkles size={14} />
              <span>Bespoke Swiss Haute Horlogerie & Temporal Physics</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
              Craft Your Signature Timepiece. Master Precision.
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl">
              CHRONOS bridges ancestral micro-mechanical Swiss watchmaking with quantum temporal simulation.
              Design a bespoke chronometer in noble metallurgy—solid platinum, aerospace titanium, and forged carbon—powered by high-complication flying tourbillons.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  horologyAudio.playHapticClick();
                  onSelectWatchForStudio(MASTER_COLLECTION_TIMEPIECES[0]);
                  onNavigate('studio');
                }}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold text-sm transition-all shadow-lg hover:shadow-amber-500/20 whitespace-nowrap"
              >
                <span>Enter Quantum Studio</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  horologyAudio.playHapticClick();
                  onNavigate('lab');
                }}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-medium text-sm transition-colors whitespace-nowrap"
              >
                <Gauge size={16} className="text-amber-400" />
                <span>Calibrate in Temporal Lab</span>
              </button>
            </div>

            {/* Micro proof / spec anchors */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-lg sm:text-xl font-bold font-mono tabular-nums text-zinc-100">28,800</p>
                <p className="text-xs text-zinc-500">VPH Frequency (4Hz)</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold font-mono tabular-nums text-zinc-100">72 Hours</p>
                <p className="text-xs text-zinc-500">Power Reserve</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold font-mono tabular-nums text-zinc-100">±1 Millisecond</p>
                <p className="text-xs text-zinc-500">Lab Calibration</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset & Real-time Mechanical Preview */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            <div className="relative group w-full max-w-sm rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950/80 shadow-2xl">
              <div className="relative aspect-square flex items-center justify-center p-4">
                <WatchRenderer
                  config={MASTER_COLLECTION_TIMEPIECES[0]}
                  size={320}
                  isPaused={false}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Sub-label banner */}
              <div className="px-5 py-4 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
                <div>
                  <h4 className="font-display text-sm font-bold text-zinc-200">Quantum Tourbillon No. 01</h4>
                  <p className="text-xs text-zinc-400">950 Solid Platinum · 60s Anti-Gravity Cage</p>
                </div>
                <span className="font-mono text-sm font-semibold text-amber-400">
                  {formatPrice(76000, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Master Concept Collections */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500">Curated Masterpieces</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              The Sovereign Collection
            </h2>
          </div>
          <p className="text-zinc-400 text-sm max-w-md">
            Three signature reference models forged by our master horologists. Select any model to customize every component in the Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {MASTER_COLLECTION_TIMEPIECES.map(watch => {
            const metal = METALS.find(m => m.id === watch.caseMetal);
            return (
              <div
                key={watch.id}
                className="group relative rounded-2xl bg-zinc-900/70 border border-zinc-800/80 hover:border-amber-500/50 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-xl hover:shadow-amber-500/5"
              >
                {/* Watch Renderer Visual */}
                <div className="relative p-6 flex items-center justify-center bg-radial from-zinc-800/40 to-transparent min-h-[300px]">
                  <WatchRenderer
                    config={watch}
                    size={240}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 text-[11px] font-mono text-zinc-400">
                    {watch.serialNumber}
                  </div>
                </div>

                {/* Information Body */}
                <div className="p-6 pt-2 flex-1 flex flex-col justify-between border-t border-zinc-800/60 space-y-4">
                  <div>
                    <div className="text-xs text-amber-400/90 font-mono uppercase mb-1">
                      {metal?.name} · {watch.caseDiameter}mm
                    </div>
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                      {watch.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {watch.notes}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-zinc-800/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Complications</span>
                      <span className="text-zinc-300 capitalize font-medium">
                        {watch.complications.join(' · ')}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        horologyAudio.playHapticClick();
                        onSelectWatchForStudio(watch);
                        onNavigate('studio');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 font-medium text-xs transition-colors"
                    >
                      <span>Customize in Studio</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Swiss Horological Ethos & High-Precision Calibration Section */}
      <section className="rounded-3xl bg-zinc-900/40 border border-zinc-800 p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 aspect-[4/3] group">
            <img
              src="/src/assets/images/chronos_craftsman_atelier_1793635588358.jpg"
              alt="Swiss watchmaker master artisan bench with loupe and precision tools"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-xs font-mono uppercase text-amber-400">Atelier Vallée de Joux</span>
              <p className="font-display text-lg font-bold text-white mt-1">
                Hand-Finished Anglage & Chronometric Micro-Regulation
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-500">
              <ShieldCheck size={14} />
              <span>Haute Horlogerie Standards</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              The Architecture of Mechanical Eternity
            </h2>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Every CHRONOS timepiece is engineered with micro-tolerances measured in microns. From the hand-filed interior angles of our ruthenium openworked bridges to the flame-blued screws and balance wheels oscillating at 28,800 vibrations per hour, our calibres represent the highest echelon of Swiss micro-engineering.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-800 text-amber-400 mt-0.5">
                  <Compass size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">Zero-Compromise Metallurgy</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                    We exclusively forge cases from 950 Solid Platinum, 18K King Rose Gold, Grade 5 Aerospace Titanium, and high-pressure Forged Carbon.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-zinc-800 text-amber-400 mt-0.5">
                  <Gauge size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-200">Temporal Lab Synchronization</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                    Calibrate your own internal chronometric rhythm against COSC standards in our interactive millisecond precision simulator.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  horologyAudio.playHapticClick();
                  onNavigate('vault');
                }}
                className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
              >
                <span>Explore the Watch Winder Vault</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
