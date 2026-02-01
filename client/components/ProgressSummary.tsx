import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import type { ProgressInsight } from "@/lib/progress";

interface ProgressSummaryProps {
  insight: ProgressInsight;
  journeyMessage: string;
  compact?: boolean;
}

const TREND_CONFIG = {
  improving: {
    icon: "trending-up" as const,
    color: Colors.light.success,
    label: "Improving",
  },
  stable: {
    icon: "minus" as const,
    color: Colors.light.info,
    label: "Stable",
  },
  declining: {
    icon: "trending-down" as const,
    color: Colors.light.warning,
    label: "Needs Focus",
  },
};

export function ProgressSummary({ insight, journeyMessage, compact = false }: ProgressSummaryProps) {
  const { theme } = useTheme();
  const trendConfig = TREND_CONFIG[insight.trend];

  const formatDelta = (delta: number) => {
    if (delta > 0) return `+${delta}`;
    if (delta < 0) return `${delta}`;
    return "0";
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: `${trendConfig.color}10` }]}>
        <View style={styles.compactLeft}>
          <View style={[styles.trendBadge, { backgroundColor: `${trendConfig.color}20` }]}>
            <Feather name={trendConfig.icon} size={14} color={trendConfig.color} />
            <ThemedText type="small" style={[styles.trendText, { color: trendConfig.color }]}>
              {formatDelta(insight.scoreDelta)} pts
            </ThemedText>
          </View>
          <ThemedText type="small" style={[styles.compactLabel, { color: theme.textSecondary }]}>
            vs. last assessment
          </ThemedText>
        </View>
        <View style={styles.compactRight}>
          <ThemedText type="small" style={[styles.assessmentCount, { color: theme.textSecondary }]}>
            {insight.assessmentCount} assessments
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <Card elevation={1} style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: `${trendConfig.color}15` }]}>
          <Feather name={trendConfig.icon} size={24} color={trendConfig.color} />
        </View>
        <View style={styles.headerText}>
          <ThemedText type="h3">{trendConfig.label}</ThemedText>
          <View style={styles.deltaRow}>
            <ThemedText 
              type="h2" 
              style={[styles.deltaValue, { color: trendConfig.color }]}
            >
              {formatDelta(insight.scoreDelta)}
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>
              {" "}points since last
            </ThemedText>
          </View>
        </View>
      </View>

      <ThemedText type="body" style={[styles.message, { color: theme.textSecondary }]}>
        {journeyMessage}
      </ThemedText>

      <View style={[styles.statsRow, { borderTopColor: theme.border }]}>
        <View style={styles.stat}>
          <ThemedText type="h3">{insight.assessmentCount}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Assessments
          </ThemedText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.stat}>
          <ThemedText type="h3">{insight.currentScore}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Current Score
          </ThemedText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.stat}>
          <ThemedText type="h3">
            {insight.daysSinceFirst > 0 ? `${insight.daysSinceFirst}d` : "Today"}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Journey
          </ThemedText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.lg,
  },
  headerText: {
    flex: 1,
  },
  deltaRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: Spacing.xs,
  },
  deltaValue: {
    fontWeight: "700",
  },
  message: {
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  stat: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: "100%",
  },
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  compactLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  compactRight: {},
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  trendText: {
    fontWeight: "600",
    fontSize: 13,
  },
  compactLabel: {
    fontSize: 13,
  },
  assessmentCount: {
    fontSize: 12,
  },
});
