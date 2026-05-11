import type { Decision, Faction, Province, Resources, Technology } from './types';

export const startingResources: Resources = {
  grain: 8,
  coin: 6,
  legitimacy: 7,
  knowledge: 2,
};

export const startingFactions: Faction[] = [
  { id: 'guilds', name: 'Merchant Guilds', influence: 6, mood: 5 },
  { id: 'nobles', name: 'Landed Nobles', influence: 7, mood: 5 },
  { id: 'clergy', name: 'Cathedral Chapter', influence: 5, mood: 6 },
  { id: 'commons', name: 'Town Commons', influence: 4, mood: 5 },
];

export const startingProvinces: Province[] = [
  { id: 'capital', name: 'The Seat', control: 8, development: 6, unrest: 2 },
  { id: 'riverlands', name: 'Riverlands', control: 5, development: 4, unrest: 3 },
  { id: 'hillmarch', name: 'Hill March', control: 3, development: 2, unrest: 4 },
];

export const startingTechnologies: Technology[] = [
  {
    id: 'charters',
    name: 'Town Charters',
    era: 'medieval',
    cost: 4,
    fact: 'Medieval charters often traded local privileges for taxes, soldiers, or political loyalty.',
    unlocked: false,
  },
  {
    id: 'printing',
    name: 'Printing Networks',
    era: 'renaissance',
    cost: 7,
    fact: 'Printing helped governments standardize law, circulate decrees, and spread religious and political arguments.',
    unlocked: false,
  },
  {
    id: 'surveying',
    name: 'Cadastral Surveys',
    era: 'early-modern',
    cost: 6,
    fact: 'Early modern rulers used land surveys to tax more consistently and make local power visible to the center.',
    unlocked: false,
  },
];

export const yearlyDecisions: Decision[] = [
  {
    id: 'sponsorGuildRoads',
    title: 'Sponsor Guild Roads',
    description: 'Fund merchants to improve roads between towns and market fairs.',
    historicalNote:
      'Road privileges and tolls made trade policy a political bargain, not just an engineering project.',
    effects: { coin: -2, grain: 1, legitimacy: 1 },
    factionEffects: { guilds: 2, nobles: -1 },
    provinceEffects: {
      riverlands: { development: 1, control: 1 },
      hillmarch: { development: 1 },
    },
  },
  {
    id: 'codifyLandRights',
    title: 'Codify Land Rights',
    description: 'Write customary rights into law to reduce noble disputes and improve taxation.',
    historicalNote:
      'As states formed, written law often turned local custom into central authority.',
    effects: { coin: 1, legitimacy: -1, knowledge: 1 },
    factionEffects: { nobles: -2, commons: 1 },
    provinceEffects: {
      capital: { control: 1 },
      hillmarch: { unrest: -1 },
    },
    research: 'surveying',
  },
  {
    id: 'inviteScholars',
    title: 'Invite Scholars',
    description: 'Sponsor scholars, translators, and printers to expand administrative knowledge.',
    historicalNote:
      'Renaissance courts used scholars as diplomats, propagandists, engineers, and administrators.',
    effects: { coin: -1, legitimacy: 1, knowledge: 2 },
    factionEffects: { clergy: 1, guilds: 1 },
    research: 'printing',
  },
  {
    id: 'mediateFactionDispute',
    title: 'Mediate Faction Dispute',
    description: 'Spend political capital to keep competing estates in the same room.',
    historicalNote:
      'Representative estates could help rulers tax and govern, but only when factions accepted the bargain.',
    effects: { legitimacy: 1, grain: -1 },
    factionEffects: { guilds: 1, nobles: 1, clergy: 1, commons: 1 },
    provinceEffects: {
      capital: { unrest: -1 },
      riverlands: { unrest: -1 },
      hillmarch: { unrest: -1 },
    },
    research: 'charters',
  },
];
