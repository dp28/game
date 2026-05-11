export type ResourceKey = 'cash' | 'users' | 'morale' | 'insight';

export type Resources = Record<ResourceKey, number>;

export type StakeholderId = 'customers' | 'engineers' | 'investors' | 'sales';

export type AreaId = 'product' | 'growth' | 'ops';

export type UpgradeId = 'analytics' | 'billing' | 'automation';

export type CompanyPhase =
  | 'founding'
  | 'validation'
  | 'growth'
  | 'scale'
  | 'exit'
  | 'postExit'
  | 'complete'
  | 'ousted';

export type ExitType = 'none' | 'acquisition' | 'ipo' | 'cancelled';

export type ExitAction = 'acceptAcquisition' | 'fileForIpo';

export type DecisionId =
  | 'shipLandingPage'
  | 'fixPapercuts'
  | 'runPricingTest'
  | 'hostAllHands'
  | 'hireFirstTeam'
  | 'enterprisePilot'
  | 'acceptAcquisitionOffer'
  | 'fileForIpo'
  | 'integrateRoadmap'
  | 'reassurePublicMarkets';

export interface Stakeholder {
  id: StakeholderId;
  name: string;
  influence: number;
  mood: number;
}

export interface CompanyArea {
  id: AreaId;
  name: string;
  traction: number;
  polish: number;
  chaos: number;
}

export interface Upgrade {
  id: UpgradeId;
  name: string;
  stage: 'idea' | 'early-saas' | 'scaling';
  cost: number;
  lesson: string;
  unlocked: boolean;
}

export interface Decision {
  id: DecisionId;
  title: string;
  description: string;
  lesson: string;
  availableIn: CompanyPhase[];
  effects: Partial<Resources>;
  boardEffect?: number;
  stakeholderEffects?: Partial<Record<StakeholderId, number>>;
  areaEffects?: Partial<
    Record<AreaId, Partial<Pick<CompanyArea, 'traction' | 'polish' | 'chaos'>>>
  >;
  research?: UpgradeId;
  exitAction?: ExitAction;
}

export interface ExitState {
  type: ExitType;
  weeksRemaining: number;
  value: number;
  finalScore: number | null;
  status: string;
}

export interface GameState {
  week: number;
  phase: CompanyPhase;
  boardConfidence: number;
  exit: ExitState;
  resources: Resources;
  stakeholders: Stakeholder[];
  areas: CompanyArea[];
  upgrades: Upgrade[];
  decisions: Decision[];
  consecutiveTurns: number;
  deliberation: number;
  lastTurnEndedAt: number;
  lastLesson: string;
  lastOutcome: string;
}

export interface TurnResult {
  state: GameState;
  appliedEffects: Resources;
  paceMultiplier: number;
  deliberationGained: number;
}
