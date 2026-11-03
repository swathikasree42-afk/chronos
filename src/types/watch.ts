/**
 * CHRONOS Watch Atelier & Temporal Lab Type Definitions
 */

export type CaseMetal = 'rose_gold' | 'titanium' | 'platinum' | 'damascus' | 'dlc_obsidian' | 'forged_carbon';

export type CaseDiameter = 39 | 41 | 43 | 45;

export type DialTexture = 'quantum_skeleton' | 'meteorite' | 'azure_sunburst' | 'aventurine' | 'guilloche_tapisserie' | 'matte_obsidian';

export type BezelType = 'tachymeter_ceramic' | 'fluted_gold' | 'diver_countup' | 'minimalist_polished' | 'gemset_baguette';

export type ComplicationType = 'tourbillon' | 'chronograph' | 'moonphase' | 'power_reserve' | 'gmt';

export type HandsStyle = 'skeleton_obelisque' | 'royal_dauphine' | 'blued_breguet' | 'quantum_baton';

export type StrapMaterial = 'alligator_leather' | 'titanium_bracelet' | 'vulcanized_rubber' | 'milanese_mesh' | 'hybrid_cordura';

export type LumeColor = 'superluminova_c3' | 'bgw9_cyan' | 'vintage_radium_amber';

export interface WatchConfig {
  id: string;
  name: string;
  collection: string;
  createdAt: number;
  updatedAt: number;
  caseMetal: CaseMetal;
  caseDiameter: CaseDiameter;
  dialTexture: DialTexture;
  bezel: BezelType;
  complications: ComplicationType[];
  handsStyle: HandsStyle;
  strap: StrapMaterial;
  lumeColor: LumeColor;
  rotorEngraving: string;
  serialNumber: string;
  notes?: string;
  isFavorite?: boolean;
  winderSettings?: {
    tpd: 650 | 800 | 1000;
    direction: 'cw' | 'ccw' | 'bidirectional';
    isActive: boolean;
  };
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'CHF' | 'JPY';
export type UnitSystem = 'metric' | 'imperial';

export interface UserSettings {
  currency: Currency;
  unitSystem: UnitSystem;
  soundEnabled: boolean;
  soundVolume: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'atelier' | 'temporal' | 'collector';
  icon: string;
  unlockedAt?: number;
  progress: number;
  maxProgress: number;
  xpReward: number;
}

export interface TemporalScore {
  id: string;
  gameMode: 'deadbeat' | 'reflex' | 'cadence';
  score: number; // e.g. delta in ms or bpm accuracy
  rating: string; // e.g. "COSC Chronometer Grade", "Superlative", etc.
  timestamp: number;
  target?: number;
}

export interface CollectorProfile {
  name: string;
  title: string;
  xp: number;
  level: number;
  joinedDate: string;
  dailyStreak: number;
  lastActiveDate: string;
  dailyChallengeCompleted: boolean;
  achievements: Achievement[];
  recentScores: TemporalScore[];
}

export interface MetalSpec {
  id: CaseMetal;
  name: string;
  density: string;
  priceMultiplier: number;
  basePrice: number;
  hex: string;
  accentHex: string;
  description: string;
}

export interface DialSpec {
  id: DialTexture;
  name: string;
  price: number;
  description: string;
  previewColor: string;
}

export interface ComplicationSpec {
  id: ComplicationType;
  name: string;
  price: number;
  weightGrams: number;
  description: string;
}

export interface BezelSpec {
  id: BezelType;
  name: string;
  price: number;
  description: string;
}

export interface StrapSpec {
  id: StrapMaterial;
  name: string;
  price: number;
  weightGrams: number;
  description: string;
}
