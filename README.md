<h1 align="center">🚀 DevReady</h1>
<p align="center"><strong>Developer Readiness Score App</strong></p>

<p align="center">
  Understand how ready you are for real-world developer roles — with transparent, actionable feedback.
</p>

<hr />

<h2>Overview</h2>
<p>
  <strong>DevReady</strong> is a mobile application that helps developers understand their career readiness
  compared to real industry role expectations. It analyzes resumes and provides personalized, explainable
  readiness scores for multiple developer roles.
</p>

<hr />

<h2>Key Features</h2>
<ul>
  <li><strong>Multi-Role Support:</strong> Backend, Full Stack, Frontend, Data Analyst / Data Scientist</li>
  <li><strong>Resume Analysis:</strong> Upload a resume file or paste resume text directly</li>
  <li><strong>Readiness Score:</strong> 0–100 score with levels (Early, Developing, Interview-Ready, Strong)</li>
  <li><strong>Transparent Scoring:</strong> Clear visibility into how each category contributes</li>
  <li><strong>Strengths & Gaps:</strong> Role-aligned breakdown tied to hiring expectations</li>
  <li><strong>Actionable Feedback:</strong> Concrete next steps for improvement</li>
  <li><strong>Private by Design:</strong> No public leaderboards, resume data not stored</li>
</ul>

<hr />

<h2>Transparency Features</h2>
<p>The app emphasizes explainability so users understand <strong>why</strong> they received their score.</p>

<h3>Score Breakdown by Category</h3>
<table>
  <thead>
    <tr>
      <th align="left">Category</th>
      <th align="left">Max Points</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Programming Languages</td><td>20</td></tr>
    <tr><td>Database Skills</td><td>20</td></tr>
    <tr><td>API Design</td><td>15</td></tr>
    <tr><td>DevOps & Cloud</td><td>15</td></tr>
    <tr><td>System Design</td><td>15</td></tr>
    <tr><td>Professional Experience</td><td>15</td></tr>
  </tbody>
</table>

<hr />

<h2>How We Assess</h2>
<ul>
  <li>Role-based expectations methodology</li>
  <li>Readiness level definitions</li>
  <li>Strength and gap identification</li>
  <li>Privacy commitment</li>
</ul>

<hr />

<h2>Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> React Native with Expo</li>
  <li><strong>Backend:</strong> Express.js with TypeScript</li>
  <li><strong>AI:</strong> OpenAI GPT (via Replit AI Integrations)</li>
  <li><strong>Storage:</strong> AsyncStorage (local) & PostgreSQL (cloud)</li>
  <li><strong>Styling:</strong> Custom theme with Montserrat & Inter fonts</li>
</ul>

<hr />

<h2>Project Structure</h2>
<pre>
client/
  components/
  screens/
  navigation/
  constants/
  lib/
server/
  routes.ts
  roles.ts
  index.ts
design_guidelines.md
</pre>

<hr />

<h2>API Endpoint</h2>
<h3>POST /api/analyze-resume</h3>

<pre>
Request:
{
  "fileName": "resume.pdf"
}
</pre>

<pre>
Response:
{
  "score": 65,
  "level": "Interview-Ready",
  "strengths": [],
  "gaps": [],
  "actions": [],
  "focusAreas": [],
  "topPriority": {},
  "scoringMethodology": "..."
}
</pre>

<hr />

<h2>Running the App</h2>
<ul>
  <li><strong>Backend:</strong> Express server on port 5000</li>
  <li><strong>Frontend:</strong> Expo dev server on port 8081</li>
  <li>Test using Expo Go or web preview</li>
</ul>

<hr />

<h2>Design System</h2>

<h3>Colors</h3>
<ul>
  <li>Primary: #2D6A4F</li>
  <li>Accent: #F77F00</li>
  <li>Background: #FAFAF9</li>
  <li>Success: #10B981</li>
  <li>Warning: #F59E0B</li>
  <li>Info: #3B82F6</li>
</ul>

<h3>Readiness Levels</h3>
<ul>
  <li>Early (0–25)</li>
  <li>Developing (26–50)</li>
  <li>Interview-Ready (51–75)</li>
  <li>Strong (76–100)</li>
</ul>

<hr />

<h2>Freemium Model</h2>
<h3>Free Tier</h3>
<ul>
  <li>1 assessment per month</li>
  <li>Limited results visibility</li>
  <li>Local storage only</li>
</ul>

<h3>Premium Tier</h3>
<ul>
  <li>Unlimited assessments</li>
  <li>Full transparency & breakdowns</li>
  <li>AI interview prep</li>
  <li>Learning resources</li>
  <li>Cloud sync</li>
</ul>

<hr />

<h2>RevenueCat Integration</h2>
<ul>
  <li>India: ₹99/month, ₹499/year</li>
  <li>International: $4.99/month, $29.99/year</li>
  <li>Automatic subscription management</li>
  <li>Restore purchases support</li>
</ul>

<hr />

<p align="center">
  <strong>DevReady — Know where you stand. Know what to do next.</strong>
</p>
