import {
  CaseMetal,
  CaseDiameter,
  DialTexture,
  BezelType,
  ComplicationType,
  HandsStyle,
  StrapMaterial,
  LumeColor,
  MetalSpec,
  DialSpec,
  BezelSpec,
  ComplicationSpec,
  StrapSpec,
  WatchConfig,
  Achievement,
  Currency
} from '../types/watch';

export const METALS: MetalSpec[] = [
  {
    id: 'titanium',
    name: 'Grade 5 Aerospace Titanium',
    density: '4.43 g/cm³',
    priceMultiplier: 1.0,
    basePrice: 14500,
    hex: '#8a929a',
    accentHex: '#d8dee9',
    description: 'Remarkably lightweight with supreme biocompatibility and resistance to magnetic flux.'
  },
  {
    id: 'rose_gold',
    name: '18K King Rose Gold',
    density: '15.5 g/cm³',
    priceMultiplier: 1.45,
    basePrice: 28500,
    hex: '#c98a6a',
    accentHex: '#f2cbb4',
    description: 'Proprietary Swiss alloy infused with platinum for an enduring warm lustrous hue that never oxidizes.'
  },
  {
    id: 'platinum',
    name: '950 Solid Platinum',
    density: '21.45 g/cm³',
    priceMultiplier: 1.85,
    basePrice: 38000,
    hex: '#e2e8f0',
    accentHex: '#ffffff',
    description: 'The pinnacle of noble metallurgy. Immensely dense, cold to the touch, and exquisitely polished.'
  },
  {
    id: 'damascus',
    name: 'Hand-Forged Damascus Steel',
    density: '7.85 g/cm³',
    priceMultiplier: 1.25,
    basePrice: 18500,
    hex: '#64748b',
    accentHex: '#94a3b8',
    description: '128 micro-folded metallurgical layers creating an organic topographic woodgrain pattern on the case.'
  },
  {
    id: 'dlc_obsidian',
    name: 'Obsidian DLC Coated Steel',
    density: '7.9 g/cm³',
    priceMultiplier: 1.15,
    basePrice: 16500,
    hex: '#1e293b',
    accentHex: '#475569',
    description: 'Diamond-Like Carbon vacuum vapor deposition yielding 4,000 Vickers hardness in deep satin black.'
  },
  {
    id: 'forged_carbon',
    name: 'Quantum Forged Carbon',
    density: '1.8 g/cm³',
    priceMultiplier: 1.35,
    basePrice: 22000,
    hex: '#27272a',
    accentHex: '#52525b',
    description: 'High-pressure autoclave compressed carbon filaments with randomized marble shimmer.'
  }
];

export const DIALS: DialSpec[] = [
  {
    id: 'quantum_skeleton',
    name: 'Quantum Skeleton (Openworked)',
    price: 6500,
    description: 'Exposed ruthenium-treated bridges, hand-beveled anglage, and floating balance wheel.',
    previewColor: '#18181b'
  },
  {
    id: 'meteorite',
    name: 'Muonionalusta Meteorite Iron',
    price: 8200,
    description: 'Genuine extraterrestrial nickel-iron slice displaying distinctive Widmanstätten crystalline patterns.',
    previewColor: '#475569'
  },
  {
    id: 'azure_sunburst',
    name: 'Royal Azure Sunburst',
    price: 2400,
    description: 'Radial galvanic brushwork that refracts dynamic ambient light from deep navy to bright cyan.',
    previewColor: '#0369a1'
  },
  {
    id: 'aventurine',
    name: 'Venetian Aventurine Starlight',
    price: 5400,
    description: 'Translucent deep-space glass infused with copper micro-crystals resembling an infinite galactic cosmos.',
    previewColor: '#0f172a'
  },
  {
    id: 'guilloche_tapisserie',
    name: 'Grand Tapisserie Guilloché',
    price: 3800,
    description: 'Traditional rose-engine hand-turned geometric square motif executed on solid silver.',
    previewColor: '#334155'
  },
  {
    id: 'matte_obsidian',
    name: 'Vanta Matte Obsidian',
    price: 1800,
    description: 'Light-absorbing velvet black treatment providing exceptional contrast for indices and complications.',
    previewColor: '#09090b'
  }
];

export const BEZELS: BezelSpec[] = [
  {
    id: 'tachymeter_ceramic',
    name: 'Zirconia Ceramic Tachymeter',
    price: 1800,
    description: 'Laser-engraved speed conversion scale filled with platinum liquid metal.'
  },
  {
    id: 'fluted_gold',
    name: 'Micro-Fluted Precision Ring',
    price: 2600,
    description: 'Reflective facets cut to 45° angles providing scintillating horological presence.'
  },
  {
    id: 'diver_countup',
    name: 'Unidirectional 60-Min Diver Ring',
    price: 1400,
    description: '120-click ratcheting bezel with luminous luminescent marker at 12 o’clock.'
  },
  {
    id: 'minimalist_polished',
    name: 'Mirror-Polished Architectural Bezel',
    price: 900,
    description: 'Clean sloping bezel polished by hand to a black-mirror finish.'
  },
  {
    id: 'gemset_baguette',
    name: 'Invisible-Set Baguette Diamond Ring',
    price: 14500,
    description: '36 calibrated Top Wesselton baguette-cut diamonds set with no visible prongs.'
  }
];

export const COMPLICATIONS: ComplicationSpec[] = [
  {
    id: 'tourbillon',
    name: '60-Second Flying Tourbillon',
    price: 24000,
    weightGrams: 8,
    description: 'Single-axis anti-gravity cage rotating once every 60 seconds to counteract positional rate variations.'
  },
  {
    id: 'chronograph',
    name: 'Monopusher Flyback Chronograph',
    price: 9500,
    weightGrams: 12,
    description: 'Column-wheel mechanism allowing instant restart without stopping the timing sequence.'
  },
  {
    id: 'moonphase',
    name: 'Astronomical Precision Moonphase',
    price: 5200,
    weightGrams: 6,
    description: 'Calculated to remain accurate for 122.6 years before requiring a single day correction.'
  },
  {
    id: 'power_reserve',
    name: '72-Hour Arc Reserve Indicator',
    price: 3100,
    weightGrams: 4,
    description: 'Differential gearing measuring remaining mainspring torque across a curved sector.'
  },
  {
    id: 'gmt',
    name: 'Dual-Time Zone 24H Jumping GMT',
    price: 4400,
    weightGrams: 7,
    description: 'Independent local hour hand jumpable in 1-hour increments with 24-hour reference hand.'
  }
];

export const HANDS_STYLES = [
  { id: 'skeleton_obelisque' as HandsStyle, name: 'Skeleton Obélisque', description: 'Beveled hollowed hands with luminous tips' },
  { id: 'royal_dauphine' as HandsStyle, name: 'Royal Dauphine', description: 'Classic tapered triangular faceted hands' },
  { id: 'blued_breguet' as HandsStyle, name: 'Thermal Blued Breguet', description: 'Flame-tempered cobalt steel with hollow crescent ring' },
  { id: 'quantum_baton' as HandsStyle, name: 'Quantum Luminous Baton', description: 'Precision engineered linear hands with high-capacity lume wells' }
];

export const STRAPS: StrapSpec[] = [
  {
    id: 'alligator_leather',
    name: 'Mississippiensis Hand-Stitched Alligator',
    price: 1200,
    weightGrams: 28,
    description: 'Large square scales, saddle-stitched with waxed French linen thread.'
  },
  {
    id: 'titanium_bracelet',
    name: 'Integrated H-Link Titanium Bracelet',
    price: 3600,
    weightGrams: 78,
    description: 'Articulated link geometry with micro-adjustment deployant buckle.'
  },
  {
    id: 'vulcanized_rubber',
    name: 'FKM High-Density Ribbed Rubber',
    price: 650,
    weightGrams: 35,
    description: 'Impervious to saltwater, UV degradation, and temperature extremes.'
  },
  {
    id: 'milanese_mesh',
    name: 'Fine-Knit Milanese Mesh',
    price: 1600,
    weightGrams: 62,
    description: 'Dense stainless steel weave conforming like silk to wrist ergonomics.'
  },
  {
    id: 'hybrid_cordura',
    name: 'Reinforced Cordura & Leather Hybrid',
    price: 850,
    weightGrams: 30,
    description: 'Ballistic fabric exterior backed with hypoallergenic calfskin.'
  }
];

export const LUME_COLORS = [
  { id: 'superluminova_c3' as LumeColor, name: 'SuperLuminova C3', hex: '#bef264', glowHex: '#84cc16', description: 'Classic high-potency pistachio green glow' },
  { id: 'bgw9_cyan' as LumeColor, name: 'SuperLuminova BGW9', hex: '#67e8f9', glowHex: '#06b6d4', description: 'Clean white in daylight, electric icy cyan in darkness' },
  { id: 'vintage_radium_amber' as LumeColor, name: 'Tritium Vintage Amber', hex: '#fde047', glowHex: '#eab308', description: 'Warm nostalgic golden glow evoking historic pocket chronometers' }
];

export const CASE_DIAMETERS: { size: CaseDiameter; lugToLug: number; thickness: number; recommendedWrist: string }[] = [
  { size: 39, lugToLug: 46.5, thickness: 10.8, recommendedWrist: '15.0 - 17.5 cm (Subtle Vintage Proportion)' },
  { size: 41, lugToLug: 48.2, thickness: 11.4, recommendedWrist: '16.5 - 19.0 cm (Classic Contemporary Standard)' },
  { size: 43, lugToLug: 51.0, thickness: 12.6, recommendedWrist: '17.5 - 20.5 cm (Architectural Presence)' },
  { size: 45, lugToLug: 53.8, thickness: 13.9, recommendedWrist: '18.5+ cm (Avant-Garde Complication Chassis)' }
];

/**
 * Preloaded Signature Concept Masterpieces
 */
export const MASTER_COLLECTION_TIMEPIECES: WatchConfig[] = [
  {
    id: 'chronos-master-01',
    name: 'Quantum Tourbillon Chrono-Singularity',
    collection: 'Haute Horlogerie Master Collection',
    createdAt: 1730000000000,
    updatedAt: 1730000000000,
    caseMetal: 'platinum',
    caseDiameter: 43,
    dialTexture: 'quantum_skeleton',
    bezel: 'tachymeter_ceramic',
    complications: ['tourbillon', 'power_reserve', 'chronograph'],
    handsStyle: 'blued_breguet',
    strap: 'alligator_leather',
    lumeColor: 'bgw9_cyan',
    rotorEngraving: 'CHRONOS HOROLOGY · NO. 01/25',
    serialNumber: 'CH-PT-950-001',
    notes: 'The apex of micro-mechanical temporal engineering. Integrates a 60-second anti-gravity carriage with column-wheel chronograph in solid platinum.',
    isFavorite: true,
    winderSettings: {
      tpd: 800,
      direction: 'bidirectional',
      isActive: true
    }
  },
  {
    id: 'chronos-master-02',
    name: 'Celestial Meteorite Astro-Phase',
    collection: 'Astronomical & Celestial Line',
    createdAt: 1730100000000,
    updatedAt: 1730100000000,
    caseMetal: 'rose_gold',
    caseDiameter: 41,
    dialTexture: 'meteorite',
    bezel: 'fluted_gold',
    complications: ['moonphase', 'power_reserve', 'gmt'],
    handsStyle: 'royal_dauphine',
    strap: 'alligator_leather',
    lumeColor: 'vintage_radium_amber',
    rotorEngraving: 'PERPETUAL LUNAR HARMONY',
    serialNumber: 'CH-RG-750-042',
    notes: 'Crafted from authentic 4-billion-year-old Muonionalusta meteorite iron and 18K King Rose Gold. True 122.6-year moonphase.',
    isFavorite: true,
    winderSettings: {
      tpd: 650,
      direction: 'cw',
      isActive: true
    }
  },
  {
    id: 'chronos-master-03',
    name: 'Aventurine Quantum Stealth-Tactical',
    collection: 'Avant-Garde Laboratory Series',
    createdAt: 1730200000000,
    updatedAt: 1730200000000,
    caseMetal: 'forged_carbon',
    caseDiameter: 45,
    dialTexture: 'aventurine',
    bezel: 'tachymeter_ceramic',
    complications: ['tourbillon', 'gmt'],
    handsStyle: 'skeleton_obelisque',
    strap: 'vulcanized_rubber',
    lumeColor: 'superluminova_c3',
    rotorEngraving: 'AUTOCLAVE FORGED // ZERO G',
    serialNumber: 'CH-FC-000-099',
    notes: 'Forged carbon chassis paired with Venetian starry aventurine and an ultra-lightweight titanium tourbillon carriage.',
    isFavorite: false,
    winderSettings: {
      tpd: 1000,
      direction: 'ccw',
      isActive: true
    }
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-blueprint',
    title: 'Temporal Architect',
    description: 'Forge and save your first bespoke custom timepiece in the Atelier.',
    category: 'atelier',
    icon: 'Compass',
    progress: 1,
    maxProgress: 1,
    unlockedAt: 1730000000000,
    xpReward: 250
  },
  {
    id: 'ach-tourbillon-master',
    title: 'Gravity Defier',
    description: 'Equip a 60-Second Flying Tourbillon complication on a custom timepiece.',
    category: 'atelier',
    icon: 'Atom',
    progress: 1,
    maxProgress: 1,
    unlockedAt: 1730000000000,
    xpReward: 350
  },
  {
    id: 'ach-deadbeat-sync',
    title: 'COSC Chronometer Synchronizer',
    description: 'Achieve a sub-15ms timing accuracy rating in the Deadbeat Synchronizer challenge.',
    category: 'temporal',
    icon: 'Timer',
    progress: 0,
    maxProgress: 1,
    xpReward: 400
  },
  {
    id: 'ach-reaction-reflex',
    title: 'Quantum Escapement Reflex',
    description: 'React in under 200 milliseconds to the sudden escapement release impulse.',
    category: 'temporal',
    icon: 'Zap',
    progress: 0,
    maxProgress: 1,
    xpReward: 350
  },
  {
    id: 'ach-cadence-4hz',
    title: '28,800 VPH Cadence Harmonizer',
    description: 'Sustain a precise 4Hz balance wheel cadence rhythm with >95% accuracy.',
    category: 'temporal',
    icon: 'Activity',
    progress: 0,
    maxProgress: 1,
    xpReward: 450
  },
  {
    id: 'ach-vault-trio',
    title: 'Vault Conservator',
    description: 'Curate 3 or more distinctive timepieces in your rotating Watch Winder safe.',
    category: 'collector',
    icon: 'Shield',
    progress: 3,
    maxProgress: 3,
    unlockedAt: 1730000000000,
    xpReward: 300
  },
  {
    id: 'ach-noble-collector',
    title: 'Precious Metallurgist',
    description: 'Design a timepiece in 950 Solid Platinum or 18K King Rose Gold.',
    category: 'collector',
    icon: 'Award',
    progress: 1,
    maxProgress: 1,
    unlockedAt: 1730000000000,
    xpReward: 300
  }
];

export const VIRTUOSITY_TIERS = [
  { level: 1, title: 'Apprentice Horologist', minXp: 0, maxXp: 500, privilege: 'Basic Atelier Workshop Access' },
  { level: 2, title: 'Journeyman Clockmaker', minXp: 500, maxXp: 1200, privilege: 'Aventurine & Damascus Metallurgy Unlocked' },
  { level: 3, title: 'Master Artisan', minXp: 1200, maxXp: 2200, privilege: 'Flying Tourbillon & Dual Time Calibration' },
  { level: 4, title: 'Grand Complication Virtuoso', minXp: 2200, maxXp: 3500, privilege: 'Baguette Gem-Set Bezels & Multi-Winder Vault' },
  { level: 5, title: 'Chronos Quantum Fellow', minXp: 3500, maxXp: 6000, privilege: 'Bespoke Rotor Engraving & Chronometric Certificate' }
];

export function calculateWatchPrice(config: Partial<WatchConfig>): number {
  const metal = METALS.find(m => m.id === config.caseMetal) || METALS[0];
  const dial = DIALS.find(d => d.id === config.dialTexture) || DIALS[0];
  const bezel = BEZELS.find(b => b.id === config.bezel) || BEZELS[0];
  const strap = STRAPS.find(s => s.id === config.strap) || STRAPS[0];

  const complicationsTotal = (config.complications || []).reduce((sum, compId) => {
    const comp = COMPLICATIONS.find(c => c.id === compId);
    return sum + (comp ? comp.price : 0);
  }, 0);

  const diameterAdjustment = config.caseDiameter === 45 ? 2000 : config.caseDiameter === 43 ? 1000 : 0;

  return Math.round(metal.basePrice + dial.price + bezel.price + strap.price + complicationsTotal + diameterAdjustment);
}

export function calculateWatchWeight(config: Partial<WatchConfig>): number {
  const baseWeightMap: Record<CaseMetal, number> = {
    titanium: 75,
    rose_gold: 145,
    platinum: 185,
    damascus: 110,
    dlc_obsidian: 115,
    forged_carbon: 55
  };

  const metal = config.caseMetal || 'titanium';
  const strap = STRAPS.find(s => s.id === config.strap) || STRAPS[0];
  const complicationsWeight = (config.complications || []).reduce((sum, compId) => {
    const comp = COMPLICATIONS.find(c => c.id === compId);
    return sum + (comp ? comp.weightGrams : 0);
  }, 0);

  const diameterFactor = (config.caseDiameter || 41) / 41;
  return Math.round(baseWeightMap[metal] * diameterFactor + strap.weightGrams + complicationsWeight);
}

export function calculateCraftingWeeks(config: Partial<WatchConfig>): number {
  let weeks = 6; // base assembly
  if (config.caseMetal === 'platinum' || config.caseMetal === 'rose_gold') weeks += 3;
  if (config.caseMetal === 'damascus') weeks += 4;
  if (config.dialTexture === 'quantum_skeleton') weeks += 4;
  if (config.dialTexture === 'meteorite') weeks += 3;
  if (config.complications?.includes('tourbillon')) weeks += 8;
  if (config.complications?.includes('chronograph')) weeks += 3;
  if (config.bezel === 'gemset_baguette') weeks += 4;
  return weeks;
}

export function formatPrice(amount: number, currency: Currency = 'USD'): string {
  const rates: Record<Currency, { symbol: string; rate: number; suffix?: string }> = {
    USD: { symbol: '$', rate: 1 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    CHF: { symbol: 'CHF ', rate: 0.89 },
    JPY: { symbol: '¥', rate: 152 }
  };

  const curr = rates[currency] || rates.USD;
  const converted = Math.round(amount * curr.rate);
  return `${curr.symbol}${converted.toLocaleString()}`;
}
