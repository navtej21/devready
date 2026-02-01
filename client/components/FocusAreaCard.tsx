import React, { useState } from "react";
import { View, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import type { FocusArea } from "@/lib/storage";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FocusAreaCardProps {
  focusArea: FocusArea;
  index: number;
}

const PRIORITY_CONFIG = {
  high: {
    color: Colors.light.error,
    label: "High Impact",
    icon: "zap" as const,
  },
  medium: {
    color: Colors.light.warning,
    label: "Medium Impact",
    icon: "trending-up" as const,
  },
  low: {
    color: Colors.light.info,
    label: "Good to Have",
    icon: "plus" as const,
  },
};

const EFFORT_CONFIG = {
  "quick-win": {
    color: Colors.light.success,
    label: "Quick Win",
    sublabel: "1-4 weeks",
    icon: "clock" as const,
  },
  "medium-term": {
    color: Colors.light.warning,
    label: "Medium Term",
    sublabel: "1-3 months",
    icon: "calendar" as const,
  },
  "long-term": {
    color: Colors.light.info,
    label: "Long Term",
    sublabel: "3+ months",
    icon: "target" as const,
  },
};

export function FocusAreaCard({ focusArea, index }: FocusAreaCardProps) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const priorityConfig = PRIORITY_CONFIG[focusArea.priority];
  const effortConfig = EFFORT_CONFIG[focusArea.effort];

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <Card elevation={1} style={styles.container}>
      <Pressable onPress={handleToggle} style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.priorityBadge, { backgroundColor: `${priorityConfig.color}15` }]}>
            <Feather name={priorityConfig.icon} size={14} color={priorityConfig.color} />
            <ThemedText type="small" style={[styles.priorityText, { color: priorityConfig.color }]}>
              {priorityConfig.label}
            </ThemedText>
          </View>
          <View style={[styles.effortBadge, { backgroundColor: `${effortConfig.color}15` }]}>
            <Feather name={effortConfig.icon} size={12} color={effortConfig.color} />
            <ThemedText type="small" style={[styles.effortText, { color: effortConfig.color }]}>
              {effortConfig.sublabel}
            </ThemedText>
          </View>
        </View>
        <Feather
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.textSecondary}
        />
      </Pressable>

      <ThemedText type="h3" style={styles.title}>
        {focusArea.title}
      </ThemedText>

      <ThemedText type="small" style={[styles.category, { color: theme.textSecondary }]}>
        {focusArea.category}
      </ThemedText>

      {isExpanded ? (
        <View style={styles.expandedContent}>
          <ThemedText type="body" style={[styles.description, { color: theme.textSecondary }]}>
            {focusArea.description}
          </ThemedText>

          <View style={styles.actionsSection}>
            <ThemedText type="h4" style={styles.actionsTitle}>
              Steps to Take
            </ThemedText>
            {focusArea.actions.map((action, actionIndex) => (
              <View key={actionIndex} style={styles.actionRow}>
                <View style={[styles.actionNumber, { backgroundColor: Colors.light.primary }]}>
                  <ThemedText type="small" style={styles.actionNumberText}>
                    {actionIndex + 1}
                  </ThemedText>
                </View>
                <ThemedText type="body" style={styles.actionText}>
                  {action}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  effortBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  effortText: {
    fontSize: 12,
    fontWeight: "500",
  },
  title: {
    marginBottom: Spacing.xs,
  },
  category: {
    fontSize: 13,
  },
  expandedContent: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  description: {
    lineHeight: 24,
    marginBottom: Spacing.lg,
  },
  actionsSection: {},
  actionsTitle: {
    marginBottom: Spacing.md,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  actionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    marginTop: 2,
  },
  actionNumberText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  actionText: {
    flex: 1,
    lineHeight: 22,
  },
});
