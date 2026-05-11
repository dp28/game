import type { CompanyArea, Decision, Resources, Stakeholder, Upgrade } from './types';

export const startingResources: Resources = {
  cash: 8,
  users: 3,
  morale: 7,
  insight: 2,
};

export const startingStakeholders: Stakeholder[] = [
  { id: 'customers', name: 'Customers', influence: 7, mood: 5 },
  { id: 'engineers', name: 'Engineers', influence: 6, mood: 6 },
  { id: 'investors', name: 'Investors', influence: 5, mood: 5 },
  { id: 'sales', name: 'Sales Team', influence: 4, mood: 5 },
];

export const startingAreas: CompanyArea[] = [
  { id: 'product', name: 'Product', traction: 4, polish: 3, chaos: 5 },
  { id: 'growth', name: 'Growth', traction: 3, polish: 2, chaos: 4 },
  { id: 'ops', name: 'Ops', traction: 2, polish: 4, chaos: 3 },
];

export const startingUpgrades: Upgrade[] = [
  {
    id: 'analytics',
    name: 'Actually Useful Analytics',
    stage: 'idea',
    cost: 4,
    lesson:
      'Good analytics answer product questions; vanity dashboards mostly make the founder feel briefly taller.',
    unlocked: false,
  },
  {
    id: 'billing',
    name: 'Billing That Mostly Works',
    stage: 'early-saas',
    cost: 7,
    lesson:
      'SaaS revenue depends on retention and reliable billing, not just a triumphant launch tweet.',
    unlocked: false,
  },
  {
    id: 'automation',
    name: 'Support Bot With Boundaries',
    stage: 'scaling',
    cost: 6,
    lesson:
      'Automation helps when the process is understood; automating confusion just scales confusion.',
    unlocked: false,
  },
];

export const weeklyDecisions: Decision[] = [
  {
    id: 'shipLandingPage',
    title: 'Ship a Sharper Landing Page',
    description:
      'Rewrite the promise, add social proof, and pretend the hero section was strategy.',
    lesson:
      'Clear positioning improves conversion because buyers need to recognize their problem before they admire your roadmap.',
    effects: { cash: -1, users: 2, morale: 1 },
    stakeholderEffects: { customers: 1, sales: 2, engineers: -1 },
    areaEffects: {
      growth: { traction: 1, polish: 1 },
      product: { chaos: 1 },
    },
  },
  {
    id: 'fixPapercuts',
    title: 'Fix the Papercuts',
    description:
      'Spend the sprint on tiny annoyances users keep mentioning in suspiciously polite emails.',
    lesson:
      'Retention often improves through accumulated usability fixes, not one heroic feature with a launch video.',
    effects: { cash: -1, users: 1, morale: 1, insight: 1 },
    stakeholderEffects: { customers: 2, engineers: 1, investors: -1 },
    areaEffects: {
      product: { polish: 2, chaos: -1 },
      ops: { chaos: -1 },
    },
    research: 'automation',
  },
  {
    id: 'runPricingTest',
    title: 'Run a Pricing Test',
    description:
      'Move one checkbox, rename a tier, and brace for the spreadsheet to develop opinions.',
    lesson:
      'Pricing tests reveal willingness to pay, but only if you watch activation, churn risk, and support load too.',
    effects: { cash: 2, users: -1, insight: 2 },
    stakeholderEffects: { investors: 2, customers: -1, sales: 1 },
    areaEffects: {
      growth: { traction: 1, chaos: 1 },
      ops: { chaos: 1 },
    },
    research: 'billing',
  },
  {
    id: 'hostAllHands',
    title: 'Host an All-Hands Without a Decknado',
    description:
      'Align the team, explain the bet, and use only one graph shaped like a hockey stick.',
    lesson:
      'Teams move faster when tradeoffs are explicit; morale slogans cannot replace a clear operating cadence.',
    effects: { morale: 2, cash: -1, insight: 1 },
    stakeholderEffects: { engineers: 2, sales: 1, investors: 1 },
    areaEffects: {
      product: { chaos: -1 },
      growth: { chaos: -1 },
      ops: { polish: 1, chaos: -1 },
    },
    research: 'analytics',
  },
];
