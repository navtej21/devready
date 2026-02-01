import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { UploadArea } from "@/components/UploadArea";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors } from "@/constants/theme";
import { apiRequest } from "@/lib/query-client";
import { saveAssessment, type Assessment } from "@/lib/storage";
import type { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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
      const response = await apiRequest("POST", "/api/analyze-resume", {
        fileName: selectedFile.name,
        fileUri: selectedFile.uri,
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
              Upload your resume to receive a personalized readiness score. We'll analyze your experience, skills, and projects against industry expectations for backend developer roles.
            </ThemedText>
            <View style={styles.bulletPoints}>
              <View style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: Colors.light.success }]} />
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Identify your key strengths
                </ThemedText>
              </View>
              <View style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: Colors.light.warning }]} />
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Discover skill gaps to address
                </ThemedText>
              </View>
              <View style={styles.bulletItem}>
                <View style={[styles.bullet, { backgroundColor: Colors.light.primary }]} />
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Get actionable next steps
                </ThemedText>
              </View>
            </View>
          </View>
        </Card>

        <UploadArea
          fileName={selectedFile?.name}
          onPress={handlePickDocument}
          disabled={isAnalyzing}
        />

        <View style={styles.privacyNote}>
          <ThemedText
            type="small"
            style={[styles.privacyText, { color: theme.textSecondary }]}
          >
            Your resume is analyzed privately and never shared. We don't store your resume data on our servers.
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
    marginBottom: Spacing.xl,
  },
  instructionsContent: {},
  instructionsTitle: {
    marginBottom: Spacing.md,
  },
  instructionsText: {
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  bulletPoints: {
    gap: Spacing.sm,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  privacyNote: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.sm,
  },
  privacyText: {
    textAlign: "center",
    lineHeight: 20,
  },
  analyzeButton: {
    marginTop: Spacing.sm,
  },
});
