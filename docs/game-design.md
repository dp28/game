# Game design: Runway Ramen

## Working pitch

Runway Ramen is a short-burst, single-player strategy game about starting and growing a tiny SaaS
company. Each turn is one week. The player chooses one company-building bet, watches the company
change, and can either continue immediately at reduced decision quality or come back later with more
focus.

The full arc runs from founding to exit. Exit is not the end screen: after an acquisition, the game
continues until the company is fully absorbed by the buyer or the integration is cancelled. After an
IPO, the game continues for one public-market year before the stock-price score is locked.

The setting is slightly tongue-in-cheek: founder dashboards, tiny growth wins, nervous investors,
support queues, pricing experiments, morale rituals, and the occasional spreadsheet that develops
opinions. Mechanics and lessons can teach real SaaS concepts such as activation, retention, pricing,
support load, product quality, and runway.

## Why this concept fits the interview

- **Turn-based strategy:** one strategic bet per weekly sprint.
- **Technology advancement:** insight unlocks SaaS upgrades.
- **Politics:** stakeholders react differently to decisions.
- **CEO risk:** the board can oust the player if confidence collapses.
- **Exit arc:** acquisition and IPO paths have post-exit consequences before scoring.
- **Short sessions:** a turn can be completed in roughly 30-90 seconds.
- **No servers:** all state transitions are local and deterministic.
- **Minimal assets:** the game can work with dashboards, cards, simple diagrams, and generated icons.
- **Learning:** SaaS/product lessons appear as consequences rather than quizzes.
- **Phone-away incentive:** focus accumulates while away and improves outcomes.

## Core loop

1. Read the current founder dashboard.
2. Choose one weekly bet.
3. The engine updates resources, stakeholder moods, company-area traction/polish/chaos, and upgrades.
4. The board updates confidence based on runway, morale, stakeholder mood, chaos, and traction.
5. The company may advance to a new phase or enter/resolve an exit route.
6. The game shows a concise product/business lesson and outcome.
7. The player can continue now at a lower pace-quality multiplier or stop and regain focus.

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

### Company phases

- **Founding:** prove there is a product worth discussing in a meeting.
- **Validation:** turn early interest into repeatable learning.
- **Growth:** hire, price, sell, and discover that every graph has a downside.
- **Scale:** make the company operationally boring enough to become valuable.
- **Exit:** choose an acquisition or IPO route once the company is ready.
- **Post-exit:** keep playing until acquisition absorption/cancellation or one public-market year.
- **Complete:** score is finally available.
- **Ousted:** the board removes the CEO; this is a terminal failure state.

### Board confidence

The player is the CEO. Board confidence starts healthy but changes every turn. It can rise through
credible traction, solid morale, low chaos, and stakeholder trust. It can fall through poor runway,
low morale, angry stakeholders, runaway chaos, and questionable strategic bets.

If board confidence reaches zero, the CEO is ousted and the company story ends as a cancelled exit.

### Exit and scoring

Scores are intentionally delayed:

- **Acquisition:** accepting an offer starts an integration period. Score is withheld until the
  company is fully absorbed. If confidence or morale collapses during integration, the deal can be
  cancelled and the final score is much lower.
- **IPO:** filing starts a one-year public-market test. Score is withheld until 52 weekly turns after
  IPO, representing the stock price after one year of operating in public.

This keeps late-stage choices meaningful and avoids treating exit as a simple victory button.

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
