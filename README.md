# 🚗 Lane Rush — Endless Car Game

Lane Rush is a fast-paced endless lane runner game inspired by the nostalgic classic car games from the Nokia era. Your goal is to survive for as long as possible by dodging oncoming traffic, jumping over obstacles, and reaching new high scores as the game gradually becomes more challenging.

# 🎨 Design

Design by Rose Ntuk
[View on LinkedIn](https://www.linkedin.com/in/rose-ntuk-833866240/)


## 🛠️ Stack
- Vue 3 (`<script setup>` + Composition API)
- TypeScript
- Pinia (game state & loop logic)
- Vue Router (Home / Instructions / Game views)
- Tailwind CSS 3.4.19
- Vite

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open the printed local URL in your browser. On a phone, use your machine's LAN IP (Vite prints it with `--host`) to test touch controls.

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run type-check
```

## 🕹️ Controls

**Desktop:** Arrow Left / Arrow Right to change lanes, Space to jump, Escape or `P` to pause.
**Mobile:** Swipe left / right to change lanes, swipe up or tap the car to jump. Use the pause button in the HUD to pause.

