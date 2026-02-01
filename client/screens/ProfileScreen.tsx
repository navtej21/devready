import React, { useCallback, useState } from "react";
import { View, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { ThemedText } from "@/components/ThemedText";
import { Card } from "@/components/Card";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";
import { getAssessments, clearAllAssessments, type Assessment } from "@/lib/storage";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string | number;
  onPress: () => void;
  color?: string;
}

function MenuItem({ icon, label, value, onPress, color }: MenuItemProps) {
  const { theme } = useTheme();
  const iconColor = color || theme.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        { backgroundColor: pressed ? theme.backgroundSecondary : theme.backgroundDefault },
      ]}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIconContainer, { backgroundColor: `${iconColor}15` }]}>
          <Feather name={icon} size={20} color={iconColor} />
        </View>
        <ThemedText style={[styles.menuLabel, color ? { color } : null]}>
          {label}
        </ThemedText>
      </View>
      <View style={styles.menuItemRight}>
        {value !== undefined ? (
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {value}
          </ThemedText>
        ) : null}
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [assessmentCount, setAssessmentCount] = useState(0);

  const loadData = useCallback(async () => {
    const assessments = await getAssessments();
    setAssessmentCount(assessments.length);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleViewHistory = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("History");
  };

  const handleClearData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all your assessment history? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearAllAssessments();
            setAssessmentCount(0);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={{
        paddingTop: headerHeight + Spacing.xl,
        paddingBottom: tabBarHeight + Spacing.xl,
        paddingHorizontal: Spacing.lg,
      }}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
    >
      <Card elevation={1} style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: Colors.light.primary }]}>
          <Feather name="user" size={40} color="#FFFFFF" />
        </View>
        <ThemedText type="h2" style={styles.profileName}>
          Developer
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          Backend Developer Track
        </ThemedText>
      </Card>

      <View style={styles.section}>
        <ThemedText type="h4" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          ASSESSMENTS
        </ThemedText>
        <View style={[styles.menuGroup, { backgroundColor: theme.backgroundDefault }]}>
          <MenuItem
            icon="file-text"
            label="Assessment History"
            value={assessmentCount}
            onPress={handleViewHistory}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          ABOUT
        </ThemedText>
        <View style={[styles.menuGroup, { backgroundColor: theme.backgroundDefault }]}>
          <MenuItem
            icon="shield"
            label="Privacy Policy"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
          <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />
          <MenuItem
            icon="info"
            label="About DevReady"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="h4" style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          DATA
        </ThemedText>
        <View style={[styles.menuGroup, { backgroundColor: theme.backgroundDefault }]}>
          <MenuItem
            icon="trash-2"
            label="Clear All Data"
            onPress={handleClearData}
            color={Colors.light.error}
          />
        </View>
      </View>

      <ThemedText
        type="small"
        style={[styles.version, { color: theme.textSecondary }]}
      >
        DevReady v1.0.0
      </ThemedText>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  profileName: {
    marginBottom: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  menuGroup: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  menuLabel: {
    fontSize: 16,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  menuDivider: {
    height: 1,
    marginLeft: 60,
  },
  version: {
    textAlign: "center",
    marginTop: Spacing.xl,
  },
});
