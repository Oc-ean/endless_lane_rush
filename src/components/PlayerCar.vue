<script setup lang="ts">
import { computed } from 'vue'
import carImg from '@/assets/images/player-car.png'
import { useGameStore } from '@/stores/game'

const game = useGameStore()

const laneX = computed(() => game.laneOffsets[game.lane])
</script>

<template>
  <div
    class="absolute w-[17%] max-w-[58px] transition-[left] duration-200 ease-out z-10"
    :class="{ 'z-20': game.isJumping }"
    :style="{
      left: `${laneX}%`,
      bottom: '14%',
      transform: 'translateX(-50%)'
    }"
  >
    <div
      class="absolute left-1/2 bottom-[6%] h-[10%] w-[70%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-[2px]"
      :class="game.isJumping ? 'animate-jump-shadow' : ''"
    ></div>

    <img
      :key="game.isJumping ? 'jumping' : 'grounded'"
      :src="carImg"
      alt="Player car"
      class="relative w-full select-none pointer-events-none drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)]"
      :class="{
        'animate-car-jump drop-shadow-[0_28px_16px_rgba(0,0,0,0.5)]': game.isJumping,
        'grayscale opacity-70 rotate-6': game.isGameOver
      }"
      draggable="false"
    />
  </div>
</template>