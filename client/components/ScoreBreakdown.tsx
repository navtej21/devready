import React, { useState } from "react";
import { View, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import type { CategoryScore } from "@/lib/storage";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CategoryRowProps {
  category: CategoryScore;
  isExpanded: boolean;
  onToggle: () => void;
}

function CategoryRow({ category, isExpanded, onToggle }: CategoryRowProps) {
  const { theme } = useTheme();
  const percentage = (category.score / category.maxScore) * 100;
  
  const getBarColor = () => {
    if (percentage >= 70) return Colors.light.success;
    if (percentage >= 40) return Colors.light.warning;
    return Colors.light.info;
  };

  return (
    <Pressable onPress={onToggle} style={styles.categoryRow}>
      <View style={styles.categoryHeader}>
        <View style={styles.categoryInfo}>
          <ThemedText type="h4" style={styles.categoryName}>
            {category.name}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {category.score}/{category.maxScore} points
          </ThemedText>
        </View>
        <Feather
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.textSecondary}
        />
      </View>
      
      <View style={[styles.progressBarBg, { backgroundColor: theme.backgroundSecondary }]}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${percentage}%`, backgroundColor: getBarColor() },
          ]}
        />
      </View>
      
      {isExpanded ? (
        <Animated.View 
          entering={FadeIn.duration(200)} 
          exiting={FadeOut.duration(150)}
          style={styles.expandedContent}
        >
          <ThemedText type="small" style={[styles.categoryDescription, { color: theme.textSecondary }]}>
            {category.description}
          </ThemedText>
          {category.findings.length > 0 ? (
            <View style={styles.findingsContainer}>
              <ThemedText type="small" style={[styles.findingsLabel, { color: theme.text }]}>
                What we found:
              </ThemedText>
              {category.findings.map((finding, index) => (
                <View key={index} style={styles.findingRow}>
                  <View style={[styles.findingBullet, { backgroundColor: getBarColor() }]} />
                  <ThemedText type="small" style={[styles.findingText, { color: theme.textSecondary }]}>
                    {finding}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}
        </Animated.View>
      ) : null}
    </Pressable>
  );
}

interface ScoreBreakdownProps {
  categories: CategoryScore[];
}

export function ScoreBreakdown({ categories }: ScoreBreakdownProps) {
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Card elevation={1} style={styles.container}>
      <View style={styles.header}>
        <Feather name="pie-chart" size={20} color={Colors.light.primary} />
        <ThemedText type="h3" style={styles.headerTitle}>
          Score Breakdown
        </ThemedText>
      </View>
      <ThemedText type="small" style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
        Tap each category to see what we evaluated
      </ThemedText>
      
      <View style={styles.categoriesList}>
        {categories.map((category, index) => (
          <React.Fragment key={category.name}>
            {index > 0 ? <View style={[styles.divider, { backgroundColor: theme.border }]} /> : null}
            <CategoryRow
              category={category}
              isExpanded={expandedIndex === index}
              onToggle={() => handleToggle(index)}
            />
          </React.Fragment>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing["2xl"],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  headerTitle: {
    marginLeft: Spacing.sm,
  },
  headerSubtitle: {
    marginBottom: Spacing.lg,
  },
  categoriesList: {},
  categoryRow: {
    paddingVertical: Spacing.md,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    marginBottom: Spacing.xs,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  expandedContent: {
    marginTop: Spacing.md,
    paddingLeft: Spacing.sm,
  },
  categoryDescription: {
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  findingsContainer: {
    backgroundColor: "transparent",
  },
  findingsLabel: {
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  findingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.xs,
  },
  findingBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: Spacing.sm,
  },
  findingText: {
    flex: 1,
    lineHeight: 20,
  },
  divider: {
    height: 1,
  },
});
