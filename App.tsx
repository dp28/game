import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  applyTurn,
  createInitialGameState,
  getAvailableDecisions,
  getDecision,
  previewPace,
} from './src/game/engine';
import type { CompanyArea, DecisionId, GameState, ResourceKey } from './src/game/types';

const resourceLabels: Record<ResourceKey, string> = {
  cash: 'Cash',
  users: 'Users',
  morale: 'Morale',
  insight: 'Insight',
};

export default function App() {
  const [state, setState] = useState<GameState>(() => createInitialGameState());
  const [selectedDecisionId, setSelectedDecisionId] = useState<DecisionId>('shipLandingPage');
  const { width } = useWindowDimensions();
  const availableDecisions = useMemo(() => getAvailableDecisions(state), [state]);
  const effectiveDecisionId = availableDecisions.some(
    (decision) => decision.id === selectedDecisionId,
  )
    ? selectedDecisionId
    : availableDecisions[0]?.id;
  const selectedDecision = effectiveDecisionId ? getDecision(state, effectiveDecisionId) : null;
  const pace = useMemo(() => previewPace(state), [state]);

  function advanceWeek() {
    if (!effectiveDecisionId) {
      return;
    }

    const result = applyTurn(state, effectiveDecisionId);
    setState(result.state);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Runway Ramen</Text>
          <Text style={styles.title}>Tiny SaaS Co., Week {state.week}</Text>
          <Text style={styles.subtitle}>
            One turn is one week. Waiting restores focus; rushing several sprints lowers decision
            quality without blocking play.
          </Text>
          <View style={styles.paceRow}>
            <Text style={styles.paceText}>Phase: {formatPhase(state.phase)}</Text>
            <Text style={styles.paceText}>Board confidence: {state.boardConfidence}/10</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Founder Dashboard</Text>
          <View style={styles.resourceGrid}>
            {(Object.keys(resourceLabels) as ResourceKey[]).map((key) => (
              <View key={key} style={styles.resourcePill}>
                <Text style={styles.resourceLabel}>{resourceLabels[key]}</Text>
                <Text style={styles.resourceValue}>{state.resources[key]}</Text>
              </View>
            ))}
          </View>
          <View style={styles.paceRow}>
            <Text style={styles.paceText}>Focus: {pace.deliberation}/6</Text>
            <Text style={styles.paceText}>Pace quality: x{pace.multiplier}</Text>
            <Text style={styles.paceText}>
              Score: {state.exit.finalScore === null ? 'pending' : state.exit.finalScore}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Exit Watch</Text>
          <Text style={styles.bodyText}>Route: {formatPhase(state.exit.type)}</Text>
          <Text style={styles.bodyText}>{state.exit.status}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Company Map</Text>
          <View style={[styles.map, { minHeight: Math.max(180, width * 0.5) }]}>
            {state.areas.map((area, index) => (
              <AreaTile key={area.id} area={area} index={index} />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Choose this week's bet</Text>
          {availableDecisions.map((decision) => {
            const isSelected = decision.id === effectiveDecisionId;

            return (
              <Pressable
                key={decision.id}
                accessibilityRole="button"
                onPress={() => setSelectedDecisionId(decision.id)}
                style={[styles.decisionButton, isSelected && styles.decisionButtonSelected]}
              >
                <Text style={[styles.decisionTitle, isSelected && styles.decisionTitleSelected]}>
                  {decision.title}
                </Text>
                <Text style={styles.decisionDescription}>{decision.description}</Text>
              </Pressable>
            );
          })}
          {availableDecisions.length === 0 ? (
            <Text style={styles.bodyText}>
              This company story is complete. The score is no longer pending.
            </Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            disabled={!selectedDecision}
            onPress={advanceWeek}
            style={[styles.primaryButton, !selectedDecision && styles.primaryButtonDisabled]}
          >
            <Text style={styles.primaryButtonText}>
              {state.phase === 'postExit' ? 'Resolve Exit Week' : `Ship Week ${state.week + 1}`}
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Last outcome</Text>
          <Text style={styles.bodyText}>{state.lastOutcome}</Text>
          <Text style={styles.factText}>{state.lastLesson}</Text>
          {selectedDecision ? (
            <>
              <Text style={styles.smallHeading}>Selected lesson</Text>
              <Text style={styles.bodyText}>{selectedDecision.lesson}</Text>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatPhase(value: string) {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (character) => character.toUpperCase());
}

function AreaTile({ area, index }: { area: CompanyArea; index: number }) {
  const alignments = [styles.mapTileNorth, styles.mapTileEast, styles.mapTileWest];

  return (
    <View style={[styles.mapTile, alignments[index] ?? styles.mapTileNorth]}>
      <Text style={styles.mapTileName}>{area.name}</Text>
      <Text style={styles.mapTileStat}>Traction {area.traction}</Text>
      <Text style={styles.mapTileStat}>Polish {area.polish}</Text>
      <Text style={styles.mapTileStat}>Chaos {area.chaos}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4efe4',
  },
  container: {
    gap: 16,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    gap: 6,
    paddingTop: 16,
  },
  eyebrow: {
    color: '#7a4d24',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  title: {
    color: '#24160b',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: '#554333',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#fffaf0',
    borderColor: '#dfcba8',
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  sectionTitle: {
    color: '#2b1a0f',
    fontSize: 18,
    fontWeight: '800',
  },
  resourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  resourcePill: {
    backgroundColor: '#efe0c3',
    borderRadius: 14,
    minWidth: '46%',
    padding: 12,
  },
  resourceLabel: {
    color: '#72512e',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  resourceValue: {
    color: '#24160b',
    fontSize: 24,
    fontWeight: '900',
  },
  paceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  paceText: {
    backgroundColor: '#283618',
    borderRadius: 999,
    color: '#fffaf0',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  map: {
    backgroundColor: '#cfdbc2',
    borderColor: '#748b5d',
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 16,
  },
  mapTile: {
    backgroundColor: 'rgba(255, 250, 240, 0.88)',
    borderColor: '#748b5d',
    borderRadius: 14,
    borderWidth: 1,
    padding: 10,
    position: 'absolute',
    width: '44%',
  },
  mapTileNorth: {
    alignSelf: 'center',
    top: 18,
  },
  mapTileEast: {
    right: 16,
    top: '42%',
  },
  mapTileWest: {
    bottom: 18,
    left: 16,
  },
  mapTileName: {
    color: '#283618',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  mapTileStat: {
    color: '#3f4f31',
    fontSize: 12,
    fontWeight: '600',
  },
  decisionButton: {
    backgroundColor: '#f7ecd5',
    borderColor: '#d6bd90',
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
  decisionButtonSelected: {
    backgroundColor: '#5f3e1f',
    borderColor: '#5f3e1f',
  },
  decisionTitle: {
    color: '#2b1a0f',
    fontSize: 16,
    fontWeight: '800',
  },
  decisionTitleSelected: {
    color: '#fffaf0',
  },
  decisionDescription: {
    color: '#6a533d',
    fontSize: 13,
    lineHeight: 19,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#283618',
    borderRadius: 14,
    marginTop: 4,
    padding: 14,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonText: {
    color: '#fffaf0',
    fontSize: 16,
    fontWeight: '900',
  },
  bodyText: {
    color: '#4e3d2d',
    fontSize: 14,
    lineHeight: 21,
  },
  factText: {
    backgroundColor: '#efe0c3',
    borderRadius: 12,
    color: '#3b2c1e',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 21,
    padding: 12,
  },
  smallHeading: {
    color: '#7a4d24',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
