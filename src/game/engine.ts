import {
  startingAreas,
  startingResources,
  startingStakeholders,
  startingUpgrades,
  weeklyDecisions,
} from './content';
import type {
  CompanyPhase,
  CompanyArea,
  Decision,
  DecisionId,
  ExitState,
  GameState,
  ResourceKey,
  Resources,
  Stakeholder,
  TurnResult,
  Upgrade,
} from './types';

const MAX_DELIBERATION = 6;
const DELIBERATION_MS = 30 * 60 * 1000;
const ACQUISITION_INTEGRATION_WEEKS = 4;
const IPO_MARKET_TEST_WEEKS = 52;

const resourceKeys: ResourceKey[] = ['cash', 'users', 'morale', 'insight'];

export function createInitialGameState(now = Date.now()): GameState {
  return {
    week: 1,
    phase: 'founding',
    boardConfidence: 6,
    exit: createOpenExitState(),
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

export function getAvailableDecisions(state: GameState): Decision[] {
  if (state.phase === 'complete' || state.phase === 'ousted') {
    return [];
  }

  return state.decisions.filter((decision) => decision.availableIn.includes(state.phase));
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
  if (state.phase === 'complete' || state.phase === 'ousted') {
    return {
      state,
      appliedEffects: emptyResources(),
      paceMultiplier: 0,
      deliberationGained: 0,
    };
  }

  const decision = getDecision(state, decisionId);
  if (!decision.availableIn.includes(state.phase)) {
    throw new Error(`Decision ${decisionId} is not available during ${state.phase}`);
  }

  const deliberation = calculateDeliberation(state, now);
  const paceMultiplier = calculatePaceMultiplier(state.consecutiveTurns, deliberation);
  const appliedEffects = scaleEffects(decision.effects, paceMultiplier);

  const nextResources = clampResources(applyResourceEffects(state.resources, appliedEffects));
  const nextStakeholders = applyStakeholderEffects(state.stakeholders, decision);
  const nextAreas = applyAreaEffects(state.areas, decision);
  const nextUpgrades = applyResearch(state.upgrades, decision, nextResources);
  const nextBoardConfidence = calculateBoardConfidence(
    state.boardConfidence,
    decision,
    nextResources,
    nextStakeholders,
    nextAreas,
  );
  const exitAfterDecision = applyExitAction(state.exit, decision, nextResources, nextAreas);
  const provisionalState: GameState = {
    ...state,
    week: state.week + 1,
    resources: nextResources,
    stakeholders: nextStakeholders,
    areas: nextAreas,
    upgrades: nextUpgrades,
    boardConfidence: nextBoardConfidence,
    exit: exitAfterDecision,
    consecutiveTurns: deliberation > state.deliberation ? 0 : state.consecutiveTurns + 1,
    deliberation: Math.max(0, deliberation - 1),
    lastTurnEndedAt: now,
    lastLesson: decision.lesson,
    lastOutcome: describeOutcome(decision, appliedEffects, paceMultiplier),
  };
  const nextState = advanceLifecycle(provisionalState);

  return {
    state: nextState,
    appliedEffects,
    paceMultiplier,
    deliberationGained: Math.max(0, deliberation - state.deliberation),
  };
}

function calculateBoardConfidence(
  previousConfidence: number,
  decision: Decision,
  resources: Resources,
  stakeholders: Stakeholder[],
  areas: CompanyArea[],
): number {
  const averageMood =
    stakeholders.reduce((total, stakeholder) => total + stakeholder.mood, 0) / stakeholders.length;
  const averageChaos = areas.reduce((total, area) => total + area.chaos, 0) / areas.length;
  const runwaySignal =
    resources.cash <= 1 ? -3 : resources.cash <= 3 ? -1 : resources.cash >= 12 ? 1 : 0;
  const moraleSignal =
    resources.morale <= 1 ? -2 : resources.morale <= 3 ? -1 : resources.morale >= 8 ? 1 : 0;
  const stakeholderSignal = averageMood <= 3 ? -2 : averageMood >= 7 ? 1 : 0;
  const chaosSignal = averageChaos >= 8 ? -2 : averageChaos <= 3 ? 1 : 0;
  const tractionSignal = resources.users >= 25 ? 1 : resources.users <= 1 ? -1 : 0;

  return clamp(
    previousConfidence +
      (decision.boardEffect ?? 0) +
      runwaySignal +
      moraleSignal +
      stakeholderSignal +
      chaosSignal +
      tractionSignal,
    0,
    10,
  );
}

function applyExitAction(
  exit: ExitState,
  decision: Decision,
  resources: Resources,
  areas: CompanyArea[],
): ExitState {
  if (decision.exitAction === 'acceptAcquisition') {
    return {
      type: 'acquisition',
      weeksRemaining: ACQUISITION_INTEGRATION_WEEKS,
      value: calculateCompanyValue(resources, areas),
      finalScore: null,
      status: 'Acquisition signed. Integration still has to survive the calendar invites.',
    };
  }

  if (decision.exitAction === 'fileForIpo') {
    return {
      type: 'ipo',
      weeksRemaining: IPO_MARKET_TEST_WEEKS,
      value: calculateCompanyValue(resources, areas),
      finalScore: null,
      status: 'IPO filed. The score waits until the market has judged a full public year.',
    };
  }

  return exit;
}

function advanceLifecycle(state: GameState): GameState {
  const oustedState = maybeOustCeo(state);
  if (oustedState.phase === 'ousted') {
    return oustedState;
  }

  if (state.phase === 'postExit') {
    return advancePostExit(state);
  }

  if (state.phase === 'exit' && state.exit.type !== 'none') {
    return {
      ...state,
      phase: 'postExit',
      lastOutcome: `${state.lastOutcome} Exit accepted; now survive the part everyone underestimated.`,
    };
  }

  if (state.phase === 'exit') {
    return state;
  }

  const nextPhase = calculateOperatingPhase(state);
  if (nextPhase === state.phase) {
    return state;
  }

  return {
    ...state,
    phase: nextPhase,
    lastOutcome: `${state.lastOutcome} Phase advanced to ${formatPhase(nextPhase)}.`,
  };
}

function maybeOustCeo(state: GameState): GameState {
  if (state.boardConfidence > 0) {
    return state;
  }

  return {
    ...state,
    phase: 'ousted',
    exit: {
      type: 'cancelled',
      weeksRemaining: 0,
      value: 0,
      finalScore: 0,
      status:
        'The board cancelled the CEO era and installed someone with a quieter LinkedIn profile.',
    },
    lastOutcome: `${state.lastOutcome} The board ousted you before the exit story could finish.`,
  };
}

function advancePostExit(state: GameState): GameState {
  if (
    state.exit.type === 'acquisition' &&
    (state.boardConfidence <= 2 || state.resources.morale <= 1)
  ) {
    return {
      ...state,
      phase: 'complete',
      exit: {
        type: 'cancelled',
        weeksRemaining: 0,
        value: state.exit.value,
        finalScore: Math.max(10, Math.round(state.exit.value * 0.35)),
        status: 'Integration was cancelled. The slide deck called it a portfolio simplification.',
      },
      lastOutcome: `${state.lastOutcome} Integration collapsed before the company was fully absorbed.`,
    };
  }

  const weeksRemaining = Math.max(0, state.exit.weeksRemaining - 1);
  if (weeksRemaining > 0) {
    return {
      ...state,
      exit: {
        ...state.exit,
        weeksRemaining,
        status: describeExitStatus(state.exit.type, weeksRemaining),
      },
    };
  }

  const finalScore = calculateFinalScore(state);
  return {
    ...state,
    phase: 'complete',
    exit: {
      ...state.exit,
      weeksRemaining: 0,
      finalScore,
      status: describeCompletedExit(state.exit.type, finalScore),
    },
    lastOutcome: `${state.lastOutcome} Final score unlocked: ${finalScore}.`,
  };
}

function calculateOperatingPhase(state: GameState): CompanyPhase {
  const unlockedUpgrades = state.upgrades.filter((upgrade) => upgrade.unlocked).length;

  if (state.resources.users >= 36 && state.resources.cash >= 12 && unlockedUpgrades >= 2) {
    return 'exit';
  }

  if (state.resources.users >= 24 && state.resources.cash >= 8 && unlockedUpgrades >= 1) {
    return 'scale';
  }

  if (state.resources.users >= 14 && state.resources.insight >= 5) {
    return 'growth';
  }

  if (state.resources.users >= 7 || state.week >= 6) {
    return 'validation';
  }

  return 'founding';
}

function calculateCompanyValue(resources: Resources, areas: CompanyArea[]): number {
  const averageTraction = areas.reduce((total, area) => total + area.traction, 0) / areas.length;
  const averagePolish = areas.reduce((total, area) => total + area.polish, 0) / areas.length;
  const averageChaos = areas.reduce((total, area) => total + area.chaos, 0) / areas.length;

  return Math.max(
    1,
    Math.round(
      resources.cash * 4 +
        resources.users * 3 +
        resources.insight * 2 +
        resources.morale * 2 +
        averageTraction * 5 +
        averagePolish * 3 -
        averageChaos * 4,
    ),
  );
}

function calculateFinalScore(state: GameState): number {
  const value = calculateCompanyValue(state.resources, state.areas);
  const boardBonus = state.boardConfidence * 5;
  const exitMultiplier = state.exit.type === 'ipo' ? 1.25 : 1;

  return Math.round((state.exit.value + value + boardBonus) * exitMultiplier);
}

function describeExitStatus(type: ExitState['type'], weeksRemaining: number): string {
  if (type === 'acquisition') {
    return `${weeksRemaining} integration week${weeksRemaining === 1 ? '' : 's'} until absorption is complete.`;
  }

  if (type === 'ipo') {
    return `${weeksRemaining} public-market week${weeksRemaining === 1 ? '' : 's'} until the one-year stock-price score.`;
  }

  return 'No exit is in progress.';
}

function describeCompletedExit(type: ExitState['type'], finalScore: number): string {
  if (type === 'acquisition') {
    return `Fully absorbed by the buyer. Final acquisition score: ${finalScore}.`;
  }

  if (type === 'ipo') {
    return `One public-market year complete. Final stock-price score: ${finalScore}.`;
  }

  return `Company story complete. Final score: ${finalScore}.`;
}

function formatPhase(phase: CompanyPhase): string {
  return phase.replace(/([A-Z])/g, ' $1').replace(/^./, (character) => character.toUpperCase());
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

function createOpenExitState(): ExitState {
  return {
    type: 'none',
    weeksRemaining: 0,
    value: 0,
    finalScore: null,
    status: 'No exit yet. The cap table is still mostly hope and spreadsheet formatting.',
  };
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
