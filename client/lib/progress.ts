import type { Assessment, CategoryScore } from "./storage";

export interface ProgressInsight {
  currentScore: number;
  previousScore: number;
  scoreDelta: number;
  trend: "improving" | "stable" | "declining";
  assessmentCount: number;
  daysSinceFirst: number;
}

export interface CategoryChange {
  name: string;
  currentScore: number;
  previousScore: number;
  maxScore: number;
  delta: number;
  trend: "improved" | "stable" | "declined";
}

export interface ProgressData {
  insight: ProgressInsight;
  categoryChanges: CategoryChange[];
  improvedCategories: CategoryChange[];
  declinedCategories: CategoryChange[];
  stableCategories: CategoryChange[];
  journeyMessage: string;
}

export function calculateProgress(assessments: Assessment[]): ProgressData | null {
  if (assessments.length < 2) {
    return null;
  }

  const current = assessments[0];
  const previous = assessments[1];
  const oldest = assessments[assessments.length - 1];

  const scoreDelta = current.score - previous.score;
  
  let trend: "improving" | "stable" | "declining";
  if (scoreDelta > 2) {
    trend = "improving";
  } else if (scoreDelta < -2) {
    trend = "declining";
  } else {
    trend = "stable";
  }

  const daysSinceFirst = Math.floor(
    (new Date(current.createdAt).getTime() - new Date(oldest.createdAt).getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  const insight: ProgressInsight = {
    currentScore: current.score,
    previousScore: previous.score,
    scoreDelta,
    trend,
    assessmentCount: assessments.length,
    daysSinceFirst,
  };

  const categoryChanges: CategoryChange[] = [];
  
  if (current.categories && previous.categories) {
    for (const currentCat of current.categories) {
      const previousCat = previous.categories.find(c => c.name === currentCat.name);
      if (previousCat) {
        const delta = currentCat.score - previousCat.score;
        let catTrend: "improved" | "stable" | "declined";
        if (delta > 1) {
          catTrend = "improved";
        } else if (delta < -1) {
          catTrend = "declined";
        } else {
          catTrend = "stable";
        }
        
        categoryChanges.push({
          name: currentCat.name,
          currentScore: currentCat.score,
          previousScore: previousCat.score,
          maxScore: currentCat.maxScore,
          delta,
          trend: catTrend,
        });
      }
    }
  }

  const improvedCategories = categoryChanges.filter(c => c.trend === "improved");
  const declinedCategories = categoryChanges.filter(c => c.trend === "declined");
  const stableCategories = categoryChanges.filter(c => c.trend === "stable");

  const journeyMessage = generateJourneyMessage(insight, improvedCategories.length, declinedCategories.length);

  return {
    insight,
    categoryChanges,
    improvedCategories,
    declinedCategories,
    stableCategories,
    journeyMessage,
  };
}

function generateJourneyMessage(
  insight: ProgressInsight, 
  improvedCount: number,
  _declinedCount: number
): string {
  const { trend, assessmentCount, daysSinceFirst } = insight;

  if (assessmentCount === 2) {
    if (trend === "improving") {
      return "Great start! Your second assessment shows improvement.";
    } else if (trend === "stable") {
      return "Consistent performance across your first two assessments.";
    } else {
      return "Your journey is just beginning. Focus on your improvement plan.";
    }
  }

  if (trend === "improving") {
    if (improvedCount >= 2) {
      return `Strong progress! You've improved in ${improvedCount} categories.`;
    }
    return "You're moving in the right direction. Keep building on your strengths.";
  }

  if (trend === "stable") {
    if (daysSinceFirst > 30) {
      return "Steady progress over time. Consider focusing on new skill areas.";
    }
    return "Maintaining your readiness level. Your improvement plan can help you grow.";
  }

  return "Readiness can fluctuate. Review your focus areas to get back on track.";
}

export function getScoreHistory(assessments: Assessment[]): { date: string; score: number }[] {
  return assessments
    .slice(0, 10)
    .reverse()
    .map(a => ({
      date: new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: a.score,
    }));
}
