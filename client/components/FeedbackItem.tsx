import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface FeedbackItemProps {
  text: string;
  type: "strength" | "gap" | "action";
}

export function FeedbackItem({ text, type }: FeedbackItemProps) {
  const { theme } = useTheme();

  const getIcon = () => {
    switch (type) {
      case "strength":
        return { name: "check-circle" as const, color: Colors.light.success };
      case "gap":
        return { name: "minus-circle" as const, color: Colors.light.warning };
      case "action":
        return { name: "arrow-right-circle" as const, color: Colors.light.primary };
    }
  };

  const iconConfig = getIcon();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDefault }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconConfig.color}15` }]}>
        <Feather name={iconConfig.name} size={20} color={iconConfig.color} />
      </View>
      <ThemedText style={styles.text}>{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});
