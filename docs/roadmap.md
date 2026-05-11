# Roadmap

This roadmap is split into small feature slices so each work session can produce visible progress.
The slices are ordered to build from a stable core loop toward release readiness.

## Slice 0: Project foundation

Status: started.

- Expo React Native TypeScript app
- Pure game engine in `src/game`
- Linting, type-checking, formatting, tests, and CI
- Initial docs for design, roadmap, tools, and release

## Slice 1: Playable yearly loop

Goal: make the current prototype pleasant to play for 2-5 minutes.

- Add local save/load for game state.
- Add a reset-new-realm flow.
- Add clearer turn summary cards.
- Add resource delta previews before committing a decision.
- Keep undo disabled.

## Slice 2: Better phone-away experiments

Goal: test multiple incentives for not touching the phone.

- Deliberation: already implemented as the first experiment.
- Add "council fatigue" that affects faction trust after many rapid turns.
- Add daily "chronicle quality" that scores fewer, better-considered sessions.
- Add settings to tune timer length for testing.
- Track simple local analytics counters without sending data anywhere.

## Slice 3: Historical content pack

Goal: make learning feel embedded in play.

- Expand decisions from 4 to 20.
- Add facts for charters, estates, printing, surveying, taxation, roads, guilds, coinage, and law.
- Add event cards with historically inspired dilemmas.
- Add a lightweight in-game chronicle of discovered concepts.
- Keep the setting fictional but annotate real influences in content files.

## Slice 4: Factions and negotiation

Goal: make politics matter.

- Give each faction an agenda.
- Add faction requests and concessions.
- Let faction mood modify resource outcomes.
- Add "estate assembly" turns where multiple factions must be balanced.
- Make high-influence angry factions trigger events.

## Slice 5: Map and expansion

Goal: make the map more strategic without requiring expensive art.

- Add 6-9 provinces.
- Add province traits such as port, monastery, forest, border, or university town.
- Allow expansion through diplomacy, road building, or charters.
- Show simple adjacency using SVG or React Native views.
- Add map filters for unrest, control, and development.

## Slice 6: Technology tree

Goal: turn knowledge into long-term strategy.

- Replace the simple unlock list with a small tech tree.
- Add technology prerequisites.
- Add different research tracks: administration, commerce, military, culture.
- Make technologies modify future decision effects.
- Add a final-era goal tied to state capacity and legitimacy.

## Slice 7: Balancing and replayability

Goal: make the game interesting across repeated short sessions.

- Add scoring based on stability, prosperity, knowledge, and restraint.
- Add medium-random events.
- Add seedable starts for deterministic testing.
- Add difficulty presets.
- Add end states around 1500, 1550, or 1600.

## Slice 8: Release readiness

Goal: prepare for store submission once developer accounts exist.

- Replace placeholder bundle IDs.
- Add generated icons, splash screen, screenshots, and store copy.
- Add privacy policy text for an offline app.
- Build Android release artifacts.
- Build iOS artifacts on macOS or with a paid Apple Developer account.
- Run device testing on at least one Android and one iOS device.

## Suggested weekly pattern

Given a very small weekly time budget, keep each session narrow:

1. Pick one roadmap bullet.
2. Ask AI to implement only that bullet.
3. Run `npm run validate`.
4. Play one or two turns.
5. Commit the change.

Avoid expanding scope mid-session unless the validation loop is already green.
