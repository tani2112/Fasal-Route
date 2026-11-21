// Audio Synthesizer & Sound Effects for Voice-First Farmer Interaction

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playMicStartSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

export function playMicStopSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(660, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.15);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.2);
}

export function playDecisionChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

    gain.gain.setValueAtTime(0.12, ctx.currentTime + index * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + index * 0.08);
    osc.stop(ctx.currentTime + index * 0.08 + 0.45);
  });
}

export function speakText(
  text: string,
  lang: string = 'kn-IN',
  onEnd?: () => void
): { stop: () => void } {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return { stop: () => {} };
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : lang === 'ta' ? 'ta-IN' : 'en-IN';
  utterance.rate = 0.95; // slightly slower for maximum clarity for rural farmers
  utterance.pitch = 1.0;

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);

  return {
    stop: () => {
      window.speechSynthesis.cancel();
      if (onEnd) onEnd();
    },
  };
}
