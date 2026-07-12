<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { isMuted, toggleMute, playClick, primeAudio } from '@/composables/useSounds'
import playerCar from '@/assets/images/player-car.png'
import obstacleCar from '@/assets/images/obstacle-car.png'

const router = useRouter()
const game = useGameStore()

function goPlay() {
  primeAudio()
  playClick()
  router.push({ name: 'game' })
}

function goInstructions() {
  primeAudio()
  playClick()
  router.push({ name: 'instructions' })
}

function onToggleMute() {
  primeAudio()
  const wasMuted = isMuted.value
  toggleMute()
  if (wasMuted) playClick()
}
</script>

<template>
  <div class="relative min-h-[100dvh] w-full overflow-hidden flex flex-col">
    <div class="absolute inset-0 bg-speed-lines animate-stripe-scroll"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-asphalt via-asphalt/95 to-asphalt-light"></div>

    <div
      class="absolute inset-x-0 top-0 h-2 sm:h-3"
      style="background-image: repeating-linear-gradient(90deg, #F1FAEE 0 14px, #14151A 14px 28px); opacity:0.9"
    ></div>

    <button
      class="absolute right-4 top-5 sm:right-6 sm:top-7 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-white/[0.04] border border-white/10 transition hover:bg-white/10 active:scale-90"
      :aria-label="isMuted ? 'Unmute sound' : 'Mute sound'"
      @click="onToggleMute"
    >
      <svg v-if="isMuted" viewBox="0 0 24 24" class="h-4 w-4 sm:h-5 sm:w-5 fill-chalk/60">
        <path d="M4 9v6h4l5 5V4L8 9H4z" />
        <path
          d="M16.6 8.4a1 1 0 0 1 1.4 0L19 9.4l1-1a1 1 0 1 1 1.4 1.4l-1 1 1 1a1 1 0 1 1-1.4 1.4l-1-1-1 1a1 1 0 1 1-1.4-1.4l1-1-1-1a1 1 0 0 1 0-1.4z"
        />
      </svg>
      <svg v-else viewBox="0 0 24 24" class="h-4 w-4 sm:h-5 sm:w-5 fill-chalk/80">
        <path d="M4 9v6h4l5 5V4L8 9H4z" />
        <path d="M16.5 12a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
        <path d="M16 5.3v2.1c2 .9 3.5 3 3.5 5.6s-1.5 4.7-3.5 5.6v2.1c3-1 5.5-4 5.5-7.7S19 6.3 16 5.3z" />
      </svg>
    </button>

    <main class="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
      <p class="font-display text-xs sm:text-sm uppercase tracking-[0.5em] text-speed-yellow/80">
        Endless Arcade Racer
      </p>

      <h1
        class="font-display mt-2 text-[15vw] sm:text-7xl md:text-8xl font-bold leading-[0.9] italic tracking-tight text-chalk"
      >
        LANE<span class="text-speed-yellow">RUSH</span>
      </h1>

      <p class="mt-4 max-w-xs sm:max-w-sm text-sm sm:text-base text-chalk/60">
        Weave through traffic, time your jumps, and see how far you can push it before the road runs out of mercy.
      </p>

      <div class="relative mt-8 flex h-24 w-full max-w-[220px] items-end justify-between sm:max-w-[260px]">
        <img
          :src="obstacleCar"
          alt=""
          class="w-12 sm:w-14 opacity-90 rotate-180 drop-shadow-[0_8px_10px_rgba(0,0,0,0.4)]"
        />
        <img
          :src="playerCar"
          alt="Player car"
          class="w-14 sm:w-16 animate-float-y drop-shadow-[0_10px_12px_rgba(0,0,0,0.45)]"
        />
      </div>

      <div v-if="game.highScore > 0" class="mt-6 font-display text-sm text-chalk/50">
        Best run <span class="text-speed-yellow font-semibold">{{ game.highScore }}</span>
      </div>

      <div class="mt-8 flex w-full max-w-xs flex-col gap-3 sm:max-w-sm">
        <button
          class="w-full rounded-full bg-speed-yellow py-3.5 sm:py-4 font-display text-lg sm:text-xl font-bold uppercase tracking-wide text-asphalt shadow-[0_8px_24px_rgba(244,196,48,0.35)] transition hover:brightness-110 active:scale-95"
          @click="goPlay"
        >
          Play
        </button>
        <button
          class="w-full rounded-full border border-white/15 bg-white/[0.03] py-3.5 sm:py-4 font-display text-base sm:text-lg font-semibold uppercase tracking-wide text-chalk/80 transition hover:bg-white/[0.07] active:scale-95"
          @click="goInstructions"
        >
          Instructions
        </button>
      </div>
    </main>

    <footer class="relative z-10 pb-5 text-center text-[10px] uppercase tracking-[0.3em] text-chalk/30">
      Enjoy &middot; the game
    </footer>
  </div>
</template>
