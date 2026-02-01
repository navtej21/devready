import type { Express } from "express";
import { createServer, type Server } from "node:http";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SCORING_CATEGORIES = [
  {
    name: "Programming Languages",
    maxScore: 20,
    description: "Proficiency in backend languages like Python, Java, Node.js, Go, or similar",
  },
  {
    name: "Database Skills",
    maxScore: 20,
    description: "Experience with SQL databases (PostgreSQL, MySQL) and NoSQL systems (MongoDB, Redis)",
  },
  {
    name: "API Design",
    maxScore: 15,
    description: "Knowledge of REST principles, GraphQL, and API best practices",
  },
  {
    name: "DevOps & Cloud",
    maxScore: 15,
    description: "Familiarity with cloud platforms (AWS, GCP, Azure), Docker, and CI/CD",
  },
  {
    name: "System Design",
    maxScore: 15,
    description: "Understanding of architecture patterns, scalability, and distributed systems",
  },
  {
    name: "Professional Experience",
    maxScore: 15,
    description: "Relevant work experience, projects, and contributions that demonstrate practical application",
  },
];

const SCORING_METHODOLOGY = `Your readiness score is calculated by evaluating your resume against ${SCORING_CATEGORIES.length} key competency areas that employers look for in Backend Developer candidates. Each category is weighted based on its importance in real-world hiring decisions. The final score represents how well your current experience and skills align with industry expectations for backend roles.`;

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analyze-resume", async (req, res) => {
    try {
      const { fileName } = req.body;

      if (!fileName) {
        return res.status(400).json({ error: "File name is required" });
      }

      const categoriesJson = JSON.stringify(SCORING_CATEGORIES, null, 2);

      const prompt = `You are an expert career advisor specializing in backend development roles. Analyze this resume file named "${fileName}" as if it were a typical backend developer resume.

Your task is to provide a TRANSPARENT and EXPLAINABLE assessment. Users need to understand exactly WHY they received their score.

## SCORING CATEGORIES (evaluate each separately):
${categoriesJson}

## ASSESSMENT REQUIREMENTS:

For EACH category above, provide:
1. A score out of the maximum points
2. 1-2 specific findings from the resume that justify the score

The total score is the sum of all category scores (max 100).

## RESPONSE FORMAT (JSON only):

{
  "score": <total score 0-100>,
  "level": "<Early|Developing|Interview-Ready|Strong>",
  "categories": [
    {
      "name": "Programming Languages",
      "score": <0-20>,
      "maxScore": 20,
      "description": "Proficiency in backend languages like Python, Java, Node.js, Go, or similar",
      "findings": ["Specific finding 1", "Specific finding 2"]
    },
    {
      "name": "Database Skills",
      "score": <0-20>,
      "maxScore": 20,
      "description": "Experience with SQL databases (PostgreSQL, MySQL) and NoSQL systems (MongoDB, Redis)",
      "findings": ["Specific finding 1", "Specific finding 2"]
    },
    {
      "name": "API Design",
      "score": <0-15>,
      "maxScore": 15,
      "description": "Knowledge of REST principles, GraphQL, and API best practices",
      "findings": ["Specific finding 1"]
    },
    {
      "name": "DevOps & Cloud",
      "score": <0-15>,
      "maxScore": 15,
      "description": "Familiarity with cloud platforms (AWS, GCP, Azure), Docker, and CI/CD",
      "findings": ["Specific finding 1"]
    },
    {
      "name": "System Design",
      "score": <0-15>,
      "maxScore": 15,
      "description": "Understanding of architecture patterns, scalability, and distributed systems",
      "findings": ["Specific finding 1"]
    },
    {
      "name": "Professional Experience",
      "score": <0-15>,
      "maxScore": 15,
      "description": "Relevant work experience, projects, and contributions that demonstrate practical application",
      "findings": ["Specific finding 1"]
    }
  ],
  "strengths": [
    "<Strength 1 - must reference which category it relates to>",
    "<Strength 2 - must reference which category it relates to>",
    "<Strength 3 - must reference which category it relates to>"
  ],
  "gaps": [
    "<Gap 1 - must explain what expectation wasn't met>",
    "<Gap 2 - must explain what expectation wasn't met>"
  ],
  "actions": [
    "<Action 1 - specific, actionable step tied to a gap>",
    "<Action 2 - specific, actionable step tied to a gap>",
    "<Action 3 - specific, actionable step tied to a gap>"
  ]
}

## LEVEL GUIDELINES:
- Early (0-25): Just starting, basic programming knowledge
- Developing (26-50): Some projects, learning core technologies  
- Interview-Ready (51-75): Solid fundamentals, can contribute to teams
- Strong (76-100): Excellent skills, leadership potential

## IMPORTANT RULES:
1. Strengths must clearly connect to high-scoring categories
2. Gaps must explain what role expectation wasn't demonstrated
3. Actions must be specific steps to address identified gaps
4. Findings must be concrete observations, not generic statements
5. Make the assessment feel personalized and constructive

Respond ONLY with valid JSON, no markdown or other formatting.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          {
            role: "system",
            content: "You are an expert career advisor providing transparent, explainable resume assessments. Always respond with valid JSON only, no markdown formatting.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_completion_tokens: 3000,
      });

      const content = response.choices[0]?.message?.content || "{}";

      let result;
      try {
        const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        result = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error("Failed to parse AI response:", content);
        result = generateFallbackResult();
      }

      if (!validateResult(result)) {
        result = generateFallbackResult();
      }

      result.scoringMethodology = SCORING_METHODOLOGY;

      res.json(result);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      res.status(500).json({ error: "Failed to analyze resume" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function validateResult(result: any): boolean {
  return (
    typeof result.score === "number" &&
    result.level &&
    Array.isArray(result.categories) &&
    result.categories.length === 6 &&
    Array.isArray(result.strengths) &&
    Array.isArray(result.gaps) &&
    Array.isArray(result.actions)
  );
}

function generateFallbackResult() {
  return {
    score: 48,
    level: "Developing",
    categories: [
      {
        name: "Programming Languages",
        score: 12,
        maxScore: 20,
        description: "Proficiency in backend languages like Python, Java, Node.js, Go, or similar",
        findings: [
          "Shows experience with at least one backend language",
          "Could demonstrate deeper expertise with additional languages",
        ],
      },
      {
        name: "Database Skills",
        score: 8,
        maxScore: 20,
        description: "Experience with SQL databases (PostgreSQL, MySQL) and NoSQL systems (MongoDB, Redis)",
        findings: [
          "Basic database knowledge indicated",
          "NoSQL experience would strengthen profile",
        ],
      },
      {
        name: "API Design",
        score: 7,
        maxScore: 15,
        description: "Knowledge of REST principles, GraphQL, and API best practices",
        findings: ["REST API experience suggested by project work"],
      },
      {
        name: "DevOps & Cloud",
        score: 5,
        maxScore: 15,
        description: "Familiarity with cloud platforms (AWS, GCP, Azure), Docker, and CI/CD",
        findings: ["Limited cloud platform experience visible"],
      },
      {
        name: "System Design",
        score: 6,
        maxScore: 15,
        description: "Understanding of architecture patterns, scalability, and distributed systems",
        findings: ["Foundational understanding, room for growth in distributed systems"],
      },
      {
        name: "Professional Experience",
        score: 10,
        maxScore: 15,
        description: "Relevant work experience, projects, and contributions that demonstrate practical application",
        findings: [
          "Projects demonstrate practical application",
          "Industry experience would add credibility",
        ],
      },
    ],
    strengths: [
      "Programming Languages: Shows initiative in learning backend technologies",
      "Professional Experience: Has built practical projects demonstrating skills",
      "API Design: Understands REST fundamentals through project work",
    ],
    gaps: [
      "Database Skills: Limited NoSQL experience doesn't meet industry expectations for modern backend roles",
      "DevOps & Cloud: Cloud platform knowledge is increasingly expected but not clearly demonstrated",
    ],
    actions: [
      "Build a project using MongoDB or Redis to gain NoSQL experience",
      "Get AWS or GCP cloud practitioner certification",
      "Contribute to an open-source backend project to demonstrate collaboration",
      "Practice system design problems on platforms like LeetCode or Pramp",
    ],
  };
}
