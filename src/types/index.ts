export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover'

export interface Obstacle {
  id: number
  lane: number
  y: number
}

export interface GameSnapshot {
  score: number
  highScore: number
  status: GameStatus
}
