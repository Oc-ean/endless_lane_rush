import { ref, watch } from 'vue'

const MUTE_KEY = 'lane-rush-muted'
export const isMuted = ref(localStorage.getItem(MUTE_KEY) === '1')

watch(isMuted, (muted) => {
  localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
  if (muted) stopEngine()
})

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioCtor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtor) return null
  if (!ctx) ctx = new AudioCtor()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function primeAudio() {
  getCtx()
}

function playTone(
  freqStart: number,
  freqEnd: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.2,
  delay = 0
) {
  if (isMuted.value) return
  const audioCtx = getCtx()
  if (!audioCtx) return
  const startAt = audioCtx.currentTime + delay
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freqStart, startAt)
  osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), startAt + duration)
  gain.gain.setValueAtTime(volume, startAt)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(startAt)
  osc.stop(startAt + duration + 0.02)
}

function playNoiseBurst(duration: number, volume = 0.3) {
  if (isMuted.value) return
  const audioCtx = getCtx()
  if (!audioCtx) return
  const bufferSize = Math.max(1, Math.floor(audioCtx.sampleRate * duration))
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }
  const noise = audioCtx.createBufferSource()
  noise.buffer = buffer
  const gain = audioCtx.createGain()
  gain.gain.setValueAtTime(volume, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration)
  const filter = audioCtx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 900
  noise.connect(filter)
  filter.connect(gain)
  gain.connect(audioCtx.destination)
  noise.start()
}

export function playJump() {
  playTone(320, 760, 0.22, 'triangle', 0.16)
}

export function playCrash() {
  playNoiseBurst(0.45, 0.32)
  playTone(160, 35, 0.45, 'sawtooth', 0.22)
}

export function playLaneChange() {
  playTone(520, 660, 0.07, 'square', 0.07)
}

export function playMilestone() {
  ;[523, 659, 784].forEach((freq, i) => playTone(freq, freq, 0.16, 'sine', 0.14, i * 0.08))
}

export function playClick() {
  playTone(680, 480, 0.09, 'square', 0.1)
}

export function playGameOverJingle() {
  ;[392, 349, 294, 220].forEach((freq, i) => playTone(freq, freq * 0.9, 0.25, 'triangle', 0.14, i * 0.14))
}


let engineOsc: OscillatorNode | null = null
let engineOsc2: OscillatorNode | null = null
let engineFilter: BiquadFilterNode | null = null
let engineGain: GainNode | null = null

const ENGINE_BASE_FREQ = 40
const ENGINE_MAX_FREQ = 75
const ENGINE_BASE_CUTOFF = 160
const ENGINE_MAX_CUTOFF = 380
const ENGINE_VOLUME = 0.02

export function startEngine() {
  if (isMuted.value) return
  const audioCtx = getCtx()
  if (!audioCtx || engineOsc) return

  engineFilter = audioCtx.createBiquadFilter()
  engineFilter.type = 'lowpass'
  engineFilter.frequency.value = ENGINE_BASE_CUTOFF
  engineFilter.Q.value = 0.5

  engineGain = audioCtx.createGain()
  engineGain.gain.value = 0.0001

  engineOsc = audioCtx.createOscillator()
  engineOsc.type = 'sawtooth'
  engineOsc.frequency.value = ENGINE_BASE_FREQ

  engineOsc2 = audioCtx.createOscillator()
  engineOsc2.type = 'sawtooth'
  engineOsc2.frequency.value = ENGINE_BASE_FREQ * 1.008 

  engineOsc.connect(engineFilter)
  engineOsc2.connect(engineFilter)
  engineFilter.connect(engineGain)
  engineGain.connect(audioCtx.destination)

  engineOsc.start()
  engineOsc2.start()
  engineGain.gain.setTargetAtTime(ENGINE_VOLUME, audioCtx.currentTime, 0.4)
}

export function updateEngine(speedRatio: number) {
  if (!engineOsc || !engineOsc2 || !engineFilter || !engineGain) return
  const audioCtx = getCtx()
  if (!audioCtx) return
  const clamped = Math.min(1, Math.max(0, speedRatio))
  const freq = ENGINE_BASE_FREQ + clamped * (ENGINE_MAX_FREQ - ENGINE_BASE_FREQ)
  engineOsc.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.25)
  engineOsc2.frequency.setTargetAtTime(freq * 1.008, audioCtx.currentTime, 0.25)
  engineFilter.frequency.setTargetAtTime(
    ENGINE_BASE_CUTOFF + clamped * (ENGINE_MAX_CUTOFF - ENGINE_BASE_CUTOFF),
    audioCtx.currentTime,
    0.25
  )
  engineGain.gain.setTargetAtTime(isMuted.value ? 0.0001 : ENGINE_VOLUME, audioCtx.currentTime, 0.25)
}

export function stopEngine() {
  const audioCtx = ctx
  if (engineGain && audioCtx) {
    engineGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.12)
  }
  const osc1ToStop = engineOsc
  const osc2ToStop = engineOsc2
  const filterToStop = engineFilter
  const gainToStop = engineGain
  engineOsc = null
  engineOsc2 = null
  engineFilter = null
  engineGain = null
  setTimeout(() => {
    try {
      osc1ToStop?.stop()
      osc1ToStop?.disconnect()
      osc2ToStop?.stop()
      osc2ToStop?.disconnect()
      filterToStop?.disconnect()
      gainToStop?.disconnect()
    } catch {
    }
  }, 200)
}

export function toggleMute() {
  isMuted.value = !isMuted.value
}