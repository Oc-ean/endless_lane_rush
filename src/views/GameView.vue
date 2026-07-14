<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useGameStore, BASE_SPEED, MAX_SPEED } from '@/stores/game'
import { useGameControls } from '@/composables/useGameControls'
import {
  primeAudio,
  playJump,
  playCrash,
  playGameOverJingle,
  playMilestone,
  startEngine,
  stopEngine,
  updateEngine
} from '@/composables/useSounds'
import RoadBackground from '@/components/RoadBackground.vue'
import PlayerCar from '@/components/PlayerCar.vue'
import ObstacleCar from '@/components/ObstacleCar.vue'
import GameHud from '@/components/GameHud.vue'
import GameOverModal from '@/components/GameOverModal.vue'
import GamePauseModal from '@/components/GamePauseModal.vue'


const PLAYER_HITBOX_INSET = { left: 0.07, right: 0.08, top: 0.07, bottom: 0.08 }
const OBSTACLE_HITBOX_INSET = { left: 0.18, right: 0.12, top: 0.09, bottom: 0.08 }

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

interface SideInsets {
  left: number
  right: number
  top: number
  bottom: number
}

function shrinkRect(rect: DOMRect, inset: SideInsets) {
  return {
    left: rect.left + rect.width * inset.left,
    right: rect.right - rect.width * inset.right,
    top: rect.top + rect.height * inset.top,
    bottom: rect.bottom - rect.height * inset.bottom
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
    updateEngine((game.speed - BASE_SPEED) / (MAX_SPEED - BASE_SPEED))
  }

  rafId = requestAnimationFrame(loop)
}

function handleRestart() {
  roadOffset.value = 0
  game.startGame()
}

watch(
  () => game.status,
  (status, prevStatus) => {
    if (status === 'gameover' && prevStatus !== 'gameover') {
      stopEngine()
      playCrash()
      setTimeout(() => playGameOverJingle(), 320)
    } else if (status === 'paused') {
      stopEngine()
    } else if (status === 'playing' && prevStatus !== 'playing') {
      startEngine()
    }
  }
)

watch(
  () => game.milestonesReached,
  (value, prev) => {
    if (value > prev) playMilestone()
  }
)

onMounted(() => {
  primeAudio()
  game.startGame()
  startEngine()
  rafId = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  stopEngine()
})

function handleCarTap() {
  const wasJumping = game.isJumping
  game.jump()
  if (!wasJumping && game.isJumping) playJump()
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
