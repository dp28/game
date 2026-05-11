export type ResourceKey = 'grain' | 'coin' | 'legitimacy' | 'knowledge';

export type Resources = Record<ResourceKey, number>;

export type FactionId = 'guilds' | 'nobles' | 'clergy' | 'commons';

export type ProvinceId = 'capital' | 'riverlands' | 'hillmarch';

export type TechId = 'charters' | 'printing' | 'surveying';

export type DecisionId =
  | 'sponsorGuildRoads'
  | 'codifyLandRights'
  | 'inviteScholars'
  | 'mediateFactionDispute';

export interface Faction {
  id: FactionId;
  name: string;
  influence: number;
  mood: number;
}

export interface Province {
  id: ProvinceId;
  name: string;
  control: number;
  development: number;
  unrest: number;
}

export interface Technology {
  id: TechId;
  name: string;
  era: 'medieval' | 'renaissance' | 'early-modern';
  cost: number;
  fact: string;
  unlocked: boolean;
}

export interface Decision {
  id: DecisionId;
  title: string;
  description: string;
  historicalNote: string;
  effects: Partial<Resources>;
  factionEffects?: Partial<Record<FactionId, number>>;
  provinceEffects?: Partial<
    Record<ProvinceId, Partial<Pick<Province, 'control' | 'development' | 'unrest'>>>
  >;
  research?: TechId;
}

export interface GameState {
  year: number;
  resources: Resources;
  factions: Faction[];
  provinces: Province[];
  technologies: Technology[];
  decisions: Decision[];
  consecutiveTurns: number;
  deliberation: number;
  lastTurnEndedAt: number;
  lastFact: string;
  lastOutcome: string;
}

export interface TurnResult {
  state: GameState;
  appliedEffects: Resources;
  paceMultiplier: number;
  deliberationGained: number;
}
