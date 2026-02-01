import { Platform } from "react-native";

const primaryColor = "#2D6A4F";
const accentColor = "#F77F00";

export const Colors = {
  light: {
    text: "#1C1C1E",
    textSecondary: "#6B7280",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6B7280",
    tabIconSelected: primaryColor,
    link: primaryColor,
    accent: accentColor,
    primary: primaryColor,
    backgroundRoot: "#FAFAF9",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F5F5F4",
    backgroundTertiary: "#E7E5E4",
    border: "#E5E7EB",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",
    error: "#EF4444",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#40916C",
    link: "#40916C",
    accent: accentColor,
    primary: "#40916C",
    backgroundRoot: "#1F2123",
    backgroundDefault: "#2A2C2E",
    backgroundSecondary: "#353739",
    backgroundTertiary: "#404244",
    border: "#404244",
    success: "#10B981",
    warning: "#F59E0B",
    info: "#3B82F6",
    error: "#EF4444",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 56,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
    fontFamily: "Montserrat_700Bold",
  },
  h1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700" as const,
    fontFamily: "Montserrat_700Bold",
  },
  h2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
    fontFamily: "Montserrat_600SemiBold",
  },
  h3: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
    fontFamily: "Montserrat_600SemiBold",
  },
  h4: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600" as const,
    fontFamily: "Montserrat_600SemiBold",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
    fontFamily: "Inter_400Regular",
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
    fontFamily: "Inter_400Regular",
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "500" as const,
    fontFamily: "Inter_500Medium",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const ReadinessLevels = {
  early: {
    label: "Early",
    color: "#3B82F6",
    minScore: 0,
    maxScore: 25,
  },
  developing: {
    label: "Developing",
    color: "#F59E0B",
    minScore: 26,
    maxScore: 50,
  },
  interviewReady: {
    label: "Interview-Ready",
    color: "#2D6A4F",
    minScore: 51,
    maxScore: 75,
  },
  strong: {
    label: "Strong",
    color: "#10B981",
    minScore: 76,
    maxScore: 100,
  },
};

export function getReadinessLevel(score: number) {
  if (score <= 25) return ReadinessLevels.early;
  if (score <= 50) return ReadinessLevels.developing;
  if (score <= 75) return ReadinessLevels.interviewReady;
  return ReadinessLevels.strong;
}
