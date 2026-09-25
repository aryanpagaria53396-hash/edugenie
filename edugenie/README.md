# EduGenie 🎓 &mdash; Intelligent Academic Learning Assistant

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

> **EduGenie** is a modern, high-performance web platform and AI learning companion designed for students and educators. It simplifies complex academic subjects, generates customized multiple-choice practice quizzes with instant answer verification, creates concise revision notes, and designs personalized zero-to-hero study roadmaps.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [System Architecture & Data Flow](#-system-architecture--data-flow)
- [Application Webflow & User Journey](#-application-webflow--user-journey)
- [Technology Stack](#-technology-stack)
- [API Endpoints Specification](#-api-endpoints-specification)
- [Getting Started & Installation](#-getting-started--installation)
  - [Prerequisites](#prerequisites)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables & API Key](#3-configure-environment-variables--api-key)
  - [4. Run the Development Server](#4-run-the-development-server)
  - [5. Production Build & Start](#5-production-build--start)
- [Where & How to Obtain Your Gemini API Key](#-where--how-to-obtain-your-gemini-api-key)
- [Project Directory Structure](#-project-directory-structure)
- [Testing & Verification Guide](#-testing--verification-guide)
- [Deployment](#-deployment)
- [Contributing & License](#-contributing--license)

---

## ✨ Key Features

1. **Instant Academic Q&A (`/qa`)**
   - Ask any factual, historical, mathematical, or scientific query.
   - Clean, typo-free Markdown formatting with proper indentation, bullet points, and highlighted equations.
   - Built-in one-click clipboard copying.

2. **Concept Explainer (`/explain`)**
   - Simplifies difficult topics (e.g., *Quantum Computing*, *Photosynthesis*, *XGBoost Machine Learning*) for students and beginners.
   - Uses relatable real-world analogies, conceptual breakdowns, and bulleted key takeaways.

3. **Text & Passage Summarizer (`/summarize`)**
   - Condenses lengthy textbook excerpts, research articles, or study notes.
   - Extracts essential exam revision points and definitions while cutting redundant filler.

4. **Interactive Quiz Generator (`/quiz`)**
   - Automatically formulates 3 multiple-choice questions (MCQs) with 4 options each from any topic or study paragraph.
   - Enforces structured JSON schema validation.
   - Interactive UI with live option selection, immediate correct/incorrect color indicators, celebratory confetti on perfection, and comprehensive explanations for every question.

5. **Adaptive Learning Roadmap (`/learn/recommendations`)**
   - Builds progressive, tiered learning paths from Beginner (Foundations) to Intermediate (Application) to Advanced (Mastery).
   - Provides estimated timelines, recommended books/videos/articles, and actionable study habits.

6. **Flexible Layouts & Developer Tools**
   - **All Tools (Single Page)**: Complete dashboard matching the all-in-one unified workspace.
   - **Individual Modes**: Focused tab-by-tab study workflow.
   - **Project Architecture**: Interactive Kanban board tracking all milestones, technical requirements, and system design specs.

---

## 🏛 System Architecture & Data Flow

EduGenie connects a reactive frontend with a resilient Node/Express backend that orchestrates calls to Google Gemini's multimodal reasoning models (`gemini-3.8-flash`, `gemini-3.5-flash-lite`, and fallback cascades).

```
                      ┌──────────────────────────────────────────────┐
                      │                 USER BROWSER                 │
                      │   (React 19 + Tailwind CSS + Lucide Icons)   │
                      └──────────────────────┬───────────────────────┘
                                             │
                                     HTTP GET / POST
                               (JSON & Query Parameters)
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │          EXPRESS FULL-STACK SERVER           │
                      │               (server.ts :3000)              │
                      ├──────────────────────────────────────────────┤
                      │  • Request Sanitization & Rate Handling      │
                      │  • Prompt Engineering & System Instructions  │
                      │  • JSON Schema Enforcement (Quiz Engine)     │
                      │  • Offline Academic Knowledge Base Fallback  │
                      └──────────────────────┬───────────────────────┘
                                             │
                     ┌───────────────────────┴───────────────────────┐
                     │                                               │
           [API Key Configured]                            [API Key Missing]
                     │                                               │
                     ▼                                               ▼
      ┌─────────────────────────────┐                 ┌─────────────────────────────┐
      │   @google/genai SDK v2.4    │                 │   Offline Knowledge Base    │
      │   • Primary: gemini-3.8-flash│                │   • Educational fallbacks   │
      │   • Fast: gemini-3.5-flash-lite               │   • Zero runtime crash      │
      │   • Fallback: gemini-flash-latest             │   • Deterministic samples   │
      └──────────────┬──────────────┘                 └──────────────┬──────────────┘
                     │                                               │
                     └───────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │       CLIENT-SIDE RENDERING & PARSING        │
                      │  • Marked.js Markdown-to-HTML parser         │
                      │  • Tailwind Typography (.prose formatting)   │
                      │  • Interactive Quiz Score Engine & Confetti  │
                      └──────────────────────────────────────────────┘
```

---

## 🗺 Application Webflow & User Journey

```
[Start: Student lands on EduGenie]
               │
               ├──► 1. All Tools Dashboard (Unified View)
               │         │
               │         ├──► Ask Question (e.g. "Which is the largest ocean?")
               │         │         └──► Formatted Answer with Bullets & Clean Fonts
               │         │
               │         ├──► Concept Explainer (e.g. "XGBoost Machine Learning")
               │         │         └──► Simple Analogies & Key Takeaways
               │         │
               │         ├──► Summarizer (Paste textbook excerpt)
               │         │         └──► High-yield revision bullet points
               │         │
               │         ├──► Quiz Generator (e.g. "Photosynthesis")
               │         │         └──► 3 Interactive MCQs ──► Submit ──► Score + Confetti
               │         │
               │         └──► Roadmap Advisor (e.g. "Full Stack Web Development")
               │                   └──► Beginner ➔ Intermediate ➔ Advanced Timeline
               │
               ├──► 2. Individual Study Modes (Tabbed Interface)
               │         └──► Distraction-free single tool focus
               │
               └──► 3. Project Architecture (Interactive Kanban)
                         └──► View milestone completion, technical deliverables & API specs
```

---

## 💻 Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.0.1` | Declarative UI, state management, component modularity |
| **Language** | TypeScript | `^7.0.2` | End-to-end static type safety and maintainability |
| **Styling & Design** | Tailwind CSS | `^4.3.3` | Modern utility-first CSS with custom `.prose` typography |
| **Icons & Visuals** | Lucide React | `^0.546.0` | Crisp SVG iconography for UI status and controls |
| **Animations & Confetti** | Canvas Confetti | `^1.9.4` | Gamified feedback celebrations on quiz completion |
| **Markdown Parser** | Marked | `^18.0.14` | Converts AI markdown responses into semantic HTML |
| **Backend Runtime** | Node.js + Express | `^4.21.2` | RESTful API routing, proxying, and static serving |
| **Dev Execution** | tsx | `^4.21.0` | Zero-configuration TypeScript server execution |
| **Build Tool** | Vite | `^8.3.0` | Ultra-fast HMR and optimized production bundles |
| **AI Engine** | `@google/genai` | `^2.4.0` | Official Google GenAI SDK for Gemini models |

---

## 🔌 API Endpoints Specification

All endpoints support both **GET** (with URL query parameters) and **POST** (with JSON body) for maximum flexibility:

### 1. Academic Q&A
- **Endpoint**: `/qa` or `/api/qa`
- **Method**: `GET` or `POST`
- **Request Body (POST)**:
  ```json
  { "question": "Which is the largest ocean on Earth?" }
  ```
- **Response**:
  ```json
  {
    "answer": "The largest ocean on Earth is the Pacific Ocean...\n\n- Massive Size: Over 60M sq miles\n- Record Depth: Mariana Trench",
    "model": "gemini-3.8-flash"
  }
  ```

### 2. Concept Explainer
- **Endpoint**: `/explain` or `/api/explain`
- **Method**: `GET` or `POST`
- **Request Body (POST)**:
  ```json
  { "topic": "XGBoost Machine Learning" }
  ```
- **Response**:
  ```json
  {
    "topic": "XGBoost Machine Learning",
    "explanation": "Imagine you are trying to guess the weight of an object...",
    "model": "gemini-3.5-flash-lite"
  }
  ```

### 3. Summarizer
- **Endpoint**: `/summarize` or `/api/summarize`
- **Method**: `GET` or `POST`
- **Request Body (POST)**:
  ```json
  { "text": "The Industrial Revolution began in Great Britain in the late 18th century..." }
  ```
- **Response**:
  ```json
  {
    "summary": "Key Takeaways:\n- What: Transition to modern manufacturing\n- When: 1760-1840",
    "model": "gemini-3.8-flash"
  }
  ```

### 4. Quiz Generator
- **Endpoint**: `/quiz` or `/api/quiz`
- **Method**: `GET` or `POST`
- **Request Body (POST)**:
  ```json
  { "text": "Solar System and Planets" }
  ```
- **Response**:
  ```json
  {
    "quiz": [
      {
        "question": "Which planet is known as the Red Planet?",
        "options": ["Venus", "Mars", "Jupiter", "Saturn"],
        "answer": "Mars",
        "explanation": "Iron minerals in Martian soil oxidize, making it appear reddish."
      }
    ],
    "model": "gemini-3.8-flash"
  }
  ```

### 5. Adaptive Learning Recommendations
- **Endpoint**: `/learn/recommendations` or `/api/learn/recommendations`
- **Method**: `GET` or `POST`
- **Request Body (POST)**:
  ```json
  { "topic": "Machine Learning Fundamentals" }
  ```
- **Response**:
  ```json
  {
    "topic": "Machine Learning Fundamentals",
    "recommendation": "## Learning Roadmap...\n### Stage I: Foundations (1-2 weeks)...",
    "model": "gemini-3.8-flash"
  }
  ```

---

## 🚀 Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) version **18.x or 20.x+** installed.
- [npm](https://www.npmjs.com/) (bundled with Node.js) or `pnpm` / `yarn`.
- A Google account to create a **Gemini API Key** (free tier available).

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/edugenie-learning-assistant.git
cd edugenie-learning-assistant
```

---

### 2. Install Dependencies
```bash
npm install
```

---

### 3. Configure Environment Variables & API Key

Create a `.env` file in the root directory of the project:

```bash
# On Linux/macOS:
cp .env.example .env

# On Windows (Command Prompt):
copy .env.example .env
```

Open the newly created `.env` file and insert your Google Gemini API key:

```env
# Google Gemini API Key
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY_HERE"

# Server Port (default 3000)
PORT=3000
```

> ⚠️ **Important Security Note**: The `.env` file contains private credentials. It is already added to `.gitignore` so your secret key will never be committed to public GitHub repositories.

---

### 4. Run the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

### 5. Production Build & Start
To compile the frontend and run the production Express server:
```bash
# 1. Build optimized static assets
npm run build

# 2. Start the production server
npm start
```

---

## 🔑 Where & How to Obtain Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click on the blue **"Get API key"** button in the left sidebar or top navigation.
4. Click **"Create API key"** (you can attach it to an existing Google Cloud project or create a new one instantly with 1 click).
5. Copy the generated API key string (starts with `AIza...` or similar).
6. Paste it into your `.env` file:
   ```env
   GEMINI_API_KEY="AIzaSyYourGeneratedSecretKeyHere"
   ```
7. Restart your development server (`npm run dev`) to apply the changes.

---

## 📂 Project Directory Structure

```text
├── .env.example                # Example environment configuration template
├── .gitignore                  # Git ignore rules (.env, node_modules, dist)
├── index.html                  # HTML5 entry point with responsive viewport
├── metadata.json               # Project manifest and AI Studio capabilities
├── package.json                # Project dependencies, scripts, and engine info
├── server.ts                   # Express server, Gemini client cascade & API routes
├── tsconfig.json               # TypeScript compiler configuration
├── tsconfig.node.json          # Node-specific TypeScript compiler settings
├── vite.config.ts              # Vite configuration with React & Tailwind plugins
│
└── src/                        # Frontend React Application Source
    ├── App.tsx                 # Root application component with layout views
    ├── index.css               # Global Tailwind CSS and .prose typography styles
    ├── main.tsx                # React DOM client bootstrap
    ├── types.ts                # Shared TypeScript interfaces & types
    │
    └── components/             # Reusable UI Feature Modules
        ├── ApiKeyModal.tsx     # API status & configuration modal
        ├── ExplainModule.tsx   # Concept Explainer module with analogies
        ├── Header.tsx          # Sticky top bar with brand & view navigation
        ├── LearningPathModule.tsx # Adaptive Zero-to-Hero roadmap generator
        ├── ProjectShowcase.tsx # Architecture viewer & interactive Kanban board
        ├── QAModule.tsx        # Academic Q&A module with markdown rendering
        ├── QuizModule.tsx      # MCQ quiz generator with live scoring & confetti
        ├── ScenariosBar.tsx    # One-click quick test scenarios
        └── SummarizeModule.tsx # Textbook & note summarizer module
```

---

## 🧪 Testing & Verification Guide

You can test every endpoint directly using `curl` or Postman:

#### Test Health & API Status:
```bash
curl http://localhost:3000/api/status
```

#### Test Academic Q&A:
```bash
curl -X POST http://localhost:3000/qa \
  -H "Content-Type: application/json" \
  -d '{"question":"What causes Rayleigh scattering?"}'
```

#### Test Concept Explainer:
```bash
curl -X POST http://localhost:3000/explain \
  -H "Content-Type: application/json" \
  -d '{"topic":"XGBoost Machine Learning"}'
```

#### Test Quiz Generator (Structured JSON):
```bash
curl -X POST http://localhost:3000/quiz \
  -H "Content-Type: application/json" \
  -d '{"text":"Pythagorean Theorem"}'
```

---

## 🌐 Deployment

EduGenie is ready to deploy on any modern cloud hosting provider:

- **Google Cloud Run / Render / Railway**:
  Set environment variables `GEMINI_API_KEY` and `PORT=3000` in the provider's dashboard. Set build command to `npm run build` and start command to `npm start`.
- **Vercel / Netlify**:
  Deploy the frontend build output in `/dist` and connect the API routes as serverless functions.

---

## 📄 License & Attribution

This project is built for educational excellence and academic empowerment. Distributed under the **MIT License**.
