import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Colors } from "@/constants/theme";

interface UploadAreaProps {
  fileName?: string;
  onPress: () => void;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function UploadArea({ fileName, onPress, disabled }: UploadAreaProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.98);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const hasFile = !!fileName;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: hasFile ? Colors.light.success : theme.border,
          opacity: disabled ? 0.6 : 1,
        },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: hasFile
              ? `${Colors.light.success}15`
              : `${Colors.light.primary}15`,
          },
        ]}
      >
        <Feather
          name={hasFile ? "check" : "upload"}
          size={28}
          color={hasFile ? Colors.light.success : Colors.light.primary}
        />
      </View>
      <ThemedText type="h3" style={styles.title}>
        {hasFile ? "Resume Uploaded" : "Upload Your Resume"}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.subtitle, { color: theme.textSecondary }]}
      >
        {hasFile ? fileName : "Word documents (.docx) recommended"}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing["3xl"],
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
});
