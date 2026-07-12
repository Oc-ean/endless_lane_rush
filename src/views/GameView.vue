<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { useGameControls } from '@/composables/useGameControls'
import RoadBackground from '@/components/RoadBackground.vue'
import PlayerCar from '@/components/PlayerCar.vue'
import ObstacleCar from '@/components/ObstacleCar.vue'
import GameHud from '@/components/GameHud.vue'
import GameOverModal from '@/components/GameOverModal.vue'

const game = useGameStore()
useGameControls()

const roadOffset = ref(0)
let rafId = 0
let lastTime = 0

function loop(timestamp: number) {
  if (!lastTime) lastTime = timestamp
  const dt = (timestamp - lastTime) / 1000
  lastTime = timestamp

  if (game.status === 'playing') {
    game.tick(dt)
    roadOffset.value += game.speed * dt * 4
  }

  rafId = requestAnimationFrame(loop)
}

function handleRestart() {
  roadOffset.value = 0
  game.startGame()
}

onMounted(() => {
  game.startGame()
  rafId = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
})

function handleCarTap() {
  game.jump()
}
</script>

<template>
  <div class="relative h-[100dvh] w-full select-none touch-none">
    <RoadBackground :offset="roadOffset">
      <div class="absolute inset-0" @click="handleCarTap">
        <PlayerCar />
        <ObstacleCar v-for="obstacle in game.obstacles" :key="obstacle.id" :obstacle="obstacle" />
      </div>
    </RoadBackground>

    <GameHud />
    <GameOverModal @restart="handleRestart" />
  </div>
</template>