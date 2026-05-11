import {
  startingAreas,
  startingResources,
  startingStakeholders,
  startingUpgrades,
  weeklyDecisions,
} from './content';
import type {
  CompanyArea,
  Decision,
  DecisionId,
  GameState,
  ResourceKey,
  Resources,
  Stakeholder,
  TurnResult,
  Upgrade,
} from './types';

const MAX_DELIBERATION = 6;
const DELIBERATION_MS = 30 * 60 * 1000;

const resourceKeys: ResourceKey[] = ['cash', 'users', 'morale', 'insight'];

export function createInitialGameState(now = Date.now()): GameState {
  return {
    week: 1,
    resources: { ...startingResources },
    stakeholders: cloneStakeholders(startingStakeholders),
    areas: cloneAreas(startingAreas),
    upgrades: cloneUpgrades(startingUpgrades),
    decisions: [...weeklyDecisions],
    consecutiveTurns: 0,
    deliberation: 2,
    lastTurnEndedAt: now,
    lastLesson:
      'SaaS is a game of compounding tiny decisions, recurring revenue, and learning not to ship every idea your shower invents.',
    lastOutcome:
      'Your tiny SaaS has a landing page, a TODO list, and several feelings about product-market fit.',
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
  const nextUpgrades = applyResearch(state.upgrades, decision, nextResources);

  return {
    state: {
      ...state,
      week: state.week + 1,
      resources: nextResources,
      stakeholders: applyStakeholderEffects(state.stakeholders, decision),
      areas: applyAreaEffects(state.areas, decision),
      upgrades: nextUpgrades,
      consecutiveTurns: deliberation > state.deliberation ? 0 : state.consecutiveTurns + 1,
      deliberation: Math.max(0, deliberation - 1),
      lastTurnEndedAt: now,
      lastLesson: decision.lesson,
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

function applyStakeholderEffects(stakeholders: Stakeholder[], decision: Decision): Stakeholder[] {
  return stakeholders.map((stakeholder) => ({
    ...stakeholder,
    mood: clamp(stakeholder.mood + (decision.stakeholderEffects?.[stakeholder.id] ?? 0), 0, 10),
  }));
}

function applyAreaEffects(areas: CompanyArea[], decision: Decision): CompanyArea[] {
  return areas.map((area) => {
    const effects = decision.areaEffects?.[area.id];

    if (!effects) {
      return area;
    }

    return {
      ...area,
      traction: clamp(area.traction + (effects.traction ?? 0), 0, 10),
      polish: clamp(area.polish + (effects.polish ?? 0), 0, 10),
      chaos: clamp(area.chaos + (effects.chaos ?? 0), 0, 10),
    };
  });
}

function applyResearch(upgrades: Upgrade[], decision: Decision, resources: Resources): Upgrade[] {
  if (!decision.research) {
    return upgrades;
  }

  return upgrades.map((upgrade) => {
    if (upgrade.id !== decision.research || upgrade.unlocked) {
      return upgrade;
    }

    return {
      ...upgrade,
      unlocked: resources.insight >= upgrade.cost,
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
    cash: 0,
    users: 0,
    morale: 0,
    insight: 0,
  };
}

function cloneStakeholders(stakeholders: Stakeholder[]): Stakeholder[] {
  return stakeholders.map((stakeholder) => ({ ...stakeholder }));
}

function cloneAreas(areas: CompanyArea[]): CompanyArea[] {
  return areas.map((area) => ({ ...area }));
}

function cloneUpgrades(upgrades: Upgrade[]): Upgrade[] {
  return upgrades.map((upgrade) => ({ ...upgrade }));
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
