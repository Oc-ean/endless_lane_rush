<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { useRouter } from 'vue-router'

const game = useGameStore()
const router = useRouter()

const emit = defineEmits<{ restart: [] }>()

function onResume() {
  game.resumeGame()
}

function onRestart() {
  emit('restart')
}

function onExit() {
  game.resetGame()
  router.push({ name: 'home' })
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
  >
    <div
      v-if="game.isPaused"
      class="absolute inset-0 z-40 flex items-center justify-center bg-asphalt/80 backdrop-blur-sm px-4"
    >
      <div
        class="w-full max-w-xs sm:max-w-sm rounded-2xl border border-white/10 bg-asphalt-light p-6 sm:p-8 text-center shadow-2xl"
      >
        <p class="font-display text-xs uppercase tracking-[0.35em] text-speed-yellow/80">Race Halted</p>
        <h2 class="mt-2 font-display text-3xl sm:text-4xl font-bold text-chalk">Paused</h2>

        <div class="mt-6 rounded-lg bg-asphalt/60 border border-white/10 py-3">
          <p class="text-[10px] uppercase tracking-[0.2em] text-chalk/50 font-display">Current Score</p>
          <p class="font-display text-xl font-bold text-speed-yellow tabular-nums">{{ game.score }}</p>
        </div>

        <div class="mt-7 flex flex-col gap-3">
          <button
            class="w-full rounded-full bg-speed-yellow py-3 font-display text-base font-bold uppercase tracking-wide text-asphalt transition hover:brightness-110 active:scale-95"
            @click="onResume"
          >
            Resume
          </button>
          <button
            class="w-full rounded-full border border-white/15 py-3 font-display text-base font-semibold uppercase tracking-wide text-chalk/70 transition hover:bg-white/5 active:scale-95"
            @click="onRestart"
          >
            Restart
          </button>
          <button
            class="w-full rounded-full border border-white/10 py-3 font-display text-sm font-medium uppercase tracking-wide text-chalk/40 transition hover:bg-white/5 hover:text-chalk/60 active:scale-95"
            @click="onExit"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
