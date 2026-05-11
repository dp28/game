# Runway Ramen

Runway Ramen is a tiny, offline, mobile-first turn-based strategy game prototype for iOS and Android.
You guide a very small SaaS company through weekly sprints, balancing cash, users, morale, insight,
stakeholders, company areas, and upgrades.

The project is intentionally set up for a web developer using AI assistance:

- **Stack:** Expo + React Native + TypeScript
- **Game loop:** one short company-building decision per week
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
src/game/content.ts      Starting SaaS company content and decisions
src/game/engine.ts       Pure game-state transition logic
src/game/types.ts        Game domain types
docs/game-design.md      Current concept and mechanics
docs/roadmap.md          Feature slices that build on each other
docs/tools-and-assets.md Free tooling and AI-assisted asset guidance
docs/release.md          Build, store, CI, and CD notes
```

## Current prototype

The first playable slice includes:

- a map-like company view with three operating areas
- four resources
- four stakeholder groups
- ten weekly sprint and exit decisions
- lifecycle phases from founding through validation, growth, scale, exit, post-exit, and completion
- board confidence, including CEO ousting if confidence collapses
- acquisition and IPO routes where scoring waits for absorption/cancellation or one public-market year
- a focus mechanic that rewards time away from the phone
- diminishing rewards when taking many sprint turns in a row
- practical SaaS/product lessons hidden inside decisions and outcomes

The goal is not to finish the full game immediately. It is to create a stable framework where each
future 40-minute session can add one visible improvement.
