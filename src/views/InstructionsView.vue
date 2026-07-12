<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goPlay() {
  router.push({ name: 'game' })
}
function goHome() {
  router.push({ name: 'home' })
}

const desktopControls = [
  { key: '←', action: 'Move one lane left' },
  { key: '→', action: 'Move one lane right' },
  { key: 'Space', action: 'Jump over obstacles' }
]

const mobileControls = [
  { key: 'Swipe left', action: 'Move one lane left' },
  { key: 'Swipe right', action: 'Move one lane right' },
  { key: 'Swipe up / Tap car', action: 'Jump over obstacles' }
]
</script>

<template>
  <div class="relative min-h-[100dvh] w-full overflow-hidden flex flex-col px-5 py-8 sm:py-12">
    <div class="absolute inset-0 bg-speed-lines opacity-30"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-asphalt via-asphalt/95 to-asphalt-light"></div>

    <div class="relative z-10 mx-auto w-full max-w-md flex-1 flex flex-col">
      <button
        class="mb-6 self-start font-display text-sm uppercase tracking-[0.2em] text-chalk/50 hover:text-chalk/80 transition"
        @click="goHome"
      >
        &larr; Back
      </button>

      <h1 class="font-display text-4xl sm:text-5xl font-bold italic text-chalk">How To Play</h1>
      <p class="mt-2 text-sm text-chalk/60">
        Survive as long as you can. The road speeds up the longer you last, so stay sharp.
      </p>

      <section class="mt-8">
        <h2 class="font-display text-xs uppercase tracking-[0.3em] text-speed-yellow">Desktop</h2>
        <ul class="mt-3 flex flex-col gap-2">
          <li
            v-for="item in desktopControls"
            :key="item.key"
            class="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <span
              class="min-w-[64px] rounded-md bg-asphalt-lighter px-3 py-1.5 text-center font-display text-sm font-semibold text-chalk border border-white/10"
              >{{ item.key }}</span
            >
            <span class="text-sm text-chalk/70">{{ item.action }}</span>
          </li>
        </ul>
      </section>

      <section class="mt-6">
        <h2 class="font-display text-xs uppercase tracking-[0.3em] text-speed-yellow">Mobile</h2>
        <ul class="mt-3 flex flex-col gap-2">
          <li
            v-for="item in mobileControls"
            :key="item.key"
            class="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
          >
            <span
              class="min-w-[110px] rounded-md bg-asphalt-lighter px-3 py-1.5 text-center font-display text-xs font-semibold text-chalk border border-white/10"
              >{{ item.key }}</span
            >
            <span class="text-sm text-chalk/70">{{ item.action }}</span>
          </li>
        </ul>
      </section>

      <section class="mt-6 rounded-xl border border-speed-red/30 bg-speed-red/5 px-4 py-3">
        <p class="text-sm text-chalk/70">
          Jumping lets you pass over an obstacle without crashing &mdash; time it before you hit the lane it's in.
        </p>
      </section>

      <button
        class="mt-8 w-full rounded-full bg-speed-yellow py-3.5 font-display text-lg font-bold uppercase tracking-wide text-asphalt transition hover:brightness-110 active:scale-95"
        @click="goPlay"
      >
        Play Now
      </button>
    </div>
  </div>
</template>
