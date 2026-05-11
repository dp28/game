import { applyTurn, createInitialGameState, previewPace } from '../engine';

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
});
