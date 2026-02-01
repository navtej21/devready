import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { UploadArea } from "@/components/UploadArea";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors, BorderRadius } from "@/constants/theme";
import { apiRequest } from "@/lib/query-client";
import { saveAssessment, type Assessment } from "@/lib/storage";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EVALUATION_CATEGORIES = [
  { name: "Programming Languages", icon: "code" as const },
  { name: "Database Skills", icon: "database" as const },
  { name: "API Design", icon: "git-branch" as const },
  { name: "DevOps & Cloud", icon: "cloud" as const },
  { name: "System Design", icon: "layers" as const },
  { name: "Professional Experience", icon: "briefcase" as const },
];

export default function AssessScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    uri: string;
    mimeType?: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setSelectedFile({
          name: file.name,
          uri: file.uri,
          mimeType: file.mimeType,
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Alert.alert("Error", "Failed to pick document. Please try again.");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      let fileData: string | undefined;

      try {
        const base64Content = await FileSystem.readAsStringAsync(selectedFile.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        fileData = base64Content;
      } catch (fileError) {
        console.warn("Could not read file content:", fileError);
      }

      const response = await apiRequest("POST", "/api/analyze-resume", {
        fileName: selectedFile.name,
        fileData: fileData,
        mimeType: selectedFile.mimeType,
      });

      const data = await response.json();

      const assessment: Assessment = {
        id: Date.now().toString(),
        score: data.score,
        level: data.level,
        strengths: data.strengths,
        gaps: data.gaps,
        actions: data.actions,
        resumeName: selectedFile.name,
        createdAt: new Date().toISOString(),
        categories: data.categories,
        scoringMethodology: data.scoringMethodology,
      };

      await saveAssessment(assessment);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSelectedFile(null);
      navigation.navigate("Results", { assessment });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Analysis Failed",
        "We couldn't analyze your resume. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.backgroundRoot }]}>
      {isAnalyzing ? <LoadingOverlay /> : null}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingTop: headerHeight + Spacing.xl,
          paddingBottom: tabBarHeight + Spacing.xl,
          paddingHorizontal: Spacing.lg,
        }}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        <Card elevation={1} style={styles.instructionsCard}>
          <View style={styles.instructionsContent}>
            <ThemedText type="h3" style={styles.instructionsTitle}>
              Backend Developer Assessment
            </ThemedText>
            <ThemedText
              type="small"
              style={[styles.instructionsText, { color: theme.textSecondary }]}
            >
              Upload your resume to receive a transparent readiness assessment. We'll analyze your profile against industry expectations and show you exactly how each skill area contributes to your score.
            </ThemedText>
          </View>
        </Card>

        <Card elevation={1} style={styles.categoriesCard}>
          <View style={styles.categoriesHeader}>
            <Feather name="check-square" size={18} color={Colors.light.primary} />
            <ThemedText type="h4" style={styles.categoriesTitle}>
              What We Evaluate
            </ThemedText>
          </View>
          <View style={styles.categoriesGrid}>
            {EVALUATION_CATEGORIES.map((category) => (
              <View key={category.name} style={styles.categoryChip}>
                <Feather name={category.icon} size={14} color={Colors.light.primary} />
                <ThemedText type="small" style={styles.categoryChipText}>
                  {category.name}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>

        <Card elevation={1} style={styles.formatCard}>
          <View style={styles.formatHeader}>
            <Feather name="file-text" size={16} color={Colors.light.info} />
            <ThemedText type="small" style={[styles.formatTitle, { color: theme.text }]}>
              Best file formats for accurate analysis
            </ThemedText>
          </View>
          <ThemedText type="small" style={[styles.formatText, { color: theme.textSecondary }]}>
            Text-based PDF, Word (.docx), or plain text (.txt). Scanned image PDFs may not be readable.
          </ThemedText>
        </Card>

        <UploadArea
          fileName={selectedFile?.name}
          onPress={handlePickDocument}
          disabled={isAnalyzing}
        />

        <View style={styles.privacyNote}>
          <Feather name="lock" size={14} color={theme.textSecondary} />
          <ThemedText
            type="small"
            style={[styles.privacyText, { color: theme.textSecondary }]}
          >
            Your resume is analyzed privately and never stored on our servers.
          </ThemedText>
        </View>

        <Button
          onPress={handleAnalyze}
          disabled={!selectedFile || isAnalyzing}
          style={styles.analyzeButton}
        >
          Analyze My Resume
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  instructionsCard: {
    marginBottom: Spacing.lg,
  },
  instructionsContent: {},
  instructionsTitle: {
    marginBottom: Spacing.md,
  },
  instructionsText: {
    lineHeight: 22,
  },
  categoriesCard: {
    marginBottom: Spacing.lg,
  },
  categoriesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  categoriesTitle: {
    marginLeft: Spacing.sm,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.light.primary}10`,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  categoryChipText: {
    color: Colors.light.primary,
    fontWeight: "500",
  },
  formatCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.md,
  },
  formatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
  },
  formatTitle: {
    fontWeight: "600",
  },
  formatText: {
    lineHeight: 20,
  },
  privacyNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  privacyText: {
    textAlign: "center",
  },
  analyzeButton: {
    marginTop: Spacing.sm,
  },
});
