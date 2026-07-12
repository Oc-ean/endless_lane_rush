import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { playJump, playLaneChange, primeAudio } from '@/composables/useSounds'

const SWIPE_THRESHOLD = 40

export function useGameControls() {
  const game = useGameStore()

  let touchStartX = 0
  let touchStartY = 0
  let touchStartTime = 0

  function move(direction: 'left' | 'right') {
    const before = game.lane
    if (direction === 'left') game.moveLeft()
    else game.moveRight()
    if (game.lane !== before) playLaneChange()
  }

  function triggerJump() {
    const wasJumping = game.isJumping
    game.jump()
    if (!wasJumping && game.isJumping) playJump()
  }

  function handleKeydown(e: KeyboardEvent) {
    primeAudio()
    switch (e.code) {
      case 'ArrowLeft':
        e.preventDefault()
        move('left')
        break
      case 'ArrowRight':
        e.preventDefault()
        move('right')
        break
      case 'Space':
        e.preventDefault()
        triggerJump()
        break
      case 'Escape':
      case 'KeyP':
        e.preventDefault()
        game.pauseGame()
        break
    }
  }

  function handleTouchStart(e: TouchEvent) {
    primeAudio()
    const touch = e.touches[0]!
    touchStartX = touch.clientX
    touchStartY = touch.clientY
    touchStartTime = Date.now()
  }

  function handleTouchEnd(e: TouchEvent) {
    const touch = e.changedTouches[0]!
    const dx = touch.clientX - touchStartX
    const dy = touch.clientY - touchStartY
    const dt = Date.now() - touchStartTime
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)

    if (absX < 15 && absY < 15) {
      triggerJump()
      return
    }

    if (absX > absY && absX > SWIPE_THRESHOLD) {
      if (dx > 0) move('right')
      else move('left')
    } else if (absY > SWIPE_THRESHOLD && dy < 0) {
      triggerJump()
    }

    void dt
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchend', handleTouchEnd)
  })

  return { game }
}
