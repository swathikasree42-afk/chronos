import React, { useState, useEffect } from 'react';
import { WatchConfig, UserSettings, CollectorProfile, Currency } from './types/watch';
import {
  loadVaultWatches,
  saveVaultWatches,
  loadSettings,
  saveSettings,
  loadCollectorProfile,
  awardXP
} from './utils/storage';
import { MASTER_COLLECTION_TIMEPIECES } from './data/horologySpecs';
import { TopBar, NavPage } from './components/TopBar';
import { AtelierOverview } from './pages/AtelierOverview';
import { QuantumStudio } from './pages/QuantumStudio';
import { WinderVault } from './pages/WinderVault';
import { TemporalLab } from './pages/TemporalLab';
import { CollectorHub } from './pages/CollectorHub';
import { SettingsLab } from './pages/SettingsLab';
import { horologyAudio } from './utils/audio';

export default function App() {
  const [activePage, setActivePage] = useState<NavPage>('atelier');
  const [vaultWatches, setVaultWatches] = useState<WatchConfig[]>([]);
  const [currentStudioWatch, setCurrentStudioWatch] = useState<WatchConfig>(MASTER_COLLECTION_TIMEPIECES[0]);
  const [collectorProfile, setCollectorProfile] = useState<CollectorProfile>(loadCollectorProfile());
  const [settings, setSettings] = useState<UserSettings>(loadSettings());

  // Initialize data on mount
  useEffect(() => {
    const loadedWatches = loadVaultWatches();
    setVaultWatches(loadedWatches);
    if (loadedWatches.length > 0) {
      setCurrentStudioWatch(loadedWatches[0]);
    }
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
    horologyAudio.setEnabled(loadedSettings.soundEnabled);
    horologyAudio.setVolume(loadedSettings.soundVolume);
    setCollectorProfile(loadCollectorProfile());
  }, []);

  // Update settings handler
  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleCurrencyChange = (c: Currency) => {
    handleUpdateSettings({ ...settings, currency: c });
  };

  const handleSoundToggle = (enabled: boolean) => {
    handleUpdateSettings({ ...settings, soundEnabled: enabled });
  };

  // Switch watch in studio
  const handleSelectWatchForStudio = (watch: WatchConfig) => {
    setCurrentStudioWatch({ ...watch });
  };

  // Create brand new blueprint
  const handleNewBlueprint = () => {
    const newWatch: WatchConfig = {
      id: `chronos-custom-${Date.now()}`,
      name: 'Chronos Quantum Specimen Alpha',
      collection: 'Bespoke Atelier Commission',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      caseMetal: 'titanium',
      caseDiameter: 41,
      dialTexture: 'quantum_skeleton',
      bezel: 'tachymeter_ceramic',
      complications: ['tourbillon', 'power_reserve'],
      handsStyle: 'royal_dauphine',
      strap: 'alligator_leather',
      lumeColor: 'bgw9_cyan',
      rotorEngraving: 'HOROLOGY · PRECISION MEETS QUANTUM',
      serialNumber: `CH-TI-41-${Math.floor(100 + Math.random() * 900)}`,
      notes: 'Bespoke high-frequency chronometer forged in Grade 5 Aerospace Titanium.',
      isFavorite: false,
      winderSettings: {
        tpd: 800,
        direction: 'cw',
        isActive: true
      }
    };
    setCurrentStudioWatch(newWatch);
  };

  // Save current watch from studio to vault
  const handleSaveToVault = (watch: WatchConfig) => {
    const existingIdx = vaultWatches.findIndex(w => w.id === watch.id);
    let updated: WatchConfig[];
    if (existingIdx >= 0) {
      updated = [...vaultWatches];
      updated[existingIdx] = watch;
    } else {
      updated = [watch, ...vaultWatches];
    }
    setVaultWatches(updated);
    saveVaultWatches(updated);

    // Award XP
    const { profile: updatedProfile } = awardXP(250, 'Blueprint Saved to Vault');
    setCollectorProfile(updatedProfile);
  };

  // Update entire watches list
  const handleUpdateWatches = (watches: WatchConfig[]) => {
    setVaultWatches(watches);
    saveVaultWatches(watches);
  };

  // Score recorded in temporal lab
  const handleScoreRecorded = (updatedProfile: CollectorProfile) => {
    setCollectorProfile(updatedProfile);
  };

  // Data restored from backup
  const handleDataRestored = () => {
    const watches = loadVaultWatches();
    setVaultWatches(watches);
    if (watches.length > 0) setCurrentStudioWatch(watches[0]);
    setSettings(loadSettings());
    setCollectorProfile(loadCollectorProfile());
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      
      {/* Universal TopBar */}
      <TopBar
        activePage={activePage}
        setActivePage={setActivePage}
        currency={settings.currency}
        setCurrency={handleCurrencyChange}
        soundEnabled={settings.soundEnabled}
        setSoundEnabled={handleSoundToggle}
        onNewBlueprint={handleNewBlueprint}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
        {activePage === 'atelier' && (
          <AtelierOverview
            currency={settings.currency}
            onSelectWatchForStudio={handleSelectWatchForStudio}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'studio' && (
          <QuantumStudio
            currentWatch={currentStudioWatch}
            onUpdateWatch={setCurrentStudioWatch}
            onSaveToVault={handleSaveToVault}
            currency={settings.currency}
            unitSystem={settings.unitSystem}
            soundEnabled={settings.soundEnabled}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'vault' && (
          <WinderVault
            watches={vaultWatches}
            onSelectWatchForStudio={handleSelectWatchForStudio}
            onUpdateWatches={handleUpdateWatches}
            currency={settings.currency}
            unitSystem={settings.unitSystem}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'lab' && (
          <TemporalLab
            onScoreRecorded={handleScoreRecorded}
            soundEnabled={settings.soundEnabled}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'collector' && (
          <CollectorHub
            profile={collectorProfile}
            watches={vaultWatches}
            currency={settings.currency}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'settings' && (
          <SettingsLab
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onDataRestored={handleDataRestored}
          />
        )}
      </main>

      {/* Haute Horlogerie Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-10 px-4 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-sm tracking-wider text-zinc-300">
              CHRONOS
            </span>
            <span>·</span>
            <span>Vallée de Joux, Switzerland & Quantum Temporal Lab</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>28,800 VPH (4Hz)</span>
            <span>·</span>
            <span>COSC CALIBRATION</span>
            <span>·</span>
            <span>LOCAL STORAGE SOVEREIGNTY</span>
          </div>

          <div className="text-zinc-500 text-center sm:text-right">
            © {new Date().getFullYear()} CHRONOS Atelier. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}
