import React, { useState } from "react";
import { View, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors, ReadinessLevels } from "@/constants/theme";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface HowWeAssessProps {
  methodology?: string;
}

export function HowWeAssess({ methodology }: HowWeAssessProps) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const levels = [
    { ...ReadinessLevels.early, range: "0-25" },
    { ...ReadinessLevels.developing, range: "26-50" },
    { ...ReadinessLevels.interviewReady, range: "51-75" },
    { ...ReadinessLevels.strong, range: "76-100" },
  ];

  return (
    <Card elevation={1} style={styles.container}>
      <Pressable onPress={handleToggle} style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="help-circle" size={20} color={Colors.light.info} />
          <ThemedText type="h3" style={styles.headerTitle}>
            How We Assess
          </ThemedText>
        </View>
        <Feather
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.textSecondary}
        />
      </Pressable>

      {isExpanded ? (
        <View style={styles.content}>
          {methodology ? (
            <ThemedText type="small" style={[styles.methodology, { color: theme.textSecondary }]}>
              {methodology}
            </ThemedText>
          ) : null}

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Role-Based Expectations
            </ThemedText>
            <ThemedText type="small" style={[styles.sectionText, { color: theme.textSecondary }]}>
              Your resume is evaluated against what employers actually look for in Backend Developer candidates. We assess technical skills, practical experience, and professional growth indicators.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Readiness Levels
            </ThemedText>
            <View style={styles.levelsGrid}>
              {levels.map((level) => (
                <View key={level.label} style={styles.levelItem}>
                  <View style={[styles.levelDot, { backgroundColor: level.color }]} />
                  <View style={styles.levelInfo}>
                    <ThemedText type="small" style={styles.levelLabel}>
                      {level.label}
                    </ThemedText>
                    <ThemedText type="small" style={{ color: theme.textSecondary }}>
                      {level.range} points
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Strengths & Gaps
            </ThemedText>
            <ThemedText type="small" style={[styles.sectionText, { color: theme.textSecondary }]}>
              Strengths highlight areas where your experience exceeds expectations. Gaps identify skills that could strengthen your candidacy if developed further.
            </ThemedText>
          </View>

          <View style={[styles.privacyNote, { backgroundColor: theme.backgroundSecondary }]}>
            <Feather name="lock" size={16} color={Colors.light.primary} />
            <ThemedText type="small" style={[styles.privacyText, { color: theme.textSecondary }]}>
              Your assessment is completely private. We don't store your resume or share your results.
            </ThemedText>
          </View>
        </View>
      ) : (
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          Tap to learn how your readiness score is calculated
        </ThemedText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing["2xl"],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    marginLeft: Spacing.sm,
  },
  content: {
    marginTop: Spacing.md,
  },
  methodology: {
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  sectionText: {
    lineHeight: 22,
  },
  levelsGrid: {
    marginTop: Spacing.xs,
  },
  levelItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  levelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.md,
  },
  levelInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  levelLabel: {
    fontWeight: "600",
    minWidth: 100,
  },
  privacyNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderRadius: Spacing.sm,
    gap: Spacing.sm,
  },
  privacyText: {
    flex: 1,
    lineHeight: 20,
  },
});
