import React, { useState } from 'react';
import {
  RotateCw,
  Search,
  SlidersHorizontal,
  Trash2,
  Copy,
  ExternalLink,
  Heart,
  Scale,
  Sparkles,
  Columns,
  X,
  Plus,
  Play,
  Square
} from 'lucide-react';
import { WatchConfig, Currency, UnitSystem } from '../types/watch';
import {
  calculateWatchPrice,
  calculateWatchWeight,
  calculateCraftingWeeks,
  formatPrice,
  METALS,
  DIALS,
  BEZELS,
  COMPLICATIONS,
  STRAPS
} from '../data/horologySpecs';
import { WatchRenderer } from '../components/WatchRenderer';
import { horologyAudio } from '../utils/audio';

interface WinderVaultProps {
  watches: WatchConfig[];
  onSelectWatchForStudio: (watch: WatchConfig) => void;
  onUpdateWatches: (watches: WatchConfig[]) => void;
  currency: Currency;
  unitSystem: UnitSystem;
  onNavigate: (page: 'studio' | 'atelier') => void;
}

export const WinderVault: React.FC<WinderVaultProps> = ({
  watches,
  onSelectWatchForStudio,
  onUpdateWatches,
  currency,
  unitSystem,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMetal, setFilterMetal] = useState<string>('all');
  const [filterComp, setFilterComp] = useState<string>('all');
  const [masterWinderRunning, setMasterWinderRunning] = useState(true);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Filter watches
  const filteredWatches = watches.filter(w => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.notes && w.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMetal = filterMetal === 'all' || w.caseMetal === filterMetal;
    const matchesComp = filterComp === 'all' || w.complications.includes(filterComp as any);

    return matchesSearch && matchesMetal && matchesComp;
  });

  const handleDeleteWatch = (id: string) => {
    horologyAudio.playHapticClick();
    const updated = watches.filter(w => w.id !== id);
    onUpdateWatches(updated);
    setSelectedForCompare(selectedForCompare.filter(itemId => itemId !== id));
  };

  const handleDuplicateWatch = (watch: WatchConfig) => {
    horologyAudio.playMinuteRepeaterChime(880);
    const duplicated: WatchConfig = {
      ...watch,
      id: `chronos-copy-${Date.now()}`,
      name: `${watch.name} (Copy)`,
      serialNumber: `CH-CP-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false
    };
    onUpdateWatches([duplicated, ...watches]);
  };

  const handleToggleFavorite = (id: string) => {
    horologyAudio.playHapticClick();
    const updated = watches.map(w => (w.id === id ? { ...w, isFavorite: !w.isFavorite } : w));
    onUpdateWatches(updated);
  };

  const toggleWinderIndividual = (id: string) => {
    horologyAudio.playHapticClick();
    const updated = watches.map(w => {
      if (w.id === id) {
        const currentActive = w.winderSettings?.isActive ?? true;
        return {
          ...w,
          winderSettings: {
            tpd: w.winderSettings?.tpd || 800,
            direction: w.winderSettings?.direction || 'cw',
            isActive: !currentActive
          }
        };
      }
      return w;
    });
    onUpdateWatches(updated);
  };

  const toggleCompareSelection = (id: string) => {
    horologyAudio.playHapticClick();
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter(i => i !== id));
    } else {
      if (selectedForCompare.length >= 3) {
        // limit to 3 watches comparison
        setSelectedForCompare([selectedForCompare[1], selectedForCompare[2], id]);
      } else {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  const compareWatches = watches.filter(w => selectedForCompare.includes(w.id));

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Header Banner with Vault Atmosphere */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-950 p-6 sm:p-10">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/chronos_vault_collection_1793635590040.jpg"
            alt="Watch Winder Safe Vault"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-500">
              Virtual Garage & Persistent Safe
            </span>
            <h1 className="font-display text-2xl sm:text-4xl font-bold text-white">
              Watch Winder Vault
            </h1>
            <p className="text-zinc-400 text-sm max-w-xl">
              Precision automated rotating winders ensure your mechanical calibres maintain peak mainspring torque. Filter, inspect, and benchmark your horological stable.
            </p>
          </div>

          {/* Master Winder Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                horologyAudio.playHapticClick();
                setMasterWinderRunning(!masterWinderRunning);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                masterWinderRunning
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              {masterWinderRunning ? <Square size={13} /> : <Play size={13} />}
              <span>{masterWinderRunning ? 'Motor Winders: ACTIVE' : 'Motor Winders: IDLE'}</span>
            </button>

            {selectedForCompare.length >= 2 && (
              <button
                onClick={() => {
                  horologyAudio.playHapticClick();
                  setIsCompareOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-semibold text-xs shadow-md hover:bg-amber-400 transition-colors"
              >
                <Columns size={14} />
                <span>Compare {selectedForCompare.length} Timepieces</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, serial, or notes..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <SlidersHorizontal size={13} />
            <span>Filters:</span>
          </div>

          <select
            value={filterMetal}
            onChange={e => setFilterMetal(e.target.value)}
            className="text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Metals</option>
            {METALS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <select
            value={filterComp}
            onChange={e => setFilterComp(e.target.value)}
            className="text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Complications</option>
            {COMPLICATIONS.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

      </div>

      {/* 3. Winder Pod Grid */}
      {filteredWatches.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-4">
          <RotateCw size={32} className="mx-auto text-zinc-600 animate-spin-slow" />
          <p className="text-zinc-400 text-sm">No timepieces matched your search criteria.</p>
          <button
            onClick={() => onNavigate('studio')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-zinc-950"
          >
            Forge a New Timepiece in Studio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredWatches.map(watch => {
            const price = calculateWatchPrice(watch);
            const weight = calculateWatchWeight(watch);
            const weightStr = unitSystem === 'imperial'
              ? `${(weight * 0.035274).toFixed(1)} oz`
              : `${weight} g`;

            const metal = METALS.find(m => m.id === watch.caseMetal);
            const isComparing = selectedForCompare.includes(watch.id);
            const isWinderActive = masterWinderRunning && (watch.winderSettings?.isActive ?? true);
            const direction = watch.winderSettings?.direction || 'cw';

            return (
              <div
                key={watch.id}
                className={`relative rounded-3xl bg-zinc-900/80 border transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-lg ${
                  isComparing
                    ? 'border-amber-500 ring-2 ring-amber-500/20'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Motor Winder Pod Visual Area */}
                <div className="relative p-6 flex flex-col items-center justify-center bg-radial from-zinc-800/40 via-zinc-900/60 to-zinc-950 min-h-[340px] overflow-hidden">
                  
                  {/* Motor Pod Ambient Backplate */}
                  <div className="absolute w-64 h-64 rounded-full border border-zinc-800/80 bg-zinc-950/60 shadow-inner flex items-center justify-center">
                    <div className="w-56 h-56 rounded-full border border-zinc-800/40" />
                  </div>

                  {/* Top Bar on Pod */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs z-10">
                    <span className="font-mono text-[11px] text-zinc-500">{watch.serialNumber}</span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleFavorite(watch.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          watch.isFavorite
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                            : 'bg-zinc-900/80 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                        }`}
                        title="Toggle Favorite"
                      >
                        <Heart size={13} fill={watch.isFavorite ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        onClick={() => toggleWinderIndividual(watch.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isWinderActive
                            ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                            : 'bg-zinc-900/80 border-zinc-800 text-zinc-600'
                        }`}
                        title={isWinderActive ? 'Motor Pod: ROTATING' : 'Motor Pod: PAUSED'}
                      >
                        <RotateCw size={13} className={isWinderActive ? 'animate-spin-slow' : ''} />
                      </button>
                    </div>
                  </div>

                  {/* Watch Renderer with Winder Rotation */}
                  <WatchRenderer
                    config={watch}
                    size={260}
                    winderSpinning={isWinderActive}
                    winderDirection={direction}
                    className="relative z-0"
                  />

                  {/* Winder Pod Calibration Indicator */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>TPD: {watch.winderSettings?.tpd || 800}</span>
                    <span className="capitalize">DIR: {direction}</span>
                    <span className={isWinderActive ? 'text-emerald-400' : 'text-zinc-600'}>
                      {isWinderActive ? 'WINDING' : 'STANDBY'}
                    </span>
                  </div>
                </div>

                {/* Information Card Body */}
                <div className="p-6 border-t border-zinc-800/80 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-mono text-amber-400 uppercase">
                        {metal?.name} · {watch.caseDiameter}mm
                      </p>
                      <h3 className="font-display text-lg font-bold text-white mt-0.5 line-clamp-1">
                        {watch.name}
                      </h3>
                    </div>
                    <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
                      {formatPrice(price, currency)}
                    </span>
                  </div>

                  {/* Complications summary */}
                  <div className="flex flex-wrap gap-1 text-[11px] text-zinc-400">
                    {watch.complications.map(c => (
                      <span key={c} className="bg-zinc-800/80 px-2 py-0.5 rounded text-zinc-300 capitalize">
                        {c.replace('_', ' ')}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-zinc-800/60">
                    
                    {/* Select for Compare */}
                    <button
                      onClick={() => toggleCompareSelection(watch.id)}
                      className={`col-span-1 py-2 px-1 text-center rounded-lg border text-xs font-medium transition-colors ${
                        isComparing
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                      title="Select for Side-by-Side Comparison"
                    >
                      {isComparing ? 'Selected' : 'Compare'}
                    </button>

                    {/* Customize in Studio */}
                    <button
                      onClick={() => {
                        horologyAudio.playHapticClick();
                        onSelectWatchForStudio(watch);
                        onNavigate('studio');
                      }}
                      className="col-span-2 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ExternalLink size={13} />
                      <span>Edit in Studio</span>
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicateWatch(watch)}
                      className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                      title="Duplicate Blueprint"
                    >
                      <Copy size={13} />
                    </button>

                    {/* Delete (if more than 1 watch) */}
                    {watches.length > 1 && (
                      <button
                        onClick={() => handleDeleteWatch(watch.id)}
                        className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-rose-950/40 hover:border-rose-900 text-zinc-500 hover:text-rose-400 flex items-center justify-center transition-colors"
                        title="Delete from Vault"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 4. Side-by-Side Comparison Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-amber-500">Comparative Horology Matrix</span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Side-by-Side Specification Benchmark
                </h2>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="p-3 text-zinc-500 font-mono uppercase">Specification</th>
                    {compareWatches.map(w => (
                      <th key={w.id} className="p-3 min-w-[220px]">
                        <div className="flex flex-col items-center">
                          <WatchRenderer config={w} size={150} isPaused={true} />
                          <p className="font-display text-sm font-bold text-white mt-2 text-center">{w.name}</p>
                          <p className="font-mono text-amber-400 font-semibold mt-1">
                            {formatPrice(calculateWatchPrice(w), currency)}
                          </p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  <tr>
                    <td className="p-3 text-zinc-400 font-sans font-semibold">Case Metal</td>
                    {compareWatches.map(w => (
                      <td key={w.id} className="p-3 text-zinc-200">
                        {METALS.find(m => m.id === w.caseMetal)?.name}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-sans font-semibold">Diameter & Height</td>
                    {compareWatches.map(w => (
                      <td key={w.id} className="p-3 text-zinc-200">{w.caseDiameter} mm</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-sans font-semibold">Dial Motif</td>
                    {compareWatches.map(w => (
                      <td key={w.id} className="p-3 text-zinc-200">
                        {DIALS.find(d => d.id === w.dialTexture)?.name}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-sans font-semibold">Bezel Architecture</td>
                    {compareWatches.map(w => (
                      <td key={w.id} className="p-3 text-zinc-200">
                        {BEZELS.find(b => b.id === w.bezel)?.name}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-sans font-semibold">Complications</td>
                    {compareWatches.map(w => (
                      <td key={w.id} className="p-3 text-zinc-200">
                        {w.complications.map(c => COMPLICATIONS.find(comp => comp.id === c)?.name).join(' · ')}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-sans font-semibold">Total Weight</td>
                    {compareWatches.map(w => {
                      const wt = calculateWatchWeight(w);
                      return (
                        <td key={w.id} className="p-3 text-zinc-200">
                          {unitSystem === 'imperial' ? `${(wt * 0.035274).toFixed(1)} oz` : `${wt} g`}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-sans font-semibold">Lead Time</td>
                    {compareWatches.map(w => (
                      <td key={w.id} className="p-3 text-zinc-200">{calculateCraftingWeeks(w)} Weeks</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-zinc-400 font-sans font-semibold">Actions</td>
                    {compareWatches.map(w => (
                      <td key={w.id} className="p-3">
                        <button
                          onClick={() => {
                            horologyAudio.playHapticClick();
                            setIsCompareOpen(false);
                            onSelectWatchForStudio(w);
                            onNavigate('studio');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 text-xs font-semibold transition-colors"
                        >
                          Open in Studio
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
