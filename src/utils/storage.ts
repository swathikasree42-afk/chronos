import {
  WatchConfig,
  UserSettings,
  CollectorProfile,
  TemporalScore,
  Achievement
} from '../types/watch';
import {
  MASTER_COLLECTION_TIMEPIECES,
  INITIAL_ACHIEVEMENTS,
  VIRTUOSITY_TIERS
} from '../data/horologySpecs';

const STORAGE_KEYS = {
  VAULT: 'chronos_vault_watches_v1',
  SETTINGS: 'chronos_user_settings_v1',
  COLLECTOR: 'chronos_collector_profile_v1',
  TEMPORAL_SCORES: 'chronos_temporal_scores_v1'
};

const DEFAULT_SETTINGS: UserSettings = {
  currency: 'USD',
  unitSystem: 'metric',
  soundEnabled: true,
  soundVolume: 0.5
};

const DEFAULT_COLLECTOR: CollectorProfile = {
  name: 'Master Horologist',
  title: 'Journeyman Clockmaker',
  xp: 850,
  level: 2,
  joinedDate: 'November 2026',
  dailyStreak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyChallengeCompleted: false,
  achievements: INITIAL_ACHIEVEMENTS,
  recentScores: [
    {
      id: 'score-init-1',
      gameMode: 'deadbeat',
      score: 18,
      rating: 'COSC Certified Chronometer',
      timestamp: Date.now() - 3600000 * 4,
      target: 3000
    },
    {
      id: 'score-init-2',
      gameMode: 'reflex',
      score: 184,
      rating: 'Master Escapement Speed',
      timestamp: Date.now() - 3600000 * 24
    }
  ]
};

export function loadVaultWatches(): WatchConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VAULT);
    if (!raw) {
      // Seed with master collection
      saveVaultWatches(MASTER_COLLECTION_TIMEPIECES);
      return MASTER_COLLECTION_TIMEPIECES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : MASTER_COLLECTION_TIMEPIECES;
  } catch (e) {
    console.error('Error loading vault watches', e);
    return MASTER_COLLECTION_TIMEPIECES;
  }
}

export function saveVaultWatches(watches: WatchConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VAULT, JSON.stringify(watches));
  } catch (e) {
    console.error('Error saving vault watches', e);
  }
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}

export function loadCollectorProfile(): CollectorProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COLLECTOR);
    if (!raw) {
      saveCollectorProfile(DEFAULT_COLLECTOR);
      return DEFAULT_COLLECTOR;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_COLLECTOR,
      ...parsed,
      achievements: parsed.achievements || INITIAL_ACHIEVEMENTS
    };
  } catch {
    return DEFAULT_COLLECTOR;
  }
}

export function saveCollectorProfile(profile: CollectorProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.COLLECTOR, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving collector profile', e);
  }
}

export function awardXP(amount: number, reason?: string): { profile: CollectorProfile; leveledUp: boolean } {
  const profile = loadCollectorProfile();
  const oldLevel = profile.level;
  const newXp = profile.xp + amount;

  // Find new tier
  const tier = VIRTUOSITY_TIERS.find(t => newXp >= t.minXp && newXp < t.maxXp) || VIRTUOSITY_TIERS[VIRTUOSITY_TIERS.length - 1];
  const newLevel = tier.level;
  const leveledUp = newLevel > oldLevel;

  const updated: CollectorProfile = {
    ...profile,
    xp: newXp,
    level: newLevel,
    title: tier.title
  };

  saveCollectorProfile(updated);
  return { profile: updated, leveledUp };
}

export function recordTemporalScore(score: TemporalScore): CollectorProfile {
  const profile = loadCollectorProfile();
  const updatedScores = [score, ...(profile.recentScores || [])].slice(0, 15);
  
  // Award XP based on score
  let xp = 50;
  if (score.gameMode === 'deadbeat') {
    if (score.score <= 15) xp = 150;
    else if (score.score <= 50) xp = 100;
  } else if (score.gameMode === 'reflex') {
    if (score.score < 200) xp = 150;
    else if (score.score < 250) xp = 100;
  } else if (score.gameMode === 'cadence') {
    if (score.score >= 95) xp = 150;
    else if (score.score >= 85) xp = 100;
  }

  // Check achievements
  const updatedAchievements = profile.achievements.map((ach: Achievement) => {
    if (ach.id === 'ach-deadbeat-sync' && score.gameMode === 'deadbeat' && score.score <= 15) {
      return { ...ach, progress: 1, unlockedAt: ach.unlockedAt || Date.now() };
    }
    if (ach.id === 'ach-reaction-reflex' && score.gameMode === 'reflex' && score.score < 200) {
      return { ...ach, progress: 1, unlockedAt: ach.unlockedAt || Date.now() };
    }
    if (ach.id === 'ach-cadence-4hz' && score.gameMode === 'cadence' && score.score >= 95) {
      return { ...ach, progress: 1, unlockedAt: ach.unlockedAt || Date.now() };
    }
    return ach;
  });

  const updatedProfile: CollectorProfile = {
    ...profile,
    recentScores: updatedScores,
    achievements: updatedAchievements,
    xp: profile.xp + xp
  };

  saveCollectorProfile(updatedProfile);
  return updatedProfile;
}

export function exportAllDataAsJSON(): string {
  const exportPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    system: 'CHRONOS HOROLOGY VAULT & LAB',
    data: {
      vault: loadVaultWatches(),
      settings: loadSettings(),
      collector: loadCollectorProfile()
    }
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function importAllDataFromJSON(jsonString: string): { success: boolean; message: string; count?: number } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.data) {
      return { success: false, message: 'Invalid Chronos backup file format.' };
    }
    if (Array.isArray(parsed.data.vault)) {
      saveVaultWatches(parsed.data.vault);
    }
    if (parsed.data.settings) {
      saveSettings(parsed.data.settings);
    }
    if (parsed.data.collector) {
      saveCollectorProfile(parsed.data.collector);
    }
    return {
      success: true,
      message: 'Atelier Vault and Collector telemetry restored successfully.',
      count: parsed.data.vault ? parsed.data.vault.length : 0
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown parsing error';
    return { success: false, message: `Failed to import JSON: ${errorMsg}` };
  }
}
