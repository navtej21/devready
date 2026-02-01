# Developer Readiness Score - Design Guidelines

## Brand Identity

**Purpose**: Empowering developers to understand career readiness through private, actionable assessment.

**Aesthetic Direction**: Editorial/Developer Hybrid
- Clean, data-driven interface with editorial sophistication
- Confident without being intimidating
- Feels like a trusted mentor, not a harsh evaluator
- Typography-first design with strategic use of data visualization

**Memorable Element**: Score visualization that feels empowering, not judgmental - uses progress rings and clear readiness levels (Early → Developing → Interview-Ready → Strong) with warm, encouraging colors.

## Navigation Architecture

**Root Navigation**: Tab Bar (3 tabs)
- **Home**: Dashboard with current readiness score and recent assessments
- **Assess**: Core action - upload resume and generate new assessment (center tab)
- **Profile**: Settings, assessment history, account management

**Auth**: Required
- SSO preferred: Apple Sign-In (iOS), Google Sign-In (Android)
- Include login/signup screens with privacy policy links
- Profile screen includes logout and delete account (nested in Settings > Account)

## Screen Specifications

### 1. Onboarding (Stack-Only Flow)
- **Purpose**: Introduce value proposition before signup
- **Layout**: 
  - 3 screens with hero illustrations
  - Skip button (top-right), Next/Get Started button (bottom)
  - Safe area: top = insets.top + Spacing.xl, bottom = insets.bottom + Spacing.xl
- **Content**:
  - Screen 1: "Understand Your Readiness" (illustration: developer-journey.png)
  - Screen 2: "Private & Explainable" (illustration: privacy-shield.png)
  - Screen 3: "Get Actionable Feedback" (illustration: growth-path.png)

### 2. Login/Signup
- **Layout**: Centered card with SSO buttons
- **Components**: Apple/Google sign-in buttons, privacy policy link
- Safe area: top = insets.top + Spacing.xl, bottom = insets.bottom + Spacing.xl

### 3. Home (Tab 1)
- **Purpose**: View current readiness score and assessment history
- **Header**: Transparent, title "Readiness", right button (info icon)
- **Layout**: ScrollView
  - Hero card: Large circular progress ring showing readiness score (0-100) with level label (Early/Developing/Interview-Ready/Strong)
  - Quick stats cards: Strengths count, Gaps count, Last assessed date
  - Recent assessments list (if any)
- **Empty State**: First-time users see empty-home.png illustration with "Start Your First Assessment" CTA
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

### 4. Assess (Tab 2 - Core Action)
- **Purpose**: Upload resume and generate readiness assessment
- **Header**: Transparent, title "New Assessment"
- **Layout**: ScrollView form
  - Instructions card
  - Resume upload area (drag-drop or file picker)
  - Submit button (disabled until file uploaded)
- **Post-Assessment**: Navigate to Results screen (modal)
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

### 5. Results (Modal from Assess)
- **Purpose**: Display detailed readiness breakdown
- **Header**: Custom header with close button (top-left), title "Your Readiness Score"
- **Layout**: ScrollView
  - Hero: Large score ring with level
  - Breakdown section: Strengths list (checkmarks), Gaps list (dash icons)
  - Action items section: "What to improve next" cards
  - Save/Export button (bottom)
- Safe area: top = Spacing.xl, bottom = insets.bottom + Spacing.xl

### 6. Profile (Tab 3)
- **Purpose**: Manage account and view settings
- **Header**: Default navigation header, title "Profile"
- **Layout**: ScrollView
  - Avatar + display name (editable)
  - Assessment history (navigates to list screen)
  - Settings sections: Notifications, Privacy, Account
  - Logout button (bottom)
- Safe area: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl

## Color Palette

**Primary**: #2D6A4F (Deep Forest Green) - trustworthy, growth-oriented
**Accent**: #F77F00 (Warm Orange) - action, encouragement
**Background**: #FAFAF9 (Warm Off-White)
**Surface**: #FFFFFF
**Text Primary**: #1C1C1E
**Text Secondary**: #6B7280
**Semantic**:
- Success (Strong): #10B981
- Warning (Developing): #F59E0B
- Info (Early): #3B82F6
- Neutral (Interview-Ready): #2D6A4F

## Typography

**Font**: Montserrat (Google Font) for headings, Inter for body
- **Display**: Montserrat Bold, 32pt
- **H1**: Montserrat Bold, 24pt
- **H2**: Montserrat SemiBold, 20pt
- **H3**: Montserrat SemiBold, 16pt
- **Body**: Inter Regular, 16pt
- **Caption**: Inter Regular, 14pt

## Visual Design

- Use Feather icons for navigation and actions
- Progress rings for score visualization (thick stroke, rounded caps)
- Cards: 12pt border radius, subtle border (1px #E5E7EB)
- Buttons: 8pt border radius, 56pt height for primary actions
- Floating Action Buttons (if used): shadowOffset (0, 2), shadowOpacity 0.10, shadowRadius 2

## Assets to Generate

**Required**:
1. **icon.png** - App icon: Developer profile with upward arrow/growth symbol
2. **splash-icon.png** - Launch screen: Simplified version of app icon
3. **empty-home.png** - Home screen empty state (no assessments yet) - clean illustration of resume document with checkmark
4. **developer-journey.png** - Onboarding screen 1 - developer at laptop with roadmap/path visual
5. **privacy-shield.png** - Onboarding screen 2 - shield icon with lock, represents private assessment
6. **growth-path.png** - Onboarding screen 3 - upward steps/growth visualization
7. **avatar-default.png** - Profile preset avatar - simple developer icon

**Style**: Minimal line-art illustrations in primary color (#2D6A4F) with warm orange (#F77F00) accents. Clean, professional, encouraging tone.