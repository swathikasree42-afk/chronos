import React, { useState } from 'react';
import {
  Download,
  Upload,
  RefreshCw,
  Volume2,
  DollarSign,
  Ruler,
  Check,
  AlertCircle,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { UserSettings, Currency, UnitSystem } from '../types/watch';
import { exportAllDataAsJSON, importAllDataFromJSON, saveVaultWatches } from '../utils/storage';
import { MASTER_COLLECTION_TIMEPIECES } from '../data/horologySpecs';
import { horologyAudio } from '../utils/audio';

interface SettingsLabProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onDataRestored: () => void;
}

export const SettingsLab: React.FC<SettingsLabProps> = ({
  settings,
  onUpdateSettings,
  onDataRestored
}) => {
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [rawJsonInput, setRawJsonInput] = useState<string>('');
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);

  const handleCurrencyChange = (c: Currency) => {
    horologyAudio.playHapticClick();
    onUpdateSettings({ ...settings, currency: c });
  };

  const handleUnitChange = (u: UnitSystem) => {
    horologyAudio.playHapticClick();
    onUpdateSettings({ ...settings, unitSystem: u });
  };

  const handleVolumeChange = (vol: number) => {
    horologyAudio.setVolume(vol);
    onUpdateSettings({ ...settings, soundVolume: vol });
  };

  const handleToggleSound = (enabled: boolean) => {
    horologyAudio.setEnabled(enabled);
    if (enabled) horologyAudio.playMinuteRepeaterChime(1046);
    onUpdateSettings({ ...settings, soundEnabled: enabled });
  };

  const handleDownloadBackup = () => {
    horologyAudio.playHapticClick();
    const jsonStr = exportAllDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chronos_Atelier_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = importAllDataFromJSON(text);
      setImportStatus(res);
      if (res.success) {
        horologyAudio.playMinuteRepeaterChime(1318);
        onDataRestored();
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreFromRawText = () => {
    if (!rawJsonInput.trim()) return;
    const res = importAllDataFromJSON(rawJsonInput);
    setImportStatus(res);
    if (res.success) {
      horologyAudio.playMinuteRepeaterChime(1318);
      onDataRestored();
      setShowJsonModal(false);
    }
  };

  const handleResetToDemo = () => {
    if (window.confirm('Reset all saved timepieces to the 3 master reference collection pieces?')) {
      horologyAudio.playHapticClick();
      saveVaultWatches(MASTER_COLLECTION_TIMEPIECES);
      onDataRestored();
      setImportStatus({
        success: true,
        message: 'Master collections restored to factory atelier specifications.'
      });
    }
  };

  return (
    <div className="space-y-10 pb-16 max-w-4xl mx-auto">
      
      {/* 1. Header */}
      <div className="rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-10">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-500">
          Preferences & Data Sovereignty
        </span>
        <h1 className="font-display text-2xl sm:text-4xl font-bold text-white mt-1">
          Settings & Data Lab
        </h1>
        <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
          Configure currency valuation formulas, measurement systems, synthetic escapement sound frequencies, and export complete offline JSON backups of your horological creations.
        </p>
      </div>

      {/* Status banner */}
      {importStatus && (
        <div className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between ${
          importStatus.success
            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
            : 'bg-rose-950/40 border-rose-800 text-rose-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {importStatus.success ? <Check size={18} className="text-emerald-400" /> : <AlertCircle size={18} className="text-rose-400" />}
            <span>{importStatus.message}</span>
          </div>
          <button
            onClick={() => setImportStatus(null)}
            className="text-xs underline ml-4 hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Format & Units Card */}
      <div className="rounded-3xl bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <DollarSign size={18} className="text-amber-400" />
            <span>Currency & Valuation Standard</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Display all atelier base alloy and complication prices in your preferred regional currency.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: 'USD', label: 'USD ($)', desc: 'US Dollar' },
            { id: 'EUR', label: 'EUR (€)', desc: 'Eurozone' },
            { id: 'GBP', label: 'GBP (£)', desc: 'British Pound' },
            { id: 'CHF', label: 'CHF (Fr)', desc: 'Swiss Francs' },
            { id: 'JPY', label: 'JPY (¥)', desc: 'Japanese Yen' }
          ].map(curr => {
            const isSelected = settings.currency === curr.id;
            return (
              <button
                key={curr.id}
                onClick={() => handleCurrencyChange(curr.id as Currency)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-500 text-amber-300 font-semibold ring-1 ring-amber-500/30'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <p className="text-xs font-mono font-bold">{curr.label}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">{curr.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-zinc-800/80 space-y-3">
          <h3 className="text-xs font-bold text-zinc-300 flex items-center gap-2">
            <Ruler size={15} className="text-amber-400" />
            <span>Dimensional & Weight Standard</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'metric', title: 'Metric (Millimeters & Grams)', desc: 'Standard Swiss horology measurements (39-45mm, grams).' },
              { id: 'imperial', title: 'Imperial (Inches & Ounces)', desc: 'Converted wrist sizes and component weights in ounces.' }
            ].map(unit => {
              const isSelected = settings.unitSystem === unit.id;
              return (
                <button
                  key={unit.id}
                  onClick={() => handleUnitChange(unit.id as UnitSystem)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-zinc-900 border-amber-500 text-amber-300 font-semibold ring-1 ring-amber-500/30'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <p className="text-xs font-semibold">{unit.title}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{unit.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Escapement Sound Generator Card */}
      <div className="rounded-3xl bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Volume2 size={18} className="text-amber-400" />
              <span>Synthetic Mechanical Escapement Audio</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Real-time Web Audio API synthesis generating the physical pallet-fork strike and minute repeater crystal chimes.
            </p>
          </div>

          <button
            onClick={() => handleToggleSound(!settings.soundEnabled)}
            className={`px-4 py-2 rounded-xl border text-xs font-mono font-bold transition-colors ${
              settings.soundEnabled
                ? 'bg-amber-500 text-zinc-950 border-amber-500'
                : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {settings.soundEnabled ? 'AUDIO: ENABLED' : 'AUDIO: MUTED'}
          </button>
        </div>

        {settings.soundEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>Escapement Volume</span>
                <span>{Math.round(settings.soundVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 sm:justify-end">
              <button
                onClick={() => horologyAudio.playMechanicalTick(false)}
                className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono"
              >
                Test Tick
              </button>
              <button
                onClick={() => horologyAudio.playMinuteRepeaterChime(1046)}
                className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono"
              >
                Test Chime (1046Hz)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Complete Data Sovereignty & Backup / Restore */}
      <div className="rounded-3xl bg-zinc-900/50 border border-zinc-800 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-amber-400" />
            <span>Data Vault Backup & JSON Restoration</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Export a full JSON backup of all your saved timepieces, collector progress, and precision records. Restore at any time on any device.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Download JSON */}
          <button
            onClick={handleDownloadBackup}
            className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/80 transition-all flex flex-col items-center text-center gap-3 group"
          >
            <div className="p-3 rounded-xl bg-zinc-900 text-amber-400 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
              <Download size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Export JSON Backup</p>
              <p className="text-[10px] text-zinc-500 mt-1">Download complete vault telemetry</p>
            </div>
          </button>

          {/* Upload JSON file */}
          <label className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/80 transition-all flex flex-col items-center text-center gap-3 cursor-pointer group">
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="p-3 rounded-xl bg-zinc-900 text-amber-400 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
              <Upload size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Import JSON File</p>
              <p className="text-[10px] text-zinc-500 mt-1">Restore from a .json backup file</p>
            </div>
          </label>

          {/* Paste Raw JSON */}
          <button
            onClick={() => setShowJsonModal(true)}
            className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/80 transition-all flex flex-col items-center text-center gap-3 group"
          >
            <div className="p-3 rounded-xl bg-zinc-900 text-amber-400 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
              <FileCode size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Paste JSON Text</p>
              <p className="text-[10px] text-zinc-500 mt-1">Directly inspect and restore raw code</p>
            </div>
          </button>

        </div>

        {/* Factory Reset */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-zinc-300">Factory Reinitialization</h4>
            <p className="text-[11px] text-zinc-500">Restore the original Sovereign Collection references.</p>
          </div>
          <button
            onClick={handleResetToDemo}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-medium transition-colors"
          >
            <RefreshCw size={13} />
            <span>Reset to Master Specs</span>
          </button>
        </div>

      </div>

      {/* Raw JSON Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-4">
            <h3 className="font-display text-lg font-bold text-white">Paste Chronos Backup JSON</h3>
            <p className="text-xs text-zinc-400">
              Paste the exported JSON string below to restore watches, settings, and collector records.
            </p>
            <textarea
              rows={10}
              value={rawJsonInput}
              onChange={e => setRawJsonInput(e.target.value)}
              placeholder="Paste JSON payload here..."
              className="w-full text-xs font-mono bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRestoreFromRawText}
                className="px-5 py-2 rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs"
              >
                Restore Payload
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
