/**
 * Synthetic Web Audio API engine for realistic mechanical horology escapement and chimes
 */

class HorologyAudioEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private volume: number = 0.4;
  private tickInterval: number | null = null;

  constructor() {
    // Lazy initialize on first interaction
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled && this.tickInterval) {
      window.clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  /**
   * Pallet fork jewel impact on escape wheel tooth (mechanical tick)
   */
  public playMechanicalTick(isTock: boolean = false) {
    if (!this.isEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(isTock ? 3200 : 3800, now);
      filter.Q.setValueAtTime(8, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isTock ? 1800 : 2200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.015);

      gain.gain.setValueAtTime(this.volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);

      // Micro secondary metallic echo (spring resonance)
      const echoOsc = this.ctx.createOscillator();
      const echoGain = this.ctx.createGain();
      echoOsc.type = 'sine';
      echoOsc.frequency.setValueAtTime(isTock ? 4400 : 5200, now);
      echoGain.gain.setValueAtTime(this.volume * 0.08, now + 0.004);
      echoGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      echoOsc.connect(echoGain);
      echoGain.connect(this.ctx.destination);
      echoOsc.start(now + 0.004);
      echoOsc.stop(now + 0.045);
    } catch {
      // Audio autoplay policy catch
    }
  }

  /**
   * Minute repeater gong / acoustic chime
   */
  public playMinuteRepeaterChime(frequency: number = 880) {
    if (!this.isEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Fundamental + harmonics for rich crystal gong sound
      const harmonics = [1, 2.76, 5.4, 8.9];
      const gains = [0.4, 0.2, 0.08, 0.03];

      harmonics.forEach((h, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency * h, now);

        const initialVol = this.volume * gains[i];
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 / (i + 1));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.3);
      });
    } catch {
      // Audio catch
    }
  }

  /**
   * Subtle tactile haptic click for UI controls
   */
  public playHapticClick() {
    if (!this.isEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.015);

      gain.gain.setValueAtTime(this.volume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {
      // Audio catch
    }
  }
}

export const horologyAudio = new HorologyAudioEngine();
