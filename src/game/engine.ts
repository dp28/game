import {
  startingFactions,
  startingProvinces,
  startingResources,
  startingTechnologies,
  yearlyDecisions,
} from './content';
import type {
  Decision,
  DecisionId,
  Faction,
  GameState,
  Province,
  ResourceKey,
  Resources,
  Technology,
  TurnResult,
} from './types';

const MAX_DELIBERATION = 6;
const DELIBERATION_MS = 30 * 60 * 1000;

const resourceKeys: ResourceKey[] = ['grain', 'coin', 'legitimacy', 'knowledge'];

export function createInitialGameState(now = Date.now()): GameState {
  return {
    year: 1453,
    resources: { ...startingResources },
    factions: cloneFactions(startingFactions),
    provinces: cloneProvinces(startingProvinces),
    technologies: cloneTechnologies(startingTechnologies),
    decisions: [...yearlyDecisions],
    consecutiveTurns: 0,
    deliberation: 2,
    lastTurnEndedAt: now,
    lastFact:
      'The year 1453 is a useful early-modern hinge: Constantinople fell, and printing was spreading in Europe.',
    lastOutcome: 'Your realm is small, divided, and ready to be shaped one year at a time.',
  };
}

export function getDecision(state: GameState, decisionId: DecisionId): Decision {
  const decision = state.decisions.find((candidate) => candidate.id === decisionId);

  if (!decision) {
    throw new Error(`Unknown decision: ${decisionId}`);
  }

  return decision;
}

export function previewPace(
  state: GameState,
  now = Date.now(),
): {
  deliberation: number;
  multiplier: number;
  turnsUntilMinimumRewards: number;
} {
  const deliberation = calculateDeliberation(state, now);
  const multiplier = calculatePaceMultiplier(state.consecutiveTurns, deliberation);

  return {
    deliberation,
    multiplier,
    turnsUntilMinimumRewards: Math.max(0, 4 - state.consecutiveTurns),
  };
}

export function applyTurn(state: GameState, decisionId: DecisionId, now = Date.now()): TurnResult {
  const decision = getDecision(state, decisionId);
  const deliberation = calculateDeliberation(state, now);
  const paceMultiplier = calculatePaceMultiplier(state.consecutiveTurns, deliberation);
  const appliedEffects = scaleEffects(decision.effects, paceMultiplier);

  const nextResources = clampResources(applyResourceEffects(state.resources, appliedEffects));
  const nextTechnologies = applyResearch(state.technologies, decision, nextResources);

  return {
    state: {
      ...state,
      year: state.year + 1,
      resources: nextResources,
      factions: applyFactionEffects(state.factions, decision),
      provinces: applyProvinceEffects(state.provinces, decision),
      technologies: nextTechnologies,
      consecutiveTurns: deliberation > state.deliberation ? 0 : state.consecutiveTurns + 1,
      deliberation: Math.max(0, deliberation - 1),
      lastTurnEndedAt: now,
      lastFact: decision.historicalNote,
      lastOutcome: describeOutcome(decision, appliedEffects, paceMultiplier),
    },
    appliedEffects,
    paceMultiplier,
    deliberationGained: Math.max(0, deliberation - state.deliberation),
  };
}

function calculateDeliberation(state: GameState, now: number): number {
  const elapsed = Math.max(0, now - state.lastTurnEndedAt);
  const gained = Math.floor(elapsed / DELIBERATION_MS);

  return Math.min(MAX_DELIBERATION, state.deliberation + gained);
}

function calculatePaceMultiplier(consecutiveTurns: number, deliberation: number): number {
  const reflectionBonus = deliberation >= 3 ? 1.25 : deliberation >= 1 ? 1 : 0.85;
  const fatiguePenalty = Math.max(0.55, 1 - consecutiveTurns * 0.12);

  return roundToTwoDecimals(reflectionBonus * fatiguePenalty);
}

function scaleEffects(effects: Partial<Resources>, multiplier: number): Resources {
  return resourceKeys.reduce(
    (scaled, key) => ({
      ...scaled,
      [key]: Math.round((effects[key] ?? 0) * multiplier),
    }),
    emptyResources(),
  );
}

function applyResourceEffects(resources: Resources, effects: Resources): Resources {
  return resourceKeys.reduce(
    (nextResources, key) => ({
      ...nextResources,
      [key]: resources[key] + effects[key],
    }),
    emptyResources(),
  );
}

function applyFactionEffects(factions: Faction[], decision: Decision): Faction[] {
  return factions.map((faction) => ({
    ...faction,
    mood: clamp(faction.mood + (decision.factionEffects?.[faction.id] ?? 0), 0, 10),
  }));
}

function applyProvinceEffects(provinces: Province[], decision: Decision): Province[] {
  return provinces.map((province) => {
    const effects = decision.provinceEffects?.[province.id];

    if (!effects) {
      return province;
    }

    return {
      ...province,
      control: clamp(province.control + (effects.control ?? 0), 0, 10),
      development: clamp(province.development + (effects.development ?? 0), 0, 10),
      unrest: clamp(province.unrest + (effects.unrest ?? 0), 0, 10),
    };
  });
}

function applyResearch(
  technologies: Technology[],
  decision: Decision,
  resources: Resources,
): Technology[] {
  if (!decision.research) {
    return technologies;
  }

  return technologies.map((technology) => {
    if (technology.id !== decision.research || technology.unlocked) {
      return technology;
    }

    return {
      ...technology,
      unlocked: resources.knowledge >= technology.cost,
    };
  });
}

function describeOutcome(decision: Decision, effects: Resources, paceMultiplier: number): string {
  const positiveEffects = resourceKeys
    .filter((key) => effects[key] > 0)
    .map((key) => `+${effects[key]} ${key}`);
  const negativeEffects = resourceKeys
    .filter((key) => effects[key] < 0)
    .map((key) => `${effects[key]} ${key}`);
  const summary =
    [...positiveEffects, ...negativeEffects].join(', ') || 'no immediate resource swing';

  return `${decision.title}: ${summary}. Pace quality x${paceMultiplier}.`;
}

function clampResources(resources: Resources): Resources {
  return resourceKeys.reduce(
    (nextResources, key) => ({
      ...nextResources,
      [key]: clamp(resources[key], 0, 99),
    }),
    emptyResources(),
  );
}

function emptyResources(): Resources {
  return {
    grain: 0,
    coin: 0,
    legitimacy: 0,
    knowledge: 0,
  };
}

function cloneFactions(factions: Faction[]): Faction[] {
  return factions.map((faction) => ({ ...faction }));
}

function cloneProvinces(provinces: Province[]): Province[] {
  return provinces.map((province) => ({ ...province }));
}

function cloneTechnologies(technologies: Technology[]): Technology[] {
  return technologies.map((technology) => ({ ...technology }));
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
