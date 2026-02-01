import React, { useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors } from "@/constants/theme";

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Analyzing your resume..." }: LoadingOverlayProps) {
  const { theme } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + progress.value * 0.5,
    transform: [{ scale: 0.95 + progress.value * 0.05 }],
  }));

  return (
    <View style={[styles.container, { backgroundColor: `${theme.backgroundRoot}F5` }]}>
      <Animated.View style={[styles.content, pulseStyle]}>
        <View style={[styles.iconContainer, { backgroundColor: `${Colors.light.primary}15` }]}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
        <ThemedText type="h2" style={styles.title}>
          {message}
        </ThemedText>
        <ThemedText type="small" style={[styles.subtitle, { color: theme.textSecondary }]}>
          This may take a few moments
        </ThemedText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  content: {
    alignItems: "center",
    padding: Spacing["3xl"],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
});
