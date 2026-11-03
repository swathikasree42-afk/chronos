import React, { useState } from 'react';
import {
  RotateCcw,
  Save,
  FileDown,
  Layers,
  CircleDot,
  Clock,
  Sparkles,
  Sliders,
  Eye,
  Check,
  Compass,
  Scale,
  Calendar,
  Shield,
  Volume2,
  VolumeX
} from 'lucide-react';
import {
  WatchConfig,
  CaseMetal,
  CaseDiameter,
  DialTexture,
  BezelType,
  ComplicationType,
  HandsStyle,
  StrapMaterial,
  LumeColor,
  Currency,
  UnitSystem
} from '../types/watch';
import {
  METALS,
  DIALS,
  BEZELS,
  COMPLICATIONS,
  HANDS_STYLES,
  STRAPS,
  LUME_COLORS,
  CASE_DIAMETERS,
  calculateWatchPrice,
  calculateWatchWeight,
  calculateCraftingWeeks,
  formatPrice
} from '../data/horologySpecs';
import { WatchRenderer } from '../components/WatchRenderer';
import { horologyAudio } from '../utils/audio';

interface QuantumStudioProps {
  currentWatch: WatchConfig;
  onUpdateWatch: (updated: WatchConfig) => void;
  onSaveToVault: (watch: WatchConfig) => void;
  currency: Currency;
  unitSystem: UnitSystem;
  soundEnabled: boolean;
  onNavigate: (page: 'vault' | 'lab') => void;
}

export const QuantumStudio: React.FC<QuantumStudioProps> = ({
  currentWatch,
  onUpdateWatch,
  onSaveToVault,
  currency,
  unitSystem,
  soundEnabled,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'case' | 'dial' | 'complications' | 'hands_lume' | 'strap' | 'caseback'>('case');
  const [isExhibitionBack, setIsExhibitionBack] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [localAudioTick, setLocalAudioTick] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const price = calculateWatchPrice(currentWatch);
  const weightGrams = calculateWatchWeight(currentWatch);
  const weightDisplay = unitSystem === 'imperial'
    ? `${(weightGrams * 0.035274).toFixed(1)} oz`
    : `${weightGrams} g`;

  const craftingWeeks = calculateCraftingWeeks(currentWatch);

  const handleFieldChange = <K extends keyof WatchConfig>(field: K, value: WatchConfig[K]) => {
    horologyAudio.playHapticClick();
    onUpdateWatch({
      ...currentWatch,
      [field]: value,
      updatedAt: Date.now()
    });
  };

  const toggleComplication = (comp: ComplicationType) => {
    horologyAudio.playHapticClick();
    const current = currentWatch.complications || [];
    let next: ComplicationType[];
    if (current.includes(comp)) {
      next = current.filter(c => c !== comp);
    } else {
      next = [...current, comp];
    }
    handleFieldChange('complications', next);
  };

  const handleSave = () => {
    horologyAudio.playMinuteRepeaterChime(1174);
    onSaveToVault(currentWatch);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  const exportSpecSheet = () => {
    horologyAudio.playHapticClick();
    const specData = {
      title: 'CHRONOS HAUTE HORLOGERIE BESPOKE SPECIFICATION',
      watchName: currentWatch.name,
      serialNumber: currentWatch.serialNumber,
      caseMetal: METALS.find(m => m.id === currentWatch.caseMetal)?.name,
      caseDiameter: `${currentWatch.caseDiameter} mm`,
      dialMotif: DIALS.find(d => d.id === currentWatch.dialTexture)?.name,
      bezel: BEZELS.find(b => b.id === currentWatch.bezel)?.name,
      complications: currentWatch.complications.map(c => COMPLICATIONS.find(comp => comp.id === c)?.name).join(', '),
      hands: HANDS_STYLES.find(h => h.id === currentWatch.handsStyle)?.name,
      strap: STRAPS.find(s => s.id === currentWatch.strap)?.name,
      lume: LUME_COLORS.find(l => l.id === currentWatch.lumeColor)?.name,
      rotorEngraving: currentWatch.rotorEngraving,
      weight: weightDisplay,
      estimatedProductionLeadTime: `${craftingWeeks} Weeks`,
      valuation: formatPrice(price, currency),
      dateGenerated: new Date().toLocaleDateString()
    };

    const blob = new Blob([JSON.stringify(specData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chronos-Spec-${currentWatch.serialNumber.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const studioTabs: { id: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { id: 'case', label: 'Case & Metal', icon: <Compass size={14} /> },
    { id: 'dial', label: 'Dial & Texture', icon: <CircleDot size={14} /> },
    { id: 'complications', label: 'Complications', icon: <Layers size={14} /> },
    { id: 'hands_lume', label: 'Hands & Lume', icon: <Sliders size={14} /> },
    { id: 'strap', label: 'Strap & Clasp', icon: <Clock size={14} /> },
    { id: 'caseback', label: 'Exhibition Back', icon: <Sparkles size={14} /> }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-500">Quantum Atelier Workbench</span>
          <div className="flex items-center gap-3 mt-1">
            <input
              type="text"
              value={currentWatch.name}
              onChange={e => handleFieldChange('name', e.target.value)}
              className="font-display text-2xl sm:text-3xl font-bold text-white bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-amber-500 focus:outline-none transition-colors max-w-lg"
              placeholder="Signature Timepiece Name"
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono mt-1">
            <span>SERIAL: {currentWatch.serialNumber}</span>
            <span>·</span>
            <span>28,800 VPH ESCAPEMENT</span>
          </div>
        </div>

        {/* Live Real-Time Pricing & Action Cluster */}
        <div className="flex items-center gap-3">
          <div className="text-right sm:pr-4 sm:border-r sm:border-zinc-800">
            <p className="text-[10px] font-mono text-zinc-400 uppercase">Bespoke Valuation</p>
            <p className="font-mono text-2xl font-bold text-amber-400 tabular-nums">
              {formatPrice(price, currency)}
            </p>
          </div>

          <button
            onClick={exportSpecSheet}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors whitespace-nowrap"
            title="Export Spec Sheet JSON"
          >
            <FileDown size={14} />
            <span>Export Spec</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-semibold text-xs transition-all shadow-md hover:shadow-amber-500/20 whitespace-nowrap"
          >
            <Save size={15} />
            <span>Save to Vault</span>
          </button>
        </div>
      </div>

      {/* Save Toast Notification */}
      {saveToast && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <Check size={18} className="text-amber-400" />
            <span>Timepiece saved to your Watch Winder Vault. Synchronized with local storage.</span>
          </div>
          <button
            onClick={() => onNavigate('vault')}
            className="underline font-semibold hover:text-white ml-4 whitespace-nowrap"
          >
            Open Vault →
          </button>
        </div>
      )}

      {/* 2-Column Split: Left Watch Visualizer, Right Customization Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visualizer Viewport (Sticky on Desktop) */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-4">
          <div className="relative rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 p-6 sm:p-10 flex flex-col items-center justify-center min-h-[460px] overflow-hidden">
            
            {/* Background lighting flare */}
            <div className="absolute inset-0 bg-radial from-amber-500/5 via-transparent to-transparent pointer-events-none" />

            {/* Viewport Floating Controls */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs z-10">
              <button
                onClick={() => {
                  horologyAudio.playHapticClick();
                  setIsExhibitionBack(!isExhibitionBack);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                  isExhibitionBack
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-zinc-900/80 border-zinc-700/80 text-zinc-300 hover:text-white'
                }`}
              >
                <Eye size={13} />
                <span>{isExhibitionBack ? 'View Dial Front' : 'Flip to Exhibition Back'}</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Audio Tick Toggle for Studio */}
                {soundEnabled && (
                  <button
                    onClick={() => setLocalAudioTick(!localAudioTick)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      localAudioTick
                        ? 'bg-amber-950/40 border-amber-800/80 text-amber-300'
                        : 'bg-zinc-900/80 border-zinc-700/80 text-zinc-400 hover:text-zinc-200'
                    }`}
                    title={localAudioTick ? 'Studio Escapement Audio: ON' : 'Studio Escapement Audio: OFF'}
                  >
                    {localAudioTick ? <Volume2 size={13} /> : <VolumeX size={13} />}
                  </button>
                )}

                {/* Sweep vs Pause */}
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-700/80 text-zinc-300 hover:text-white transition-colors"
                  title="Pause / Resume Live Sweep"
                >
                  {isPaused ? 'Resume Sweep' : 'Pause'}
                </button>
              </div>
            </div>

            {/* Central SVG Watch Engine */}
            <WatchRenderer
              config={currentWatch}
              size={360}
              isExhibitionBack={isExhibitionBack}
              isPaused={isPaused}
              playAudio={localAudioTick && soundEnabled}
              className="mt-6 mb-2"
            />

            {/* Viewport Bottom Spec Ticker */}
            <div className="w-full grid grid-cols-4 gap-2 pt-4 border-t border-zinc-800/80 text-center font-mono text-xs">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase flex items-center justify-center gap-1">
                  <Compass size={10} /> Diameter
                </p>
                <p className="font-semibold text-zinc-200 mt-0.5">{currentWatch.caseDiameter} mm</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase flex items-center justify-center gap-1">
                  <Scale size={10} /> Weight
                </p>
                <p className="font-semibold text-zinc-200 mt-0.5">{weightDisplay}</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase flex items-center justify-center gap-1">
                  <Calendar size={10} /> Handcrafted
                </p>
                <p className="font-semibold text-zinc-200 mt-0.5">{craftingWeeks} wks</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase flex items-center justify-center gap-1">
                  <Shield size={10} /> Rating
                </p>
                <p className="font-semibold text-zinc-200 mt-0.5">100 M (10 BAR)</p>
              </div>
            </div>

          </div>

          {/* Quick Notes / Inscription box */}
          <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <span>Atelier Horologist Log & Notes</span>
            </label>
            <textarea
              rows={2}
              value={currentWatch.notes || ''}
              onChange={e => handleFieldChange('notes', e.target.value)}
              placeholder="e.g. Bespoke commission with Muonionalusta meteorite dial and high-frequency tourbillon..."
              className="w-full text-xs bg-zinc-950/60 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Right Column: Interactive Workbench Controls */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Workbench Section Tabs */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 bg-zinc-900/80 rounded-xl border border-zinc-800">
            {studioTabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    horologyAudio.playHapticClick();
                    setActiveTab(tab.id);
                    if (tab.id === 'caseback') {
                      setIsExhibitionBack(true);
                    } else if (isExhibitionBack) {
                      setIsExhibitionBack(false);
                    }
                  }}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[11px] font-medium transition-colors gap-1 ${
                    isActive
                      ? 'bg-zinc-800 text-amber-300 shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  {tab.icon}
                  <span className="truncate max-w-[70px]">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Case Metal & Diameter */}
          {activeTab === 'case' && (
            <div className="space-y-6">
              
              {/* Case Metal Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-200">Case Metallurgy</h3>
                  <span className="text-xs text-zinc-500 font-mono">6 Noble Alloys</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {METALS.map(metal => {
                    const isSelected = currentWatch.caseMetal === metal.id;
                    return (
                      <button
                        key={metal.id}
                        onClick={() => handleFieldChange('caseMetal', metal.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'bg-zinc-900 border-amber-500/80 ring-1 ring-amber-500/40'
                            : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-4 h-4 rounded-full border border-white/20 shadow-inner"
                              style={{ backgroundColor: metal.hex }}
                            />
                            <span className="text-xs font-semibold text-zinc-100">{metal.name}</span>
                          </div>
                          {isSelected && <Check size={14} className="text-amber-400" />}
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-normal">{metal.description}</p>
                        <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-zinc-800/60">
                          <span className="text-zinc-500">{metal.density}</span>
                          <span className="text-amber-400 font-semibold">{formatPrice(metal.basePrice, currency)}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Case Diameter Selection */}
              <div className="space-y-3 pt-4 border-t border-zinc-800/80">
                <h3 className="text-sm font-bold text-zinc-200">Case Diameter & Proportions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CASE_DIAMETERS.map(diam => {
                    const isSelected = currentWatch.caseDiameter === diam.size;
                    return (
                      <button
                        key={diam.size}
                        onClick={() => handleFieldChange('caseDiameter', diam.size)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-zinc-900 border-amber-500 text-amber-300 font-semibold'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <span className="text-lg font-mono font-bold block">{diam.size} mm</span>
                        <span className="text-[10px] text-zinc-500 block mt-0.5">{diam.thickness}mm thick</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bezel Selection */}
              <div className="space-y-3 pt-4 border-t border-zinc-800/80">
                <h3 className="text-sm font-bold text-zinc-200">Bezel Architecture</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {BEZELS.map(bezel => {
                    const isSelected = currentWatch.bezel === bezel.id;
                    return (
                      <button
                        key={bezel.id}
                        onClick={() => handleFieldChange('bezel', bezel.id)}
                        className={`text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-zinc-900 border-amber-500/80'
                            : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold text-zinc-200">{bezel.name}</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{bezel.description}</p>
                        </div>
                        <span className="font-mono text-xs text-amber-400 font-semibold whitespace-nowrap ml-4">
                          +{formatPrice(bezel.price, currency)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Dial Texture & Aesthetic Motif */}
          {activeTab === 'dial' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-200">Dial Craftsmanship & Materials</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  The face of the chronometer: select from openworked skeleton calibres to genuine 4-billion-year-old meteorites.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DIALS.map(dial => {
                  const isSelected = currentWatch.dialTexture === dial.id;
                  return (
                    <button
                      key={dial.id}
                      onClick={() => handleFieldChange('dialTexture', dial.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'bg-zinc-900 border-amber-500/80 ring-1 ring-amber-500/40'
                          : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border border-white/20"
                            style={{ backgroundColor: dial.previewColor }}
                          />
                          <span className="text-xs font-semibold text-zinc-100">{dial.name}</span>
                        </div>
                        {isSelected && <Check size={14} className="text-amber-400" />}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-normal">{dial.description}</p>
                      <div className="text-right text-[11px] font-mono text-amber-400 font-semibold pt-1 border-t border-zinc-800/60">
                        +{formatPrice(dial.price, currency)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Complications Modules */}
          {activeTab === 'complications' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-200">High-Complication Modules</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Equip micro-mechanical master modules into the gear train. Multiple complications can be paired simultaneously.
                </p>
              </div>

              <div className="space-y-3">
                {COMPLICATIONS.map(comp => {
                  const isEquipped = currentWatch.complications.includes(comp.id);
                  return (
                    <div
                      key={comp.id}
                      onClick={() => toggleComplication(comp.id)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                        isEquipped
                          ? 'bg-zinc-900 border-amber-500/80 ring-1 ring-amber-500/30'
                          : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          isEquipped
                            ? 'bg-amber-500 border-amber-500 text-zinc-950'
                            : 'border-zinc-700 bg-zinc-800'
                        }`}>
                          {isEquipped && <Check size={13} className="stroke-[3]" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-zinc-100">{comp.name}</h4>
                          <p className="text-[11px] text-zinc-400 mt-1 leading-normal">{comp.description}</p>
                          <span className="inline-block mt-2 text-[10px] font-mono text-zinc-500">
                            +{comp.weightGrams}g micro-component weight
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-xs font-semibold text-amber-400 whitespace-nowrap">
                        +{formatPrice(comp.price, currency)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 4: Hands & SuperLuminova */}
          {activeTab === 'hands_lume' && (
            <div className="space-y-6">
              
              {/* Hands Style */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-zinc-200">Hands Architecture</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {HANDS_STYLES.map(style => {
                    const isSelected = currentWatch.handsStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => handleFieldChange('handsStyle', style.id)}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-zinc-900 border-amber-500/80 ring-1 ring-amber-500/40 text-amber-200'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <p className="text-xs font-semibold text-zinc-100">{style.name}</p>
                        <p className="text-[11px] text-zinc-400 mt-1">{style.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SuperLuminova Tint */}
              <div className="space-y-3 pt-4 border-t border-zinc-800/80">
                <h3 className="text-sm font-bold text-zinc-200">Photoluminescent SuperLuminova Compound</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {LUME_COLORS.map(lume => {
                    const isSelected = currentWatch.lumeColor === lume.id;
                    return (
                      <button
                        key={lume.id}
                        onClick={() => handleFieldChange('lumeColor', lume.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-zinc-900 border-amber-500/80'
                            : 'bg-zinc-900/40 border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full shadow-sm"
                            style={{ backgroundColor: lume.glowHex, boxShadow: `0 0 8px ${lume.glowHex}` }}
                          />
                          <span className="text-xs font-semibold text-zinc-200">{lume.name}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400">{lume.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* Tab 5: Strap & Ergonomics */}
          {activeTab === 'strap' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-200">Strap Materials & Buckle</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Hand-stitched exotic skins, vulcanized elastomer, or articulated metal links.
                </p>
              </div>

              <div className="space-y-3">
                {STRAPS.map(strap => {
                  const isSelected = currentWatch.strap === strap.id;
                  return (
                    <button
                      key={strap.id}
                      onClick={() => handleFieldChange('strap', strap.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-zinc-900 border-amber-500/80 ring-1 ring-amber-500/30'
                          : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-zinc-100">{strap.name}</span>
                          {isSelected && <Check size={14} className="text-amber-400" />}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{strap.description}</p>
                      </div>
                      <span className="font-mono text-xs text-amber-400 font-semibold whitespace-nowrap ml-4">
                        +{formatPrice(strap.price, currency)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 6: Exhibition Caseback & Rotor Inscription */}
          {activeTab === 'caseback' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-zinc-200">Exhibition Caseback Personalization</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Through the sapphire crystal caseback, view the Calibre CH-9000 movement and engrave your custom motto into the 22K gold rotor.
                </p>
              </div>

              <div className="space-y-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    22K Gold Rotor Custom Inscription (Max 36 Chars)
                  </label>
                  <input
                    type="text"
                    maxLength={36}
                    value={currentWatch.rotorEngraving}
                    onChange={e => handleFieldChange('rotorEngraving', e.target.value.toUpperCase())}
                    placeholder="e.g. AETERNUM · CHRONOS 2026"
                    className="w-full text-xs font-mono uppercase bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-amber-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Atelier Registered Serial Number
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={currentWatch.serialNumber}
                      className="flex-1 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-400"
                    />
                    <button
                      onClick={() => {
                        const randomSerial = `CH-${currentWatch.caseMetal.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}`;
                        handleFieldChange('serialNumber', randomSerial);
                      }}
                      className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 flex items-center gap-1.5"
                      title="Generate new unique serial number"
                    >
                      <RotateCcw size={13} />
                      <span>Reissue</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
