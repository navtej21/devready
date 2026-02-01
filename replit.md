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
│   │   └── LoadingOverlay.tsx # Analysis loading state
│   ├── screens/               # App screens
│   │   ├── HomeScreen.tsx     # Dashboard with score overview
│   │   ├── AssessScreen.tsx   # Resume upload with category preview
│   │   ├── ResultsScreen.tsx  # Detailed transparent results
│   │   ├── ProfileScreen.tsx  # User settings and history
│   │   └── HistoryScreen.tsx  # Past assessments list
│   ├── navigation/            # React Navigation setup
│   ├── constants/theme.ts     # Design tokens and colors
│   └── lib/storage.ts         # AsyncStorage utilities with CategoryScore type
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

## Recent Changes

- Added transparent score breakdown by 6 skill categories
- Created ScoreBreakdown component with expandable category details
- Added HowWeAssess explainer section to Results screen
- Updated Assess screen to show "What We Evaluate" category preview
- Enhanced backend prompt for category-specific findings and explanations
- Strengths/gaps now reference which role expectation they relate to
