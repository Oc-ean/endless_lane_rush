<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { useGameControls } from '@/composables/useGameControls'
import RoadBackground from '@/components/RoadBackground.vue'
import PlayerCar from '@/components/PlayerCar.vue'
import ObstacleCar from '@/components/ObstacleCar.vue'
import GameHud from '@/components/GameHud.vue'
import GameOverModal from '@/components/GameOverModal.vue'
import GamePauseModal from '@/components/GamePauseModal.vue'


const PLAYER_HITBOX_INSET = 0.24
const OBSTACLE_HITBOX_INSET = 0.22

const game = useGameStore()
useGameControls()

const roadOffset = ref(0)
const playerCarRef = ref<InstanceType<typeof PlayerCar> | null>(null)
const obstacleEls = new Map<number, HTMLElement>()

let rafId = 0
let lastTime = 0

function setObstacleRef(id: number, el: unknown) {
  const node = (el as { $el?: HTMLElement } | HTMLElement | null)
  if (!node) {
    obstacleEls.delete(id)
    return
  }
  const domEl = node instanceof HTMLElement ? node : node.$el
  if (domEl instanceof HTMLElement) obstacleEls.set(id, domEl)
}

function shrinkRect(rect: DOMRect, inset: number) {
  const dx = rect.width * inset
  const dy = rect.height * inset
  return {
    left: rect.left + dx,
    right: rect.right - dx,
    top: rect.top + dy,
    bottom: rect.bottom - dy
  }
}

function rectsOverlap(
  a: { left: number; right: number; top: number; bottom: number },
  b: { left: number; right: number; top: number; bottom: number }
) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

function checkPixelCollisions() {
  const playerEl = (playerCarRef.value as unknown as { $el?: HTMLElement } | null)?.$el
  if (!(playerEl instanceof HTMLElement)) return

  const playerRect = shrinkRect(playerEl.getBoundingClientRect(), PLAYER_HITBOX_INSET)

  const activeIds = new Set(game.obstacles.map((o) => o.id))
  for (const id of obstacleEls.keys()) {
    if (!activeIds.has(id)) obstacleEls.delete(id)
  }

  for (const obstacle of game.obstacles) {
    if (obstacle.lane !== game.lane) continue
    const el = obstacleEls.get(obstacle.id)
    if (!el) continue
    const obstacleRect = shrinkRect(el.getBoundingClientRect(), OBSTACLE_HITBOX_INSET)
    if (rectsOverlap(playerRect, obstacleRect)) {
      game.registerCollision()
      return
    }
  }
}

function loop(timestamp: number) {
  if (!lastTime) lastTime = timestamp
  const dt = (timestamp - lastTime) / 1000
  lastTime = timestamp

  if (game.status === 'playing') {
    game.tick(dt)
    roadOffset.value += game.speed * dt * 4
    checkPixelCollisions()
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
        <PlayerCar ref="playerCarRef" />
        <ObstacleCar
          v-for="obstacle in game.obstacles"
          :key="obstacle.id"
          :ref="(el) => setObstacleRef(obstacle.id, el)"
          :obstacle="obstacle"
        />
      </div>
    </RoadBackground>

    <GameHud />
    <GamePauseModal @restart="handleRestart" />
    <GameOverModal @restart="handleRestart" />
  </div>
</template>
