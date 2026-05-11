# Game design: Sovereign Year

## Working pitch

Sovereign Year is a short-burst, single-player strategy game about state formation in a fictional
late-medieval / Renaissance realm. Each turn is one year. The player chooses one policy, sees the
realm change, and can either continue immediately at reduced decision quality or come back later with
more deliberation.

The fictional setting keeps content flexible, while mechanics and notes can teach real historical
patterns: charters, estates, printing, surveys, taxation, faction bargains, and centralization.

## Why this concept fits the interview

- **Historical interest:** medieval, Renaissance, and early modern state formation.
- **Turn-based strategy:** one policy per yearly tick.
- **Technology advancement:** knowledge unlocks historical technologies.
- **Politics:** factions react differently to policies.
- **Short sessions:** a turn can be completed in roughly 30-90 seconds.
- **No servers:** all state transitions are local and deterministic.
- **Minimal assets:** the game can work with maps, cards, typography, and generated icons.
- **Learning:** historical facts appear as consequences rather than quizzes.
- **Phone-away incentive:** deliberation accumulates while away and improves outcomes.

## Core loop

1. Read the current realm status.
2. Choose one yearly policy.
3. The engine updates resources, faction moods, province control/development/unrest, and research.
4. The game shows a concise historical note and outcome.
5. The player can continue now at a lower pace-quality multiplier or stop and regain deliberation.

## Current mechanics

### Resources

- **Grain:** food stability and immediate welfare.
- **Coin:** state capacity, spending power, and trade.
- **Legitimacy:** acceptance of rule by factions and provinces.
- **Knowledge:** administrative, technical, and scholarly progress.

### Factions

- Merchant Guilds
- Landed Nobles
- Cathedral Chapter
- Town Commons

Factions currently track influence and mood. Mood changes are implemented; influence exists for
future event weighting and bargaining mechanics.

### Provinces

- The Seat
- Riverlands
- Hill March

Provinces track control, development, and unrest. The current UI renders them as a map-like board
rather than a full tile map.

### Technologies

- Town Charters
- Printing Networks
- Cadastral Surveys

Technologies unlock when a decision contributes to a field and knowledge reaches the technology cost.

### Deliberation and pace quality

Deliberation is the first phone-away experiment:

- Deliberation accumulates over time while the player is away.
- High deliberation increases the pace-quality multiplier.
- Consecutive turns reduce the multiplier.
- There is no hard timer and no punishment for stopping.

This makes "take one more turn" tempting, but less efficient, matching the desired balance between
speed and quality decision-making.

## Tone

Approachable historical strategy:

- serious enough to teach real concepts
- light enough for quick mobile sessions
- fictional enough to avoid needing a huge factual database at the start

## Design principles

1. One turn should fit in a short queue or bus-stop moment.
2. Every mechanic should be legible from the UI.
3. Historical learning should mostly happen through cause and effect.
4. Systems should be simple enough for AI-assisted iteration.
5. The game should remain fully playable offline.
