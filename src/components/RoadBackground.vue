<script setup lang="ts">
import roadImg from '@/assets/images/road.png'

defineProps<{
  offset: number
}>()
</script>

<template>
  <div class="relative h-full w-full bg-speed-grass overflow-hidden">
    <div class="absolute inset-0 opacity-30 bg-speed-lines"></div>

    <div
      class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[78%] max-w-[420px] sm:w-[62%] md:w-[46%] lg:w-[36%] shadow-[0_0_60px_rgba(0,0,0,0.45)]"
    >
      <div
        class="absolute inset-0 bg-repeat-y"
        :style="{
          backgroundImage: `url(${roadImg})`,
          backgroundSize: '100% auto',
          backgroundPosition: `center ${offset}px`
        }"
      ></div>

      <div class="absolute inset-0">
        <slot />
      </div>

      <div class="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent"></div>
      <div class="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-black/40 to-transparent"></div>
    </div>
  </div>
</template>