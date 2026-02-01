import AsyncStorage from "@react-native-async-storage/async-storage";

const ASSESSMENTS_KEY = "@devready_assessments";

export interface Assessment {
  id: string;
  score: number;
  level: string;
  strengths: string[];
  gaps: string[];
  actions: string[];
  resumeName: string;
  createdAt: string;
}

export async function saveAssessment(assessment: Assessment): Promise<void> {
  try {
    const existing = await getAssessments();
    const updated = [assessment, ...existing];
    await AsyncStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save assessment:", error);
    throw error;
  }
}

export async function getAssessments(): Promise<Assessment[]> {
  try {
    const data = await AsyncStorage.getItem(ASSESSMENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to get assessments:", error);
    return [];
  }
}

export async function getLatestAssessment(): Promise<Assessment | null> {
  const assessments = await getAssessments();
  return assessments.length > 0 ? assessments[0] : null;
}

export async function deleteAssessment(id: string): Promise<void> {
  try {
    const existing = await getAssessments();
    const updated = existing.filter((a) => a.id !== id);
    await AsyncStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to delete assessment:", error);
    throw error;
  }
}

export async function clearAllAssessments(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ASSESSMENTS_KEY);
  } catch (error) {
    console.error("Failed to clear assessments:", error);
    throw error;
  }
}
