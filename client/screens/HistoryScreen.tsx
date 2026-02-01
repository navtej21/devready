import React, { useCallback, useState } from "react";
import { View, FlatList, StyleSheet, Pressable, Alert, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, getReadinessLevel } from "@/constants/theme";
import { getAssessments, deleteAssessment, type Assessment } from "@/lib/storage";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const loadAssessments = useCallback(async () => {
    const data = await getAssessments();
    setAssessments(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAssessments();
    }, [loadAssessments])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePress = (assessment: Assessment) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("Results", { assessment });
  };

  const handleDelete = (assessment: Assessment) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Delete Assessment",
      `Are you sure you want to delete the assessment from ${formatDate(assessment.createdAt)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteAssessment(assessment.id);
            await loadAssessments();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Assessment }) => {
    const level = getReadinessLevel(item.score);

    return (
      <Pressable
        onPress={() => handlePress(item)}
        onLongPress={() => handleDelete(item)}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: pressed ? theme.backgroundSecondary : theme.backgroundDefault,
          },
        ]}
      >
        <View style={styles.cardLeft}>
          <View style={[styles.scoreCircle, { borderColor: level.color }]}>
            <ThemedText style={[styles.scoreText, { color: level.color }]}>
              {item.score}
            </ThemedText>
          </View>
          <View style={styles.cardInfo}>
            <ThemedText type="h3" style={styles.levelLabel}>
              {level.label}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {formatDate(item.createdAt)}
            </ThemedText>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../assets/images/empty-home.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <ThemedText type="h2" style={styles.emptyTitle}>
        No Assessments Yet
      </ThemedText>
      <ThemedText type="body" style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Start your first assessment to see your history here.
      </ThemedText>
    </View>
  );

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: insets.bottom + Spacing.xl,
        paddingHorizontal: Spacing.lg,
        flexGrow: 1,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      data={assessments}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
      ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.lg,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Montserrat_700Bold",
  },
  cardInfo: {
    gap: Spacing.xs,
  },
  levelLabel: {
    marginBottom: 0,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyImage: {
    width: 160,
    height: 160,
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    textAlign: "center",
    lineHeight: 24,
  },
});
