import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import type { CategoryChange } from "@/lib/progress";

interface CategoryProgressProps {
  improvedCategories: CategoryChange[];
  declinedCategories: CategoryChange[];
  stableCategories: CategoryChange[];
}

export function CategoryProgress({ 
  improvedCategories, 
  declinedCategories, 
  stableCategories 
}: CategoryProgressProps) {
  const { theme } = useTheme();

  const hasChanges = improvedCategories.length > 0 || declinedCategories.length > 0;

  if (!hasChanges && stableCategories.length === 0) {
    return null;
  }

  return (
    <Card elevation={1} style={styles.container}>
      <ThemedText type="h3" style={styles.title}>
        Category Changes
      </ThemedText>
      <ThemedText type="small" style={[styles.subtitle, { color: theme.textSecondary }]}>
        Compared to your previous assessment
      </ThemedText>

      {improvedCategories.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="arrow-up-circle" size={16} color={Colors.light.success} />
            <ThemedText type="small" style={[styles.sectionLabel, { color: Colors.light.success }]}>
              Improved
            </ThemedText>
          </View>
          {improvedCategories.map((cat) => (
            <CategoryChangeRow key={cat.name} category={cat} theme={theme} />
          ))}
        </View>
      ) : null}

      {declinedCategories.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="arrow-down-circle" size={16} color={Colors.light.warning} />
            <ThemedText type="small" style={[styles.sectionLabel, { color: Colors.light.warning }]}>
              Needs Attention
            </ThemedText>
          </View>
          {declinedCategories.map((cat) => (
            <CategoryChangeRow key={cat.name} category={cat} theme={theme} />
          ))}
        </View>
      ) : null}

      {stableCategories.length > 0 && hasChanges ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="minus-circle" size={16} color={Colors.light.info} />
            <ThemedText type="small" style={[styles.sectionLabel, { color: Colors.light.info }]}>
              Stable ({stableCategories.length})
            </ThemedText>
          </View>
        </View>
      ) : null}

      {!hasChanges ? (
        <View style={[styles.noChangesBanner, { backgroundColor: `${Colors.light.info}10` }]}>
          <Feather name="info" size={16} color={Colors.light.info} />
          <ThemedText type="small" style={[styles.noChangesText, { color: theme.textSecondary }]}>
            Your category scores are consistent with your last assessment. Keep working on your improvement plan to see growth.
          </ThemedText>
        </View>
      ) : null}
    </Card>
  );
}

function CategoryChangeRow({ category, theme }: { category: CategoryChange; theme: any }) {
  const isImproved = category.trend === "improved";
  const color = isImproved ? Colors.light.success : Colors.light.warning;

  return (
    <View style={styles.categoryRow}>
      <View style={styles.categoryInfo}>
        <ThemedText type="body">{category.name}</ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {category.currentScore}/{category.maxScore} pts
        </ThemedText>
      </View>
      <View style={[styles.deltaBadge, { backgroundColor: `${color}15` }]}>
        <Feather 
          name={isImproved ? "arrow-up" : "arrow-down"} 
          size={12} 
          color={color} 
        />
        <ThemedText type="small" style={[styles.deltaText, { color }]}>
          {isImproved ? "+" : ""}{category.delta}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  sectionLabel: {
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: "#F8F9FA",
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  categoryInfo: {
    flex: 1,
  },
  deltaBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  deltaText: {
    fontWeight: "600",
    fontSize: 13,
  },
  noChangesBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  noChangesText: {
    flex: 1,
    lineHeight: 20,
  },
});
