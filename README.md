# Sovereign Year

Sovereign Year is a tiny, offline, mobile-first turn-based strategy game prototype for iOS and Android.
You guide a late-medieval / Renaissance realm through one-year turns, balancing grain, coin,
legitimacy, knowledge, factions, provinces, and technology.

The project is intentionally set up for a web developer using AI assistance:

- **Stack:** Expo + React Native + TypeScript
- **Game loop:** one short policy decision per year
- **Mobile target:** iOS and Android, with optional web preview
- **Server cost:** none; the game is fully single-player
- **Maintenance:** linting, formatting, type-checking, tests, and CI

## Store account costs

Building and testing can be free, but publishing to the two major app stores is not free unless you
already have eligible accounts:

- Apple Developer Program: **USD $99/year**
- Google Play Console: **USD $25 one-time registration fee**

If the budget must remain exactly zero, the realistic alternatives are publishing as a web/PWA game,
sharing Android APKs outside the Play Store, or building the mobile game now and publishing later.

## Quick start

```bash
npm install
npm run start
```

Then choose one of the Expo targets:

- Android emulator/device: `npm run android`
- iOS simulator/device: `npm run ios` (requires macOS for simulator/native builds)
- Browser preview: `npm run web`

## Validation

```bash
npm run validate
```

This runs:

1. ESLint
2. TypeScript type-checking
3. Jest tests for the game engine
4. Prettier format checks

## Project structure

```text
App.tsx                  Mobile prototype UI
src/game/content.ts      Starting historical content and decisions
src/game/engine.ts       Pure game-state transition logic
src/game/types.ts        Game domain types
docs/game-design.md      Current concept and mechanics
docs/roadmap.md          Feature slices that build on each other
docs/tools-and-assets.md Free tooling and AI-assisted asset guidance
docs/release.md          Build, store, CI, and CD notes
```

## Current prototype

The first playable slice includes:

- a map-like realm view with three provinces
- four resources
- four political factions
- four yearly policy decisions
- a deliberation mechanic that rewards time away from the phone
- diminishing rewards when taking many turns in a row
- historical notes hidden inside decisions and outcomes

The goal is not to finish the full game immediately. It is to create a stable framework where each
future 40-minute session can add one visible improvement.
