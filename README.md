# Magenta

> **Understand your application before you apply.**

Magenta is an AI-powered Job Application Clarity Platform. It helps job seekers understand how their resume actually relates to a job description and what an employer genuinely expects — without arbitrary ATS scores, match percentages, or hiring predictions.

---

## 🌟 Key Features

### 1. Feature 01 — Job Application Clarity (Primary)
- **Zero-Reupload Workflow**: Uses your saved, pre-analyzed resume profile automatically.
- **Evidence-Based Categorization**:
  - **Mandatory Requirements**: Items the employer explicitly marks as required, essential, or must-have.
  - **Preferred Skills**: Items marked as desirable, a plus, or nice-to-have.
  - **Unclear Requirements**: Vague expectations or tools mentioned without defined priority.
  - **Potential Contradictions**: Highlighting conflicting statements in the JD (e.g. entry-level titles demanding 4+ years of experience).
- **Resume Evidence Matching**:
  - Maps requirements directly to candidate resume evidence with verbatim quotes and explanations.
  - Classifies statuses into: `Evidence Found`, `Partial Evidence`, `Not Found in Resume`, and `Unclear`.
  - Clarifies that absence in a resume does *not* imply lack of candidate capability.
- **Recruiter Questions Generator**: Creates tactical, high-value clarifying questions to ask during recruiter screening.

### 2. Feature 02 — Personalized Job Discovery (Secondary)
- **Candidate-Specific Feed**: Recommendations tailored to your skills, technologies, experience level, and preferred roles.
- **Geographic Scope**: India-based opportunities, remote jobs available in India, and global remote roles.
- **Authentic Publication Timestamps**:
  - Filter by **Last 24 Hours** (default) or **Last 3 Days**.
  - Uses original job publication timestamps — never the date when the listing was fetched.
- **Transparent Relevance Engine**:
  - Categorizes jobs into `Relevant`, `Potentially Relevant`, and `Low Relevance`.
  - Displays transparent candidate alignment explanations, matching skills, and missing requirements.
- **Application Tracking**: Save jobs, mark as applied, track interview stages, or jump straight into Application Clarity with one click.

### 3. Frictionless Onboarding & Resume Management
- First-time onboarding with drag-and-drop PDF and DOCX parsing.
- Deep candidate profile extraction (Professional Profile, Technical Skills, Soft Skills, Work History, Projects, Education).
- Dedicated **My Resume** dashboard to view parsed profile details, replace resume, re-analyze, or remove stored documents.

---

## 🏗️ Architecture & Tech Stack

```text
Magenta V2/
├── client/                     # Frontend (React 19, JavaScript ES6+, Vite, Tailwind CSS v4, Locomotive Scroll)
│   ├── src/
│   │   ├── components/         # Reusable UI system (JobCard, Badge, Button, Navbar, etc.)
│   │   ├── context/            # AuthContext (JWT session management)
│   │   ├── hooks/              # Custom hooks (useAuth)
│   │   ├── layouts/            # MainLayout & AuthLayout
│   │   ├── pages/              # Landing, Auth, Onboarding, Dashboard, ApplicationClarity, Jobs, Resume
│   │   ├── services/           # Axios API services (auth, resume, application, jobs)
│   │   ├── App.jsx             # React Router DOM configuration
│   │   └── main.jsx
│   └── package.json
│
├── server/                     # Backend (Node.js, Express, MongoDB, Mongoose, AI Services)
│   ├── config/                 # MongoDB connection (with automatic in-memory fallback)
│   ├── controllers/            # Auth, Resume, Application Clarity, and Job controllers
│   ├── middleware/             # JWT auth, Multer file upload validation, Error handlers
│   ├── models/                 # User, Resume, Job, JobAnalysis, ApplicationAnalysis, SavedJob
│   ├── routes/                 # REST API endpoints
│   ├── services/
│   │   ├── ai/                 # Multi-provider AI engine (Gemini, OpenAI, intelligent local fallback)
│   │   ├── resume/             # PDF/DOCX text extraction & candidate profiling
│   │   ├── jobs/               # Remotive API adapter, Verified seed feed & Relevance engine
│   │   └── analysis/           # JD parsing & Application Clarity comparison service
│   ├── uploads/                # Secure local storage for uploaded resume files
│   ├── app.js                  # Express app setup (Helmet, CORS, Rate Limiting)
│   └── server.js               # Server bootstrap & background job ingestion
│
├── .env.example                # Documented configuration variables
├── package.json                # Root orchestrator (concurrent dev runners)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ (tested on Node v22)
- **npm**: v9+
- **MongoDB**: Optional. If no local or remote MongoDB instance is available, Magenta **automatically spins up an embedded in-memory MongoDB instance** so you can run the full application with zero setup!

---

### Installation

1. **Clone or open the repository folder**:
   ```bash
   cd "Magenta V2"
   ```

2. **Install all dependencies (Root, Server, and Client)**:
   ```bash
   npm run install:all
   ```
   *(Or run `npm install` inside both `server/` and `client/` directories)*

---

### Configuration (`server/.env`)

Create a `.env` file in the `server/` directory (a pre-configured one is provided):

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB (Optional: Leave as-is to use automatic embedded in-memory MongoDB)
MONGODB_URI=mongodb://localhost:27017/magenta

# JWT Authentication
JWT_SECRET=magenta_dev_super_secret_jwt_key_982347102938471

# AI Provider Configuration
# Options: gemini | openai | fallback
AI_PROVIDER=gemini
GEMINI_API_KEY=
OPENAI_API_KEY=
```

> **Note on AI Configuration:**
> If you provide a `GEMINI_API_KEY` or `OPENAI_API_KEY`, Magenta will use those LLMs for natural language extraction. If no API key is provided, Magenta uses its built-in **intelligent local NLP and heuristic engine** which produces structured, schema-validated profiles and clarity reports offline.

---

### Running the Application

You can start both the backend API server and frontend client concurrently with a single command from the root directory:

```bash
npm run dev
```

Or run them individually in separate terminals:

**Backend Server** (runs on `http://localhost:5000`):
```bash
cd server
npm run dev
```

**Frontend Client** (runs on `http://localhost:5173`):
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Automated E2E Tests

To run the complete end-to-end integration test suite:

```bash
cd server
node test-e2e.js
```

This verifies:
1. Health check & database connection
2. User registration & JWT generation
3. Document text extraction (PDF/DOCX)
4. AI candidate profiling & indexing in MongoDB
5. Personalized Job Discovery with 24h & 3d date filters
6. Saving jobs and updating application statuses
7. Application Clarity analysis: requirement categorization, resume evidence quotes, contradictions, and recruiter questions.

---

## 🔒 Security & Privacy
- Passwords hashed using `bcrypt` (10 salt rounds).
- Protected backend routes with JWT verification middleware.
- Resumes securely stored on server with size and format limits (PDF, DOCX).
- Strict Helmet security headers, CORS origin protection, and rate limiting.
- Resumes are never shared with external job providers or employers.
