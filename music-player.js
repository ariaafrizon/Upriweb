const musicTrigger = document.querySelector('#music-toggle-button');
const musicPlayer = document.querySelector('#hiphop-player');

if (musicTrigger && musicPlayer) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const closeButton = musicPlayer.querySelector('.music-close');
  const playPauseButton = musicPlayer.querySelector('.music-play-pause');
  const trackButtons = [...musicPlayer.querySelectorAll('.music-track')];
  const nowPlaying = musicPlayer.querySelector('[data-now-playing]');
  const volumeControl = musicPlayer.querySelector('.music-volume');

  const beatPresets = [
    {
      title: 'Midnight Boom Bap', bpm: 88, swing: 0.12,
      kick: [1,0,0,0, .55,0,1,0, 1,0,0,.35, 0,.72,0,0],
      snare: [0,0,0,0, 1,0,0,.2, 0,0,0,0, 1,0,.18,0],
      hat: [.5,0,.35,0, .55,0,.35,.22, .5,0,.35,0, .62,0,.4,.2],
      bass: [36,null,null,36, null,null,39,null, 43,null,41,null, 39,null,36,null],
      chords: { 0: [48,51,55], 8: [43,46,50] }
    },
    {
      title: 'Neon Lo-Fi', bpm: 78, swing: 0.16,
      kick: [1,0,0,0, 0,0,.7,0, .8,0,0,0, 0,.58,0,.25],
      snare: [0,0,0,0, .86,0,0,.16, 0,0,0,0, .92,0,0,.2],
      hat: [.34,0,.24,.12, .4,0,.25,0, .34,0,.28,.12, .42,0,.24,.14],
      bass: [34,null,null,null, 34,null,37,null, 41,null,null,39, 37,null,34,null],
      chords: { 0: [46,50,53], 8: [41,45,48] }
    },
    {
      title: 'Upri Bounce', bpm: 96, swing: 0.08,
      kick: [1,0,0,.35, 0,0,.82,0, 1,0,.3,0, 0,.78,0,.38],
      snare: [0,0,0,0, 1,0,.15,0, 0,0,0,0, 1,0,.2,0],
      hat: [.55,0,.42,.18, .58,0,.44,.22, .55,0,.4,.18, .65,.18,.46,.28],
      bass: [38,null,38,null, 41,null,43,null, 45,null,43,null, 41,null,38,36],
      chords: { 0: [50,53,57], 8: [45,48,52] }
    }
  ];

  let audioContext;
  let masterGain;
  let noiseBuffer;
  let schedulerTimer;
  let nextStepTime = 0;
  let currentStep = 0;
  let activeBeat = 0;
  let isPlaying = false;

  function midiToFrequency(note) {
    return 440 * (2 ** ((note - 69) / 12));
  }

  function initializeAudio() {
    if (audioContext || !AudioContextClass) return;
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.gain.value = Number(volumeControl.value) / 100;
    masterGain.connect(audioContext.destination);
    noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);
    const noise = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noise.length; index += 1) noise[index] = Math.random() * 2 - 1;
  }

  function playKick(time, strength) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(145, time);
    oscillator.frequency.exponentialRampToValueAtTime(44, time + 0.15);
    gain.gain.setValueAtTime(0.9 * strength, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.24);
    oscillator.connect(gain).connect(masterGain);
    oscillator.start(time);
    oscillator.stop(time + 0.25);
  }

  function playSnare(time, strength) {
    const noiseSource = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    noiseSource.buffer = noiseBuffer;
    filter.type = 'bandpass';
    filter.frequency.value = 1850;
    filter.Q.value = 0.65;
    gain.gain.setValueAtTime(0.38 * strength, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.17);
    noiseSource.connect(filter).connect(gain).connect(masterGain);
    noiseSource.start(time);
    noiseSource.stop(time + 0.18);
  }

  function playHat(time, strength) {
    const noiseSource = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    noiseSource.buffer = noiseBuffer;
    filter.type = 'highpass';
    filter.frequency.value = 6100;
    gain.gain.setValueAtTime(0.1 * strength, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.055);
    noiseSource.connect(filter).connect(gain).connect(masterGain);
    noiseSource.start(time);
    noiseSource.stop(time + 0.06);
  }

  function playBass(time, note, duration) {
    const oscillator = audioContext.createOscillator();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(midiToFrequency(note), time);
    filter.type = 'lowpass';
    filter.frequency.value = 420;
    filter.Q.value = 2.5;
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(0.2, time + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    oscillator.connect(filter).connect(gain).connect(masterGain);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.02);
  }

  function playChord(time, notes, duration) {
    notes.forEach((note, index) => {
      const oscillator = audioContext.createOscillator();
      const filter = audioContext.createBiquadFilter();
      const gain = audioContext.createGain();
      oscillator.type = index === 0 ? 'triangle' : 'sine';
      oscillator.frequency.value = midiToFrequency(note);
      oscillator.detune.value = (index - 1) * 3;
      filter.type = 'lowpass';
      filter.frequency.value = 1150;
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(0.035, time + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      oscillator.connect(filter).connect(gain).connect(masterGain);
      oscillator.start(time);
      oscillator.stop(time + duration + 0.05);
    });
  }

  function scheduleStep(step, time) {
    const preset = beatPresets[activeBeat];
    const stepDuration = 60 / preset.bpm / 4;
    if (preset.kick[step]) playKick(time, preset.kick[step]);
    if (preset.snare[step]) playSnare(time, preset.snare[step]);
    if (preset.hat[step]) playHat(time, preset.hat[step]);
    if (preset.bass[step] !== null) playBass(time, preset.bass[step], stepDuration * 1.7);
    if (preset.chords[step]) playChord(time, preset.chords[step], stepDuration * 7.3);
  }

  function scheduler() {
    const preset = beatPresets[activeBeat];
    const baseStep = 60 / preset.bpm / 4;
    while (nextStepTime < audioContext.currentTime + 0.12) {
      scheduleStep(currentStep, nextStepTime);
      const swingMultiplier = currentStep % 2 === 0 ? 1 + preset.swing : 1 - preset.swing;
      nextStepTime += baseStep * swingMultiplier;
      currentStep = (currentStep + 1) % 16;
    }
  }

  function updatePlayerUI() {
    const preset = beatPresets[activeBeat];
    nowPlaying.textContent = preset.title;
    musicPlayer.classList.toggle('is-playing', isPlaying);
    musicTrigger.setAttribute('aria-pressed', String(isPlaying));
    musicTrigger.textContent = isPlaying ? 'Pause music' : 'Play with music';
    playPauseButton.textContent = isPlaying ? 'Pause' : 'Play';
    trackButtons.forEach((button, index) => button.classList.toggle('is-active', index === activeBeat));
  }

  async function startMusic() {
    initializeAudio();
    if (!audioContext) return;
    await audioContext.resume();
    masterGain.gain.cancelScheduledValues(audioContext.currentTime);
    masterGain.gain.setTargetAtTime(Number(volumeControl.value) / 100, audioContext.currentTime, 0.025);
    currentStep = 0;
    nextStepTime = audioContext.currentTime + 0.05;
    isPlaying = true;
    scheduler();
    clearInterval(schedulerTimer);
    schedulerTimer = window.setInterval(scheduler, 25);
    updatePlayerUI();
  }

  function stopMusic() {
    clearInterval(schedulerTimer);
    schedulerTimer = undefined;
    isPlaying = false;
    if (audioContext && masterGain) masterGain.gain.setTargetAtTime(0.001, audioContext.currentTime, 0.02);
    updatePlayerUI();
  }

  function showPlayer() {
    musicPlayer.hidden = false;
    musicTrigger.setAttribute('aria-expanded', 'true');
  }

  musicTrigger.addEventListener('click', async () => {
    showPlayer();
    if (isPlaying) stopMusic(); else await startMusic();
  });

  playPauseButton.addEventListener('click', async () => {
    if (isPlaying) stopMusic(); else await startMusic();
  });

  closeButton.addEventListener('click', () => {
    stopMusic();
    musicPlayer.hidden = true;
    musicTrigger.setAttribute('aria-expanded', 'false');
    musicTrigger.focus();
  });

  trackButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      activeBeat = Number(button.dataset.beat);
      if (isPlaying) {
        currentStep = 0;
        nextStepTime = audioContext.currentTime + 0.05;
      } else {
        await startMusic();
      }
      updatePlayerUI();
    });
  });

  volumeControl.addEventListener('input', () => {
    if (!audioContext || !masterGain) return;
    masterGain.gain.setTargetAtTime(Number(volumeControl.value) / 100, audioContext.currentTime, 0.025);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || musicPlayer.hidden) return;
    stopMusic();
    musicPlayer.hidden = true;
    musicTrigger.setAttribute('aria-expanded', 'false');
    musicTrigger.focus();
  });
}
