<script setup lang="ts">
import { computed } from 'vue'
import carImg from '@/assets/images/player-car.png'
import { useGameStore } from '@/stores/game'

const game = useGameStore()

const laneX = computed(() => game.laneOffsets[game.lane])
</script>

<template>
  <div
    class="absolute w-[24%] max-w-[92px] transition-[left] duration-200 ease-out"
    :class="[game.isJumping ? 'z-20 scale-110 drop-shadow-[0_18px_14px_rgba(0,0,0,0.55)]' : 'z-10 drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)]']"
    :style="{
      left: `${laneX}%`,
      bottom: '14%',
      transform: `translateX(-50%) ${game.isJumping ? 'scale(1.12)' : 'scale(1)'}`,
      transition: 'left 0.2s ease-out, transform 0.25s ease-out'
    }"
  >
    <img
      :src="carImg"
      alt="Player car"
      class="w-full select-none pointer-events-none"
      :class="{ 'animate-float-y': game.isJumping, 'grayscale opacity-70 rotate-6': game.isGameOver }"
      draggable="false"
    />
  </div>
</template>
