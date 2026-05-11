# Game design: Runway Ramen

## Working pitch

Runway Ramen is a short-burst, single-player strategy game about starting and growing a tiny SaaS
company. Each turn is one week. The player chooses one company-building bet, watches the company
change, and can either continue immediately at reduced decision quality or come back later with more
focus.

The setting is slightly tongue-in-cheek: founder dashboards, tiny growth wins, nervous investors,
support queues, pricing experiments, morale rituals, and the occasional spreadsheet that develops
opinions. Mechanics and lessons can teach real SaaS concepts such as activation, retention, pricing,
support load, product quality, and runway.

## Why this concept fits the interview

- **Turn-based strategy:** one strategic bet per weekly sprint.
- **Technology advancement:** insight unlocks SaaS upgrades.
- **Politics:** stakeholders react differently to decisions.
- **Short sessions:** a turn can be completed in roughly 30-90 seconds.
- **No servers:** all state transitions are local and deterministic.
- **Minimal assets:** the game can work with dashboards, cards, simple diagrams, and generated icons.
- **Learning:** SaaS/product lessons appear as consequences rather than quizzes.
- **Phone-away incentive:** focus accumulates while away and improves outcomes.

## Core loop

1. Read the current founder dashboard.
2. Choose one weekly bet.
3. The engine updates resources, stakeholder moods, company-area traction/polish/chaos, and upgrades.
4. The game shows a concise product/business lesson and outcome.
5. The player can continue now at a lower pace-quality multiplier or stop and regain focus.

## Current mechanics

### Resources

- **Cash:** runway and ability to buy time.
- **Users:** active users or early customers.
- **Morale:** team energy and willingness to survive another roadmap discussion.
- **Insight:** product learning that unlocks better systems.

### Stakeholders

- Customers
- Engineers
- Investors
- Sales Team

Stakeholders currently track influence and mood. Mood changes are implemented; influence exists for
future event weighting, negotiation, and "who is currently blocking the roadmap" mechanics.

### Company areas

- Product
- Growth
- Ops

Company areas track traction, polish, and chaos. The current UI renders them as a map-like board
rather than a literal office floorplan.

### Upgrades

- Actually Useful Analytics
- Billing That Mostly Works
- Support Bot With Boundaries

Upgrades unlock when a decision contributes to a field and insight reaches the upgrade cost.

### Focus and pace quality

Focus is the first phone-away experiment:

- Focus accumulates over time while the player is away.
- High focus increases the pace-quality multiplier.
- Consecutive turns reduce the multiplier.
- There is no hard timer and no punishment for stopping.

This makes "take one more turn" tempting, but less efficient, matching the desired balance between
speed and quality decision-making.

## Tone

Approachable startup satire:

- grounded enough to teach real SaaS concepts
- silly enough to make failure feel funny instead of punishing
- light enough for quick mobile sessions
- fictional enough to avoid requiring real startup data or legal/financial advice

## Design principles

1. One turn should fit in a short queue or bus-stop moment.
2. Every mechanic should be legible from the UI.
3. Business/product learning should mostly happen through cause and effect.
4. Systems should be simple enough for AI-assisted iteration.
5. The game should remain fully playable offline.
