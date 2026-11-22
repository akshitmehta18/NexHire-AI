# 🚀 NexHire AI — Next-Gen Intelligent Career Acceleration & Hiring Ecosystem

<div align="center">

![NexHire AI Banner](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80)

**Land your dream engineering role faster with real-time AI voice mock interviews, ATS resume diagnostics, verified skill badges, and direct employer hiring.**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js&style=for-the-badge)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.1-blue?logo=react&style=for-the-badge)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&style=for-the-badge)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css&style=for-the-badge)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

[Explore Live Roles](#-features) • [Try Mock Interview](#-ai-voice-mock-interview-simulator) • [Scan ATS Resume](#-ai-resume-ats-scanner--optimizer) • [Quickstart](#-getting-started)

</div>

---

## 🌟 Overview

**NexHire AI** is a full-featured, production-ready career platform that unifies intelligent job discovery, voice-enabled AI technical interview simulations, automated resume ATS screening, and adaptive skill assessments.

Engineered with modern **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, and modern AI integration, NexHire AI solves the disconnect between job seekers and hiring teams by providing immediate, actionable preparation tools alongside verified job postings.

---

## ⚡ Core Features

### 💼 1. Intelligent Job Discovery & Live Board
- **Multi-Source Aggregation:** Blends Remotive remote API, curated enterprise seed jobs (Google, Stripe, OpenAI, Vercel, Microsoft, Datadog), and local employer-published roles.
- **Granular Filtering:** Real-time search across job titles, tech stack tags (React, Next.js, Python, Kubernetes), work environment (100% Remote, On-Site, Hybrid), and experience tiers (Entry, Mid, Senior, Lead).
- **One-Click Quick Apply:** In-modal application form with prefilled candidate profiles, cover letter builder, and resume attachment.
- **Save & Track:** Instant bookmarking and application status board (*Applied, Under Review, Offer*).

### 🎙️ 2. AI Voice Mock Interview Simulator
- **Neural Speech Synthesis:** Listens and speaks questions aloud naturally using browser Web Speech APIs.
- **Real-Time Microphone Transcription:** Speak your answers directly via speech-to-text or type in the interactive workspace.
- **Role & Seniority Packs:** Specialized technical and behavioral rubrics for Frontend, Backend, Full-Stack, Distributed Systems, and Amazon Leadership STAR scenarios.
- **4-Pillar Evaluation Rubric:** Instant scorecard measuring *Technical Depth, Problem Solving, Communication Clarity,* and *STAR Method Impact*.
- **Printable Report Cards:** Download or print candidate performance scorecards to track growth.

### 📄 3. AI Resume ATS Scanner & Optimizer
- **Beat the Recruiter Filter:** 75% of resumes are discarded by automated Applicant Tracking Systems (Greenhouse, Lever, Workday) before human review.
- **Instant Compatibility Diagnostics:** Generates an ATS match percentage (0 - 100%) against target role requirements.
- **Keyword Gap Analysis:** Highlights detected high-impact keywords vs missing critical competencies.
- **Action-Verb Re-Writer:** Transforms weak, passive duty statements into quantified impact bullet points (e.g., *"Optimized PostgreSQL indexes, slashing P99 API latency from 650ms to 92ms across 2M daily requests"*).

### 🧠 4. Adaptive Skill Assessments & Credentialing
- **12+ Tech Domains:** Timed interactive assessments for JavaScript, TypeScript, React, Python, System Design, SQL, Docker, and Cloud.
- **Dynamic Question Engine:** Combines LLM generation (Groq/Gemini) with vetted fallback question banks so tests always load instantly.
- **Official Skill Certificates:** Candidates scoring 80% or above earn verified badges and downloadable certificates for their portfolio.

### 📚 5. Top Tech Company PYQ Archive
- **Real Interview Archives:** 40+ curated questions asked at Google, Amazon, Microsoft, Meta, Apple, Netflix, and TCS.
- **Multi-Category Coverage:** Data Structures & Algorithms, System Architecture, Behavioral STAR, and Technical Aptitude.
- **Interactive Practice Mode:** Self-scoring, hint reveals, and step-by-step logic explanations.

### ✨ 6. AI Career Mentor & 12-Week Roadmaps
- **Strategic Advisory:** Ask strategic questions on career transitions, salary negotiations, and engineering leveling.
- **Structured 12-Week Curriculums:** Checkbox milestone roadmaps for Full-Stack Next.js and AI/ML Specialists.

### 🏢 7. Employer Portal & Live Job Preview
- **Interactive Job Builder:** Draft postings with a live candidate preview card updating in real time.
- **Compensation & Tagging:** Multi-currency salary ranges and customizable skill badges.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 15.5 (App Router, Server & Client Components) |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Radix UI Primitives |
| **State & Auth** | Custom Auth Provider with LocalStorage persistence & 1-Click Demo Accounts |
| **Audio / Speech** | Web Speech API (SpeechSynthesis & webkitSpeechRecognition) |
| **AI Layer** | Groq SDK (Llama 3.3 70B), Google Gemini 2.0 Flash, Vercel AI SDK |
| **Database** | Neon Serverless PostgreSQL with auto-provisioning & resilient in-memory fallback |
| **Styling** | Glassmorphism, CSS variable color tokens, Tailwind Animate, Lucide Icons |
| **Notifications** | Sonner Toaster |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v20.0.0` or higher
- npm, yarn, or pnpm

### 1. Clone & Install Dependencies
\`\`\`bash
git clone https://github.com/akshitmehta18/NexHire-AI.git
cd NexHire-AI
npm install
\`\`\`

### 2. Environment Setup (Optional)
The platform is designed with resilient in-memory fallback stores and rich seed banks, so **it runs immediately out of the box without any mandatory API keys**.

To connect live production services, copy `.env.example` to `.env.local`:
\`\`\`bash
# PostgreSQL Database (Optional - Neon Serverless)
DATABASE_URL="postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"

# AI Inference (Optional - for dynamic LLM quiz and mentorship generation)
GROQ_API_KEY="gsk_..."
GEMINI_API_KEY="AIzaSy..."

# Voice Agent (Optional - Vapi AI)
NEXT_PUBLIC_VAPI_WEB_TOKEN=""
NEXT_PUBLIC_VAPI_WORKFLOW_ID=""
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
\`\`\`bash
npm run build
npm run start
\`\`\`

---

## 👥 Instant 1-Click Demo Logins

No registration required to test all platform features! On `/auth/login`, click:
- **Job Seeker Demo:** Instant sign-in as *Alex Chen (Software Engineer)* with sample applications and quiz history.
- **Employer Demo:** Instant sign-in as *Sarah Recruiter (TechCorp)* with job posting permissions.

---

## 📄 License

Distributed under the MIT License. See \`LICENSE\` for more details.

---

<div align="center">
Built with ❤️ by <strong>Akshit Mehta</strong>
</div>
