import React, { useState } from 'react';
import { Volume2, VolumeX, Menu, X, Plus } from 'lucide-react';
import { Currency } from '../types/watch';
import { horologyAudio } from '../utils/audio';

export type NavPage = 'atelier' | 'studio' | 'vault' | 'lab' | 'collector' | 'settings';

interface TopBarProps {
  activePage: NavPage;
  setActivePage: (page: NavPage) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  soundEnabled: boolean;
  setSoundEnabled: (s: boolean) => void;
  onNewBlueprint?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activePage,
  setActivePage,
  currency,
  setCurrency,
  soundEnabled,
  setSoundEnabled,
  onNewBlueprint
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavPage; label: string }[] = [
    { id: 'atelier', label: 'Atelier' },
    { id: 'studio', label: 'Studio' },
    { id: 'vault', label: 'Winder Vault' },
    { id: 'lab', label: 'Temporal Lab' },
    { id: 'collector', label: 'Collector Hub' },
    { id: 'settings', label: 'Settings' }
  ];

  const handleNavClick = (page: NavPage) => {
    horologyAudio.playHapticClick();
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    horologyAudio.setEnabled(next);
    if (next) horologyAudio.playMinuteRepeaterChime(1046);
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand title, one line */}
        <button
          onClick={() => handleNavClick('atelier')}
          className="text-left group flex items-baseline gap-2.5 whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
        >
          <span className="font-display text-xl sm:text-2xl font-bold tracking-widest gold-gradient-text uppercase">
            CHRONOS
          </span>
          <span className="hidden sm:inline-block text-[10px] tracking-widest text-zinc-500 uppercase font-mono">
            HAUTE HORLOGERIE
          </span>
        </button>

        {/* Zone 2: 4-6 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {navItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'text-amber-300 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-amber-200" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Quick Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Currency Switcher */}
          <div className="hidden sm:flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5 text-xs font-mono">
            {(['USD', 'EUR', 'GBP', 'CHF'] as Currency[]).map(c => (
              <button
                key={c}
                onClick={() => {
                  horologyAudio.playHapticClick();
                  setCurrency(c);
                }}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  currency === c
                    ? 'bg-zinc-800 text-amber-300 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Escapement Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute horology escapement audio' : 'Enable horology escapement audio'}
            title={soundEnabled ? 'Mechanical Escapement Audio: ON' : 'Mechanical Escapement Audio: OFF'}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => {
              horologyAudio.playHapticClick();
              if (onNewBlueprint) onNewBlueprint();
              setActivePage('studio');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>New Blueprint</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-zinc-800/80 max-w-7xl mx-auto flex flex-col gap-1 pb-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activePage === item.id
                  ? 'bg-amber-500/10 text-amber-300 font-semibold'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Currency toggle */}
          <div className="flex sm:hidden items-center justify-between px-3 pt-2 text-xs text-zinc-400">
            <span>Currency:</span>
            <div className="flex gap-1 font-mono">
              {(['USD', 'EUR', 'GBP', 'CHF'] as Currency[]).map(c => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 rounded text-xs ${
                    currency === c ? 'bg-zinc-800 text-amber-300 font-bold' : 'text-zinc-500'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
