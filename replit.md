# DevReady - Developer Readiness Score App

## Overview

DevReady is a mobile application that helps developers understand their career readiness compared to role expectations. It analyzes resumes and provides personalized, transparent feedback for Backend Developer positions.

## Key Features

- **Resume Analysis**: Upload your resume to get a personalized readiness assessment
- **Readiness Score**: 0-100 score with levels (Early, Developing, Interview-Ready, Strong)
- **Transparent Scoring**: See exactly how each skill category contributes to your score
- **Strengths & Gaps**: Clear breakdown tied to specific role expectations
- **Actionable Feedback**: Specific next steps to improve your profile
- **Private by Design**: No public leaderboards, resume data not stored

## Transparency Features

The app emphasizes explainability so users understand WHY they received their score:

### Score Breakdown by Category
Each assessment shows points earned across 6 skill areas:
- **Programming Languages** (20 pts): Python, Java, Node.js, Go, etc.
- **Database Skills** (20 pts): SQL and NoSQL experience
- **API Design** (15 pts): REST, GraphQL, best practices
- **DevOps & Cloud** (15 pts): AWS/GCP/Azure, Docker, CI/CD
- **System Design** (15 pts): Architecture, scalability, distributed systems
- **Professional Experience** (15 pts): Projects, contributions, work history

### How We Assess Section
Expandable explainer that covers:
- Role-based expectations methodology
- Readiness level definitions
- How strengths and gaps are identified
- Privacy commitment

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Express.js with TypeScript
- **AI**: OpenAI GPT (via Replit AI Integrations) for resume analysis
- **Storage**: AsyncStorage for local data persistence
- **Styling**: Custom theme with Montserrat & Inter fonts

## Project Structure

```
├── client/                    # React Native Expo app
│   ├── components/            # Reusable UI components
│   │   ├── ScoreRing.tsx      # Animated circular score display
│   │   ├── ScoreBreakdown.tsx # Category-by-category score explanation
│   │   ├── HowWeAssess.tsx    # Methodology explainer component
│   │   ├── FeedbackItem.tsx   # Strength/gap/action item display
│   │   ├── StatCard.tsx       # Quick stat cards
│   │   ├── UploadArea.tsx     # Resume upload component
│   │   ├── LoadingOverlay.tsx # Analysis loading state
│   │   ├── FocusAreaCard.tsx  # Prioritized improvement area with actions
│   │   ├── TopPriorityCard.tsx # Highlight for #1 focus area
│   │   ├── ProgressSummary.tsx # Score trend and journey stats
│   │   └── CategoryProgress.tsx # Category-level improvement tracking
│   ├── screens/               # App screens
│   │   ├── HomeScreen.tsx     # Dashboard with score overview
│   │   ├── AssessScreen.tsx   # Resume upload with category preview
│   │   ├── ResultsScreen.tsx  # Detailed transparent results
│   │   ├── ProfileScreen.tsx  # User settings and history
│   │   └── HistoryScreen.tsx  # Past assessments list
│   ├── navigation/            # React Navigation setup
│   ├── constants/theme.ts     # Design tokens and colors
│   ├── lib/storage.ts         # AsyncStorage utilities with CategoryScore type
│   └── lib/progress.ts        # Progress calculation utilities
├── server/                    # Express backend
│   ├── routes.ts              # API with category-based scoring
│   └── index.ts               # Server setup
└── design_guidelines.md       # Design specifications
```

## API Endpoints

### POST /api/analyze-resume
Analyzes a resume and returns transparent readiness assessment.

**Request Body:**
```json
{
  "fileName": "resume.pdf"
}
```

**Response:**
```json
{
  "score": 65,
  "level": "Interview-Ready",
  "categories": [
    {
      "name": "Programming Languages",
      "score": 14,
      "maxScore": 20,
      "description": "Proficiency in backend languages...",
      "findings": ["Shows Python experience", "Node.js projects visible"]
    }
  ],
  "strengths": ["Programming Languages: Strong Python skills..."],
  "gaps": ["Database Skills: Limited NoSQL experience..."],
  "actions": ["Build a MongoDB project..."],
  "focusAreas": [
    {
      "category": "Database Skills",
      "priority": "high",
      "title": "Build NoSQL Experience",
      "description": "NoSQL databases are used in 70% of modern backend systems...",
      "effort": "quick-win",
      "actions": ["Complete MongoDB University course", "Add MongoDB to a project"]
    }
  ],
  "topPriority": {
    "title": "Build NoSQL Experience",
    "reason": "Highest-impact gap achievable in 2-4 weeks"
  },
  "scoringMethodology": "Your readiness score is calculated..."
}
```

## Running the App

The app uses two workflows:
- **Start Backend**: Runs the Express server on port 5000
- **Start Frontend**: Runs the Expo dev server on port 8081

Users can test the app by:
1. Scanning the QR code in Replit's URL bar menu with Expo Go
2. Using the web version in the browser

## Design System

### Colors
- Primary: #2D6A4F (Deep Forest Green)
- Accent: #F77F00 (Warm Orange)
- Background: #FAFAF9 (Warm Off-White)
- Success: #10B981
- Warning: #F59E0B
- Info: #3B82F6

### Readiness Levels
- Early (0-25): #3B82F6
- Developing (26-50): #F59E0B
- Interview-Ready (51-75): #2D6A4F
- Strong (76-100): #10B981

## Guided Improvement Features (v1.3.0)

The app now helps users answer "What should I focus on next?" with:

### Focus Areas
Prioritized improvement plan with 2-3 actionable areas:
- **Priority Level**: High, Medium, or Low impact on readiness
- **Effort Estimate**: Quick-win (1-4 weeks), Medium-term (1-3 months), Long-term (3+ months)
- **Specific Actions**: 2-3 concrete steps for each area

### Top Priority Highlight
The single most impactful thing to focus on first, prominently displayed on both Home and Results screens with clear reasoning.

### Quick Wins vs Long-Term Growth
Distinguishes between:
- Quick wins that can be achieved in weeks
- Medium-term goals requiring 1-3 months
- Long-term growth areas needing sustained effort

## Recent Changes

- **v1.4.0 - Progress Tracking**: Track readiness evolution over time with score trends, category-level improvements, visual timeline on History screen
- **v1.3.0 - Guided Improvement**: Added prioritized focus areas with effort/impact indicators, TopPriorityCard for Home screen, FocusAreaCard with expandable action steps
- **v1.2.0 - PDF Parsing**: Resume text extraction from PDF/Word/text files, personalized findings citing actual resume content
- **v1.1.0 - Transparency**: Score breakdown by 6 categories, HowWeAssess explainer, category-specific findings
