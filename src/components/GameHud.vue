<script setup lang="ts">
import { useGameStore } from '@/stores/game'

const game = useGameStore()
</script>

<template>
  <div class="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-3 sm:p-5">
    <div class="pointer-events-auto rounded-lg bg-asphalt/70 backdrop-blur px-3 py-2 sm:px-4 sm:py-2.5 border border-white/10">
      <p class="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-chalk/50 font-display">Score</p>
      <p class="text-xl sm:text-2xl font-display font-bold leading-none text-speed-yellow tabular-nums">
        {{ game.score.toString().padStart(5, '0') }}
      </p>
    </div>

        <button
      class="pointer-events-auto flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-asphalt/70 backdrop-blur border border-white/10 transition hover:bg-white/10 active:scale-90"
      aria-label="Pause game"
      @click="game.pauseGame()"
    >
      <svg viewBox="0 0 24 24" class="h-4 w-4 sm:h-5 sm:w-5 fill-chalk/80">
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />
      </svg>
    </button>

    <div class="pointer-events-auto rounded-lg bg-asphalt/70 backdrop-blur px-3 py-2 sm:px-4 sm:py-2.5 border border-white/10 text-right">
      <p class="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-chalk/50 font-display">Best</p>
      <p class="text-lg sm:text-xl font-display font-semibold leading-none text-chalk/80 tabular-nums">
        {{ game.highScore.toString().padStart(5, '0') }}
      </p>
    </div>
  </div>
</template>
