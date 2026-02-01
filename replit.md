# DevReady - Developer Readiness Score App

## Overview

DevReady is a mobile application that helps developers understand their career readiness compared to role expectations. It analyzes resumes and provides personalized feedback for Backend Developer positions.

## Key Features

- **Resume Analysis**: Upload your resume to get a personalized readiness assessment
- **Readiness Score**: 0-100 score with levels (Early, Developing, Interview-Ready, Strong)
- **Strengths & Gaps**: Clear breakdown of what you're doing well and what to improve
- **Actionable Feedback**: Specific next steps to improve your profile
- **Private by Design**: No public leaderboards or comparisons

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Express.js with TypeScript
- **AI**: OpenAI (via Replit AI Integrations) for resume analysis
- **Storage**: AsyncStorage for local data persistence
- **Styling**: Custom theme with Montserrat & Inter fonts

## Project Structure

```
├── client/                    # React Native Expo app
│   ├── components/            # Reusable UI components
│   │   ├── ScoreRing.tsx      # Animated circular score display
│   │   ├── FeedbackItem.tsx   # Strength/gap/action item display
│   │   ├── StatCard.tsx       # Quick stat cards
│   │   ├── UploadArea.tsx     # Resume upload component
│   │   └── LoadingOverlay.tsx # Analysis loading state
│   ├── screens/               # App screens
│   │   ├── HomeScreen.tsx     # Dashboard with score overview
│   │   ├── AssessScreen.tsx   # Resume upload and analysis
│   │   ├── ResultsScreen.tsx  # Detailed assessment results
│   │   ├── ProfileScreen.tsx  # User settings and history
│   │   └── HistoryScreen.tsx  # Past assessments list
│   ├── navigation/            # React Navigation setup
│   ├── constants/theme.ts     # Design tokens and colors
│   └── lib/storage.ts         # AsyncStorage utilities
├── server/                    # Express backend
│   ├── routes.ts              # API endpoints including resume analysis
│   └── index.ts               # Server setup
├── assets/images/             # App icons and illustrations
└── design_guidelines.md       # Design specifications
```

## API Endpoints

### POST /api/analyze-resume
Analyzes a resume and returns readiness assessment.

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
  "strengths": ["..."],
  "gaps": ["..."],
  "actions": ["..."]
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

- Initial MVP implementation with full assessment workflow
- Added OpenAI integration for resume analysis
- Implemented local storage for assessment history
- Created animated score ring component
- Built 3-tab navigation (Home, Assess, Profile)
