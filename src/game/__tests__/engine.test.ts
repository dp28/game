import { applyTurn, createInitialGameState, previewPace } from '../engine';

describe('game engine', () => {
  it('advances one historical year per turn', () => {
    const state = createInitialGameState(0);
    const result = applyTurn(state, 'sponsorGuildRoads', 0);

    expect(result.state.year).toBe(1454);
  });

  it('rewards time away with a stronger pace multiplier', () => {
    const state = createInitialGameState(0);
    const rested = previewPace(state, 90 * 60 * 1000);
    const rushed = previewPace({ ...state, deliberation: 0, consecutiveTurns: 3 }, 0);

    expect(rested.multiplier).toBeGreaterThan(rushed.multiplier);
  });

  it('can unlock technology when knowledge reaches the cost', () => {
    const state = {
      ...createInitialGameState(0),
      resources: {
        grain: 8,
        coin: 6,
        legitimacy: 7,
        knowledge: 5,
      },
    };
    const result = applyTurn(state, 'codifyLandRights', 0);

    expect(
      result.state.technologies.find((technology) => technology.id === 'surveying')?.unlocked,
    ).toBe(true);
  });
});
