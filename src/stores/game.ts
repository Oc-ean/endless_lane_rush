import { defineStore } from "pinia";
import type { GameStatus, Obstacle } from "@/types";

const HIGH_SCORE_KEY = "lane-rush-high-score";
const LANE_COUNT = 3;
const CENTER_LANE = 1;

const BASE_SPEED = 38;
const MAX_SPEED = 95;
const ACCELERATION_PER_SEC = 0.35;
const BASE_SPAWN_INTERVAL = 1.15;
const MIN_SPAWN_INTERVAL = 0.45;
const SPAWN_INTERVAL_DECAY = 0.006;
const JUMP_DURATION = 0.85;
const JUMP_LANDING_GRACE = 0.18;
const MILESTONE_SCORE = 100;
const MILESTONE_SPEED_BOOST = 8;
let obstacleUid = 0;

export const useGameStore = defineStore("game", {
  state: () => ({
    status: "idle" as GameStatus,
    lane: CENTER_LANE,
    laneCount: LANE_COUNT,
    score: 0,
    highScore: Number(localStorage.getItem(HIGH_SCORE_KEY) ?? 0),
    distance: 0,
    elapsed: 0,
    speed: BASE_SPEED,
    milestoneBonus: 0,
    milestonesReached: 0,
    lastBoostAt: -Infinity,
    spawnInterval: BASE_SPAWN_INTERVAL,
    obstacleTimer: 0,
    isJumping: false,
    jumpTimer: 0,
    landingGrace: 0,
    obstacles: [] as Obstacle[],
    justCrashed: false,
  }),

  getters: {
    isPlaying: (state) => state.status === "playing",
    isPaused: (state) => state.status === "paused",
    isGameOver: (state) => state.status === "gameover",
    laneOffsets: (state) => {
      const step = 100 / state.laneCount;
      return Array.from(
        { length: state.laneCount },
        (_, i) => step * i + step / 2,
      );
    },
  },

  actions: {
    startGame() {
      this.status = "playing";
      this.lane = CENTER_LANE;
      this.score = 0;
      this.distance = 0;
      this.elapsed = 0;
      this.speed = BASE_SPEED;
      this.milestoneBonus = 0;
      this.milestonesReached = 0;
      this.lastBoostAt = -Infinity;

      this.spawnInterval = BASE_SPAWN_INTERVAL;
      this.obstacleTimer = 0;
      this.isJumping = false;
      this.jumpTimer = 0;
      this.landingGrace = 0;
      this.obstacles = [];
      this.justCrashed = false;
    },

    moveLeft() {
      if (this.status !== "playing") return;
      this.lane = Math.max(0, this.lane - 1);
    },

    moveRight() {
      if (this.status !== "playing") return;
      this.lane = Math.min(this.laneCount - 1, this.lane + 1);
    },

    jump() {
      if (this.status !== "playing" || this.isJumping) return;
      this.isJumping = true;
      this.jumpTimer = 0;
    },

    spawnObstacle() {
      const lane = Math.floor(Math.random() * this.laneCount);
      this.obstacles.push({ id: obstacleUid++, lane, y: -18 });
    },

    tick(dt: number) {
      if (this.status !== "playing") return;
      const step = Math.min(dt, 0.05);

      this.elapsed += step;

      const milestone = Math.floor(this.score / MILESTONE_SCORE);
      if (milestone > this.milestonesReached) {
        this.milestonesReached = milestone;
        this.milestoneBonus += MILESTONE_SPEED_BOOST;
        this.lastBoostAt = this.elapsed;
      }

      this.speed = Math.min(
        MAX_SPEED,
        BASE_SPEED + this.elapsed * ACCELERATION_PER_SEC + this.milestoneBonus,
      );
      this.spawnInterval = Math.max(
        MIN_SPAWN_INTERVAL,
        BASE_SPAWN_INTERVAL - this.elapsed * SPAWN_INTERVAL_DECAY,
      );

      this.distance += this.speed * step;
      this.score = Math.floor(this.distance / 8);

      for (const obstacle of this.obstacles) {
        obstacle.y += this.speed * step;
      }
      this.obstacles = this.obstacles.filter((o) => o.y < 115);

      this.obstacleTimer += step;
      if (this.obstacleTimer >= this.spawnInterval) {
        this.obstacleTimer = 0;
        this.spawnObstacle();
      }

      if (this.isJumping) {
        this.jumpTimer += step;
        if (this.jumpTimer >= JUMP_DURATION) {
          this.isJumping = false;
          this.landingGrace = JUMP_LANDING_GRACE;
        }
      } else if (this.landingGrace > 0) {
        this.landingGrace = Math.max(0, this.landingGrace - step);
      }
    },

    pauseGame() {
      if (this.status !== "playing") return;
      this.status = "paused";
    },

    resumeGame() {
      if (this.status !== "paused") return;
      this.status = "playing";
    },

    registerCollision() {
      if (this.status !== "playing") return;
      if (this.isJumping || this.landingGrace > 0) return;
      this.endGame();
    },

    endGame() {
      if (this.status === "gameover") return;
      this.status = "gameover";
      this.justCrashed = true;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem(HIGH_SCORE_KEY, String(this.highScore));
      }
    },

    resetGame() {
      this.status = "idle";
      this.obstacles = [];
      this.score = 0;
      this.justCrashed = false;
      this.isJumping = false;
      this.landingGrace = 0;
    },
  },
});
