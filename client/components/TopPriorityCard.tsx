import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import type { TopPriority } from "@/lib/storage";

interface TopPriorityCardProps {
  topPriority: TopPriority;
  compact?: boolean;
}

export function TopPriorityCard({ topPriority, compact = false }: TopPriorityCardProps) {
  const { theme } = useTheme();

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: `${Colors.light.primary}08` }]}>
        <View style={styles.compactHeader}>
          <Feather name="target" size={16} color={Colors.light.primary} />
          <ThemedText type="small" style={[styles.compactLabel, { color: Colors.light.primary }]}>
            Focus Next
          </ThemedText>
        </View>
        <ThemedText type="h4" style={styles.compactTitle}>
          {topPriority.title}
        </ThemedText>
      </View>
    );
  }

  return (
    <Card elevation={2} style={[styles.container, { backgroundColor: `${Colors.light.primary}08` }]}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconCircle, { backgroundColor: Colors.light.primary }]}>
          <Feather name="target" size={24} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.labelContainer}>
        <ThemedText type="small" style={[styles.label, { color: Colors.light.primary }]}>
          YOUR TOP PRIORITY
        </ThemedText>
      </View>

      <ThemedText type="h2" style={styles.title}>
        {topPriority.title}
      </ThemedText>

      <ThemedText type="body" style={[styles.reason, { color: theme.textSecondary }]}>
        {topPriority.reason}
      </ThemedText>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing["2xl"],
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
  },
  iconContainer: {
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  labelContainer: {
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  reason: {
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  compactContainer: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  compactHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  compactLabel: {
    fontWeight: "600",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  compactTitle: {
    marginBottom: 0,
  },
});
