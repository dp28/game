# Roadmap

This roadmap is split into small feature slices so each work session can produce visible progress.
The slices are ordered to build from a stable core loop toward release readiness.

## Slice 0: Project foundation

Status: started.

- Expo React Native TypeScript app
- Pure game engine in `src/game`
- Lifecycle model with founding, validation, growth, scale, exit, post-exit, complete, and ousted phases
- Board confidence, CEO ousting, acquisition integration, IPO market-test, and delayed scoring hooks
- Linting, type-checking, formatting, tests, and CI
- Initial docs for design, roadmap, tools, and release

## Slice 1: Playable weekly sprint loop

Goal: make the current prototype pleasant to play for 2-5 minutes.

- Add local save/load for game state.
- Add a reset-new-company flow.
- Add clearer turn summary cards.
- Add resource delta previews before committing a decision.
- Show why board confidence changed after each turn.
- Keep undo disabled.

## Slice 2: Better phone-away experiments

Goal: test multiple incentives for not touching the phone.

- Focus: already implemented as the first experiment.
- Add "founder fog" that affects stakeholder trust after many rapid turns.
- Add daily "strategy memo quality" that scores fewer, better-considered sessions.
- Add settings to tune timer length for testing.
- Track simple local analytics counters without sending data anywhere.

## Slice 3: SaaS content pack

Goal: make learning feel embedded in play.

- Expand decisions from 4 to 20.
- Add lessons for activation, retention, pricing, support, churn, onboarding, positioning, and runway.
- Add event cards with startup-flavored dilemmas.
- Add a lightweight in-game notebook of discovered concepts.
- Keep the company fictional but annotate real SaaS principles in content files.

## Slice 4: Stakeholders and negotiation

Goal: make company politics matter.

- Give each stakeholder group an agenda.
- Add stakeholder requests and concessions.
- Let stakeholder mood modify resource outcomes.
- Add board-meeting turns where customers, team, sales, and investors must be balanced.
- Make high-influence angry stakeholders trigger events.
- Add explicit board-meeting event turns that can warn the player before ousting.

## Slice 5: Company phases and exit routes

Goal: make the full arc from founding to exit feel intentional.

- Add phase-specific decision pools beyond the current starter set.
- Add explicit acquisition and IPO preparation milestones.
- Add acquisition integration events: retention packages, roadmap merge, brand sunset, support handoff.
- Add IPO-year events: quarterly guidance, analyst calls, lockup expiry, activist investor noise.
- Add cancelled-deal outcomes that are funny but mechanically clear.
- Tune final scoring so acquisition and IPO routes feel different but comparable.

## Slice 6: Company map and product expansion

Goal: make the company/product map more strategic without requiring expensive art.

- Add 6-9 company areas or product surfaces.
- Add area traits such as enterprise, self-serve, onboarding, integrations, support, or analytics.
- Allow expansion into new SaaS motions such as PLG, sales-led, or marketplace add-ons.
- Show simple adjacency using SVG or React Native views.
- Add map filters for traction, polish, chaos, and support load.

## Slice 7: Upgrade tree

Goal: turn insight into long-term strategy.

- Replace the simple unlock list with a small upgrade tree.
- Add upgrade prerequisites.
- Add different research tracks: product, growth, revenue, operations.
- Make upgrades modify future decision effects.
- Add a final-stage goal tied to runway, retention, and morale.

## Slice 8: Balancing and replayability

Goal: make the game interesting across repeated short sessions.

- Add scoring based on runway, retention, user trust, morale, and restraint.
- Add medium-random events.
- Add seedable starts for deterministic testing.
- Add difficulty presets.
- Add end states such as profitable niche, acquisition bait, lifestyle business, or "pivot into a newsletter."

## Slice 9: Release readiness

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
