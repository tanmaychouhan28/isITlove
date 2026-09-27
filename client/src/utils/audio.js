// Pure Web Audio API Sound Synthesizer (No external assets required)

class SoundFX {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('devpair_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('devpair_muted', this.muted);
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Soft romantic harp chord for Like
  playLike() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (warm major chord)

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0, now + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.55);
    });
  }

  // Sparkling celestial chime for Super Like
  playSuperLike() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [587.33, 739.99, 880.00, 1174.66, 1318.51]; // D5, F#5, A5, D6, E6

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.14, now + i * 0.05 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.7);
    });
  }

  // Gentle soft pop for Pass
  playPass() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Joyful celebration fanfare for Git Clean Merge (Match)
  playMatch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chord1 = [440, 554.37, 659.25]; // A major
    const chord2 = [587.33, 739.99, 880]; // D major
    const chord3 = [659.25, 830.61, 987.77, 1318.51]; // E major triumphant

    const playChord = (chord, time, duration) => {
      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.12, time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + duration + 0.05);
      });
    };

    playChord(chord1, now, 0.25);
    playChord(chord2, now + 0.2, 0.3);
    playChord(chord3, now + 0.45, 0.85);
  }
}

export const soundFX = new SoundFX();
