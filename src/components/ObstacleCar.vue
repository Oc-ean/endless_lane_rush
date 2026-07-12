<script setup lang="ts">
import { computed } from 'vue'
import carImg from '@/assets/images/obstacle-car.png'
import { useGameStore } from '@/stores/game'
import type { Obstacle } from '@/types'

const props = defineProps<{ obstacle: Obstacle }>()
const game = useGameStore()

const laneX = computed(() => game.laneOffsets[props.obstacle.lane])
</script>

<template>
  <div
    class="absolute w-[24%] max-w-[92px] z-10"
    :style="{
      left: `${laneX}%`,
      top: `${obstacle.y}%`,
      transform: 'translate(-50%, -50%)'
    }"
  >
    <img :src="carImg" alt="Obstacle car" class="w-full select-none pointer-events-none" draggable="false" />
  </div>
</template>
