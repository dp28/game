import { applyTurn, createInitialGameState, getAvailableDecisions, previewPace } from '../engine';

describe('game engine', () => {
  it('advances one startup week per turn', () => {
    const state = createInitialGameState(0);
    const result = applyTurn(state, 'shipLandingPage', 0);

    expect(result.state.week).toBe(2);
  });

  it('rewards time away with a stronger pace multiplier', () => {
    const state = createInitialGameState(0);
    const rested = previewPace(state, 90 * 60 * 1000);
    const rushed = previewPace({ ...state, deliberation: 0, consecutiveTurns: 3 }, 0);

    expect(rested.multiplier).toBeGreaterThan(rushed.multiplier);
  });

  it('can unlock upgrades when insight reaches the cost', () => {
    const state = {
      ...createInitialGameState(0),
      resources: {
        cash: 8,
        users: 3,
        morale: 7,
        insight: 5,
      },
    };
    const result = applyTurn(state, 'fixPapercuts', 0);

    expect(result.state.upgrades.find((upgrade) => upgrade.id === 'automation')?.unlocked).toBe(
      true,
    );
  });

  it('makes exit decisions available after the company reaches exit phase', () => {
    const state = createInitialGameState(0);
    const exitReadyState = {
      ...state,
      phase: 'exit' as const,
      resources: {
        cash: 16,
        users: 40,
        morale: 7,
        insight: 10,
      },
    };

    expect(getAvailableDecisions(exitReadyState).map((decision) => decision.id)).toEqual([
      'acceptAcquisitionOffer',
      'fileForIpo',
    ]);
  });

  it('can oust the CEO when board confidence collapses', () => {
    const state = {
      ...createInitialGameState(0),
      boardConfidence: 1,
      resources: {
        cash: 0,
        users: 1,
        morale: 0,
        insight: 2,
      },
      stakeholders: createInitialGameState(0).stakeholders.map((stakeholder) => ({
        ...stakeholder,
        mood: 0,
      })),
      areas: createInitialGameState(0).areas.map((area) => ({
        ...area,
        chaos: 10,
      })),
    };
    const result = applyTurn(state, 'shipLandingPage', 0);

    expect(result.state.phase).toBe('ousted');
    expect(result.state.exit.type).toBe('cancelled');
    expect(result.state.exit.finalScore).toBe(0);
  });

  it('withholds acquisition score until integration completes', () => {
    const exitReadyState = {
      ...createInitialGameState(0),
      phase: 'exit' as const,
      resources: {
        cash: 16,
        users: 40,
        morale: 8,
        insight: 10,
      },
    };
    const signed = applyTurn(exitReadyState, 'acceptAcquisitionOffer', 0).state;

    expect(signed.phase).toBe('postExit');
    expect(signed.exit.type).toBe('acquisition');
    expect(signed.exit.finalScore).toBeNull();

    const absorbed = Array.from({ length: 4 }).reduce(
      (company) => applyTurn(company, 'integrateRoadmap', 0).state,
      signed,
    );

    expect(absorbed.phase).toBe('complete');
    expect(absorbed.exit.finalScore).toBeGreaterThan(0);
  });

  it('scores an IPO only after one public-market year', () => {
    const postIpoState = {
      ...createInitialGameState(0),
      phase: 'postExit' as const,
      resources: {
        cash: 20,
        users: 45,
        morale: 7,
        insight: 12,
      },
      exit: {
        type: 'ipo' as const,
        weeksRemaining: 1,
        value: 160,
        finalScore: null,
        status: 'One week remains in the market test.',
      },
    };
    const result = applyTurn(postIpoState, 'reassurePublicMarkets', 0);

    expect(result.state.phase).toBe('complete');
    expect(result.state.exit.finalScore).toBeGreaterThan(160);
  });
});
