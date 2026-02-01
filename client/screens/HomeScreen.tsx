import React, { useCallback, useState } from "react";
import { View, ScrollView, StyleSheet, Image, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { ScoreRing } from "@/components/ScoreRing";
import { StatCard } from "@/components/StatCard";
import { TopPriorityCard } from "@/components/TopPriorityCard";
import { ProgressSummary } from "@/components/ProgressSummary";
import { SectionHeader } from "@/components/SectionHeader";
import { FeedbackItem } from "@/components/FeedbackItem";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors } from "@/constants/theme";
import { getAssessments, type Assessment } from "@/lib/storage";
import { calculateProgress, type ProgressData } from "@/lib/progress";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";
import type { MainTabParamList } from "@/navigation/MainTabNavigator";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "HomeTab">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    const allAssessments = await getAssessments();
    if (allAssessments.length > 0) {
      setAssessment(allAssessments[0]);
      const progress = calculateProgress(allAssessments);
      setProgressData(progress);
    } else {
      setAssessment(null);
      setProgressData(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleStartAssessment = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("AssessTab");
  };

  const handleViewResults = () => {
    if (assessment) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate("Results", { assessment });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!assessment) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
        contentContainerStyle={[
          styles.emptyContainer,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Image
          source={require("../../assets/images/empty-home.png")}
          style={styles.emptyImage}
          resizeMode="contain"
        />
        <ThemedText type="h1" style={styles.emptyTitle}>
          Check Your Readiness
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.emptySubtitle, { color: theme.textSecondary }]}
        >
          Upload your resume to get a personalized assessment of your backend developer readiness.
        </ThemedText>
        <Button onPress={handleStartAssessment} style={styles.ctaButton}>
          Start Your First Assessment
        </Button>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.scoreSection}>
        <ScoreRing score={assessment.score} size={180} />
        <ThemedText
          type="small"
          style={[styles.assessedDate, { color: theme.textSecondary }]}
        >
          Last assessed {formatDate(assessment.createdAt)}
        </ThemedText>
      </View>

      {progressData ? (
        <ProgressSummary
          insight={progressData.insight}
          journeyMessage={progressData.journeyMessage}
          compact
        />
      ) : null}

      {assessment.topPriority ? (
        <TopPriorityCard topPriority={assessment.topPriority} compact />
      ) : null}

      <View style={styles.statsRow}>
        <StatCard
          icon="check-circle"
          label="Strengths"
          value={assessment.strengths.length}
          color={Colors.light.success}
        />
        <View style={{ width: Spacing.md }} />
        <StatCard
          icon="alert-circle"
          label="Gaps"
          value={assessment.gaps.length}
          color={Colors.light.warning}
        />
        <View style={{ width: Spacing.md }} />
        <StatCard
          icon="target"
          label="Focus Areas"
          value={assessment.focusAreas?.length || 0}
          color={Colors.light.primary}
        />
      </View>

      {assessment.strengths.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Your Strengths"
            subtitle="Skills that stand out on your resume"
          />
          {assessment.strengths.slice(0, 2).map((strength, index) => (
            <FeedbackItem key={index} text={strength} type="strength" />
          ))}
        </View>
      ) : null}

      {assessment.focusAreas && assessment.focusAreas.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Improvement Plan"
            subtitle="Your prioritized next steps"
          />
          {assessment.focusAreas.slice(0, 1).map((area, index) => (
            <FeedbackItem
              key={index}
              text={`${area.title}: ${area.actions[0]}`}
              type="action"
            />
          ))}
        </View>
      ) : null}

      <Button
        variant="secondary"
        onPress={handleViewResults}
        style={styles.viewDetailsButton}
      >
        View Full Results
      </Button>

      <Button onPress={handleStartAssessment} style={styles.newAssessmentButton}>
        Start New Assessment
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: Spacing["2xl"],
  },
  emptyTitle: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  emptySubtitle: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
    lineHeight: 24,
  },
  ctaButton: {
    width: "100%",
    maxWidth: 300,
  },
  scoreSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  assessedDate: {
    marginTop: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: Spacing["2xl"],
  },
  section: {
    marginBottom: Spacing.xl,
  },
  viewDetailsButton: {
    marginBottom: Spacing.md,
  },
  newAssessmentButton: {},
});
