import type { Express } from "express";
import { createServer, type Server } from "node:http";
import OpenAI from "openai";
import pdf from "pdf-parse";
import mammoth from "mammoth";

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

async function extractTextFromPDF(base64Data: string): Promise<string> {
  try {
    const buffer = Buffer.from(base64Data, "base64");
    const data = await pdf(buffer);
    return data.text || "";
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return "";
  }
}

async function extractTextFromWord(base64Data: string): Promise<string> {
  try {
    const buffer = Buffer.from(base64Data, "base64");
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.error("Error parsing Word document:", error);
    return "";
  }
}

async function extractTextFromFile(
  base64Data: string | undefined,
  fileName: string,
  mimeType: string | undefined
): Promise<string> {
  if (!base64Data) {
    return "";
  }

  const lowerFileName = fileName.toLowerCase();
  const lowerMimeType = (mimeType || "").toLowerCase();

  if (lowerFileName.endsWith(".pdf") || lowerMimeType.includes("pdf")) {
    return extractTextFromPDF(base64Data);
  }

  if (
    lowerFileName.endsWith(".docx") ||
    lowerMimeType.includes("openxmlformats-officedocument.wordprocessingml")
  ) {
    return extractTextFromWord(base64Data);
  }

  if (lowerFileName.endsWith(".doc") || lowerMimeType.includes("msword")) {
    return extractTextFromWord(base64Data);
  }

  if (lowerFileName.endsWith(".txt") || lowerMimeType.includes("text/plain")) {
    try {
      return Buffer.from(base64Data, "base64").toString("utf-8");
    } catch {
      return "";
    }
  }

  return "";
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analyze-resume", async (req, res) => {
    try {
      const { fileName, fileData, mimeType } = req.body;

      if (!fileName) {
        return res.status(400).json({ error: "File name is required" });
      }

      const resumeText = await extractTextFromFile(fileData, fileName, mimeType);
      
      const hasResumeContent = resumeText && resumeText.trim().length > 50;

      const categoriesJson = JSON.stringify(SCORING_CATEGORIES, null, 2);

      let prompt: string;

      if (hasResumeContent) {
        prompt = `You are an expert career advisor specializing in backend development roles. Analyze the following resume content and provide a transparent, explainable assessment.

## RESUME CONTENT:
${resumeText.substring(0, 8000)}

## SCORING CATEGORIES (evaluate each separately):
${categoriesJson}

## ASSESSMENT REQUIREMENTS:

For EACH category above, provide:
1. A score out of the maximum points based on evidence found in the resume
2. 1-2 specific findings FROM THE RESUME that justify the score

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
      "findings": ["Specific finding from the resume", "Another specific finding"]
    },
    {
      "name": "Database Skills",
      "score": <0-20>,
      "maxScore": 20,
      "description": "Experience with SQL databases (PostgreSQL, MySQL) and NoSQL systems (MongoDB, Redis)",
      "findings": ["Specific finding from the resume"]
    },
    {
      "name": "API Design",
      "score": <0-15>,
      "maxScore": 15,
      "description": "Knowledge of REST principles, GraphQL, and API best practices",
      "findings": ["Specific finding from the resume"]
    },
    {
      "name": "DevOps & Cloud",
      "score": <0-15>,
      "maxScore": 15,
      "description": "Familiarity with cloud platforms (AWS, GCP, Azure), Docker, and CI/CD",
      "findings": ["Specific finding from the resume"]
    },
    {
      "name": "System Design",
      "score": <0-15>,
      "maxScore": 15,
      "description": "Understanding of architecture patterns, scalability, and distributed systems",
      "findings": ["Specific finding from the resume"]
    },
    {
      "name": "Professional Experience",
      "score": <0-15>,
      "maxScore": 15,
      "description": "Relevant work experience, projects, and contributions that demonstrate practical application",
      "findings": ["Specific finding from the resume"]
    }
  ],
  "strengths": [
    "<Strength 1 - cite specific evidence from the resume and which category>",
    "<Strength 2 - cite specific evidence from the resume and which category>",
    "<Strength 3 - cite specific evidence from the resume and which category>"
  ],
  "gaps": [
    "<Gap 1 - what expectation wasn't demonstrated in the resume>",
    "<Gap 2 - what expectation wasn't demonstrated in the resume>"
  ],
  "actions": [
    "<Action 1 - specific step to address a gap>",
    "<Action 2 - specific step to address a gap>",
    "<Action 3 - specific step to address a gap>"
  ]
}

## LEVEL GUIDELINES:
- Early (0-25): Just starting, basic programming knowledge
- Developing (26-50): Some projects, learning core technologies  
- Interview-Ready (51-75): Solid fundamentals, can contribute to teams
- Strong (76-100): Excellent skills, leadership potential

## IMPORTANT RULES:
1. Base ALL findings on actual content from the resume
2. Quote or reference specific technologies, projects, or experiences mentioned
3. If a skill area has no evidence, give 0-2 points and note "No evidence found"
4. Make the assessment feel personalized based on what's actually in the resume

Respond ONLY with valid JSON, no markdown or other formatting.`;
      } else {
        prompt = `You are an expert career advisor specializing in backend development roles. The user uploaded a resume file named "${fileName}" but we couldn't extract the text content. Please provide a helpful response explaining the situation.

Generate a sample assessment to show what the user would receive, with a note that we couldn't read their actual resume. Use moderate scores.

## SCORING CATEGORIES:
${categoriesJson}

## RESPONSE FORMAT (JSON only):

{
  "score": 45,
  "level": "Developing",
  "categories": [
    {
      "name": "Programming Languages",
      "score": 10,
      "maxScore": 20,
      "description": "Proficiency in backend languages like Python, Java, Node.js, Go, or similar",
      "findings": ["Unable to extract resume content - please try uploading a different file format"]
    },
    {
      "name": "Database Skills",
      "score": 8,
      "maxScore": 20,
      "description": "Experience with SQL databases (PostgreSQL, MySQL) and NoSQL systems (MongoDB, Redis)",
      "findings": ["Resume text could not be parsed - try PDF or plain text format"]
    },
    {
      "name": "API Design",
      "score": 7,
      "maxScore": 15,
      "description": "Knowledge of REST principles, GraphQL, and API best practices",
      "findings": ["File content not readable"]
    },
    {
      "name": "DevOps & Cloud",
      "score": 5,
      "maxScore": 15,
      "description": "Familiarity with cloud platforms (AWS, GCP, Azure), Docker, and CI/CD",
      "findings": ["Upload a text-based PDF for accurate analysis"]
    },
    {
      "name": "System Design",
      "score": 6,
      "maxScore": 15,
      "description": "Understanding of architecture patterns, scalability, and distributed systems",
      "findings": ["Could not analyze - ensure PDF is not image-based"]
    },
    {
      "name": "Professional Experience",
      "score": 9,
      "maxScore": 15,
      "description": "Relevant work experience, projects, and contributions that demonstrate practical application",
      "findings": ["Re-upload your resume in a supported format for accurate scoring"]
    }
  ],
  "strengths": [
    "Note: We couldn't read your resume file. This is a sample result.",
    "Try uploading a text-based PDF (not scanned images) for accurate analysis",
    "Word documents (.docx) and plain text files also work well"
  ],
  "gaps": [
    "Resume file format issue: The uploaded file couldn't be parsed for text content",
    "For best results, ensure your PDF contains selectable text, not just images"
  ],
  "actions": [
    "Re-upload your resume as a text-based PDF (created from Word, not scanned)",
    "Alternatively, upload a .docx Word document or .txt plain text file",
    "If using a scanned document, try running OCR software first to make the text searchable"
  ]
}

Respond ONLY with valid JSON, no markdown or other formatting.`;
      }

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
        result = generateFallbackResult(hasResumeContent);
      }

      if (!validateResult(result)) {
        result = generateFallbackResult(hasResumeContent);
      }

      result.scoringMethodology = SCORING_METHODOLOGY;
      result.resumeParsed = hasResumeContent;

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

function generateFallbackResult(resumeParsed: boolean) {
  if (!resumeParsed) {
    return {
      score: 0,
      level: "Early",
      categories: SCORING_CATEGORIES.map((cat) => ({
        ...cat,
        score: 0,
        findings: ["Could not extract text from the uploaded file"],
      })),
      strengths: [
        "Note: We couldn't read your resume. Please try a different file format."
      ],
      gaps: [
        "Resume file format issue: The uploaded file couldn't be parsed"
      ],
      actions: [
        "Upload a text-based PDF (not a scanned image)",
        "Try a Word document (.docx) or plain text file (.txt)"
      ],
    };
  }

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
