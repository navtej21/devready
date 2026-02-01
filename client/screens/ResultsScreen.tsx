import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { ScoreRing } from "@/components/ScoreRing";
import { SectionHeader } from "@/components/SectionHeader";
import { FeedbackItem } from "@/components/FeedbackItem";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type ResultsRouteProp = RouteProp<RootStackParamList, "Results">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ResultsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultsRouteProp>();

  const { assessment } = route.params;

  const handleDone = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <View style={styles.scoreSection}>
        <ScoreRing score={assessment.score} size={220} />
        <ThemedText
          type="body"
          style={[styles.resumeName, { color: theme.textSecondary }]}
        >
          Based on: {assessment.resumeName}
        </ThemedText>
      </View>

      {assessment.strengths.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Your Strengths"
            subtitle="Skills and experiences that make you stand out"
          />
          {assessment.strengths.map((strength, index) => (
            <FeedbackItem key={index} text={strength} type="strength" />
          ))}
        </View>
      ) : null}

      {assessment.gaps.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Areas to Improve"
            subtitle="Skills that could strengthen your profile"
          />
          {assessment.gaps.map((gap, index) => (
            <FeedbackItem key={index} text={gap} type="gap" />
          ))}
        </View>
      ) : null}

      {assessment.actions.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="What to Do Next"
            subtitle="Actionable steps to improve your readiness"
          />
          {assessment.actions.map((action, index) => (
            <FeedbackItem key={index} text={action} type="action" />
          ))}
        </View>
      ) : null}

      <Button onPress={handleDone} style={styles.doneButton}>
        Done
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scoreSection: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  resumeName: {
    marginTop: Spacing.lg,
    textAlign: "center",
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  doneButton: {
    marginTop: Spacing.lg,
  },
});
