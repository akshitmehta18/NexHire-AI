import { INITIAL_JOBS, INITIAL_PYQS, JobItem, PYQItem } from "@/constants/seed-data";

export interface Job {
  id: number;
  title: string;
  company: string;
  location?: string;
  job_type?: string;
  salary_min?: number;
  salary_max?: number;
  salary?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  posted_by?: string;
  candidate_required_location?: string;
  url?: string;
  company_logo?: string;
  tags?: string[];
  isLocalJob?: boolean;
  contactEmail?: string;
  experienceLevel?: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  user_email: string;
  full_name: string;
  phone?: string;
  resume_url?: string;
  cover_letter?: string;
  experience_years?: number;
  skills?: string;
  status?: string;
  created_at: string;
}

export interface QuizResult {
  id: number;
  user_email: string;
  topic: string;
  total_questions: number;
  correct_answers: number;
  time_taken?: number;
  score_percentage: number;
  quiz_data: any;
  created_at: string;
}

export interface PYQ {
  id: number;
  company: string;
  category: string;
  question: string;
  options?: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
  year?: number;
  created_at: string;
}

export interface AIGuidanceSession {
  id: number;
  user_email: string;
  topic?: string;
  question: string;
  ai_response: string;
  created_at: string;
}

// In-Memory Storage Fallback with Rich Initial Seed
let memoryJobs: Job[] = INITIAL_JOBS.map((j) => ({
  id: j.id,
  title: j.title,
  company: j.company,
  location: j.location,
  job_type: j.job_type,
  salary: j.salary,
  description: j.description,
  requirements: j.requirements,
  benefits: j.benefits,
  posted_by: "system",
  candidate_required_location: j.candidate_required_location,
  url: j.url,
  tags: j.tags,
  isLocalJob: j.isLocalJob,
  contactEmail: j.contactEmail,
  experienceLevel: j.experienceLevel,
  created_at: j.publication_date,
  updated_at: j.publication_date,
}));

let memoryPYQs: PYQ[] = INITIAL_PYQS.map((p) => ({
  id: p.id,
  company: p.company,
  category: p.category,
  question: p.question,
  options: p.options,
  correct_answer: p.correct_answer,
  explanation: p.explanation,
  difficulty: p.difficulty,
  year: p.year,
  created_at: new Date().toISOString(),
}));

let memoryApplications: Application[] = [];
let memoryQuizResults: QuizResult[] = [];
let memoryGuidanceSessions: AIGuidanceSession[] = [];

// Lazy database connection function
async function getNeonClient() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.trim().length === 0 || dbUrl.includes("dummy") || dbUrl.includes("placeholder")) {
    return null;
  }
  try {
    const { neon } = await import("@neondatabase/serverless");
    return neon(dbUrl);
  } catch (err) {
    console.warn("Neon database unavailable, using resilient in-memory store:", err);
    return null;
  }
}

// ===================== Job functions =====================
export async function createJob(job: Omit<Job, "id" | "created_at" | "updated_at">): Promise<Job> {
  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS jobs (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          company TEXT NOT NULL,
          location TEXT,
          job_type TEXT,
          salary_min NUMERIC,
          salary_max NUMERIC,
          description TEXT,
          requirements TEXT,
          benefits TEXT,
          posted_by TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      const result = await sql`
        INSERT INTO jobs (title, company, location, job_type, salary_min, salary_max, description, requirements, benefits, posted_by)
        VALUES (${job.title}, ${job.company}, ${job.location || ""}, ${job.job_type || ""}, ${job.salary_min || null}, ${job.salary_max || null}, ${job.description || ""}, ${job.requirements || ""}, ${job.benefits || ""}, ${job.posted_by || ""})
        RETURNING *
      `;
      return result[0] as Job;
    } catch (e) {
      console.warn("Database query failed, falling back to memory store:", e);
    }
  }

  const newJob: Job = {
    ...job,
    id: Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  memoryJobs = [newJob, ...memoryJobs];
  return newJob;
}

export async function getJobs(limit = 50): Promise<Job[]> {
  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS jobs (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          company TEXT NOT NULL,
          location TEXT,
          job_type TEXT,
          salary_min NUMERIC,
          salary_max NUMERIC,
          description TEXT,
          requirements TEXT,
          benefits TEXT,
          posted_by TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
      `;
      const result = await sql`
        SELECT * FROM jobs 
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `;
      if (result && result.length > 0) {
        return result as Job[];
      }
    } catch (e) {
      console.warn("Neon jobs query failed, serving memory jobs:", e);
    }
  }
  return memoryJobs.slice(0, limit);
}

export async function getJobById(id: number): Promise<Job | undefined> {
  const sql = await getNeonClient();
  if (sql) {
    try {
      const result = await sql`SELECT * FROM jobs WHERE id = ${id}`;
      if (result && result.length > 0) {
        return result[0] as Job;
      }
    } catch (e) {
      console.warn("Error fetching job from db, searching memory:", e);
    }
  }
  return memoryJobs.find((j) => j.id === id);
}

// ===================== Application functions =====================
export async function createApplication(application: Omit<Application, "id" | "created_at">): Promise<Application> {
  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS applications (
          id SERIAL PRIMARY KEY,
          job_id INT,
          user_email TEXT NOT NULL,
          full_name TEXT NOT NULL,
          phone TEXT,
          resume_url TEXT,
          cover_letter TEXT,
          experience_years INT,
          skills TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      const result = await sql`
        INSERT INTO applications (job_id, user_email, full_name, phone, resume_url, cover_letter, experience_years, skills)
        VALUES (${application.job_id}, ${application.user_email}, ${application.full_name}, ${application.phone || ""}, ${application.resume_url || ""}, ${application.cover_letter || ""}, ${application.experience_years || 0}, ${application.skills || ""})
        RETURNING *
      `;
      return result[0] as Application;
    } catch (e) {
      console.warn("Application db save error, fallback to memory:", e);
    }
  }

  const newApp: Application = {
    ...application,
    id: Date.now(),
    status: "submitted",
    created_at: new Date().toISOString(),
  };
  memoryApplications = [newApp, ...memoryApplications];
  return newApp;
}

export async function getUserApplications(userEmail: string) {
  const sql = await getNeonClient();
  if (sql) {
    try {
      const result = await sql`
        SELECT a.*, j.title as job_title, j.company as job_company
        FROM applications a
        LEFT JOIN jobs j ON a.job_id = j.id
        WHERE a.user_email = ${userEmail}
        ORDER BY a.created_at DESC
      `;
      return result;
    } catch (e) {
      console.warn("Error getting user applications:", e);
    }
  }
  return memoryApplications.filter((a) => a.user_email === userEmail);
}

// ===================== Quiz functions =====================
export async function saveQuizResult(result: Omit<QuizResult, "id" | "created_at">): Promise<QuizResult> {
  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS quiz_results (
          id SERIAL PRIMARY KEY,
          user_email TEXT NOT NULL,
          topic TEXT NOT NULL,
          total_questions INT NOT NULL,
          correct_answers INT NOT NULL,
          time_taken INT,
          score_percentage NUMERIC NOT NULL,
          quiz_data JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      const dbResult = await sql`
        INSERT INTO quiz_results (user_email, topic, total_questions, correct_answers, time_taken, score_percentage, quiz_data)
        VALUES (${result.user_email}, ${result.topic}, ${result.total_questions}, ${result.correct_answers}, ${result.time_taken || 0}, ${result.score_percentage}, ${JSON.stringify(result.quiz_data)})
        RETURNING *
      `;
      return dbResult[0] as QuizResult;
    } catch (e) {
      console.warn("Quiz result db save failed:", e);
    }
  }

  const newResult: QuizResult = {
    ...result,
    id: Date.now(),
    created_at: new Date().toISOString(),
  };
  memoryQuizResults = [newResult, ...memoryQuizResults];
  return newResult;
}

export async function getUserQuizResults(userEmail: string): Promise<QuizResult[]> {
  const sql = await getNeonClient();
  if (sql) {
    try {
      const result = await sql`
        SELECT * FROM quiz_results 
        WHERE user_email = ${userEmail}
        ORDER BY created_at DESC
      `;
      return result as QuizResult[];
    } catch (e) {
      console.warn("Error getting user quiz results:", e);
    }
  }
  return memoryQuizResults.filter((r) => r.user_email === userEmail);
}

// ===================== PYQ functions =====================
export async function getPYQs(company?: string, category?: string, limit = 25): Promise<PYQ[]> {
  const sql = await getNeonClient();
  if (sql) {
    try {
      if (company && category && company !== "all" && category !== "all") {
        const result = await sql`
          SELECT * FROM pyqs WHERE company = ${company} AND category = ${category}
          LIMIT ${limit}
        `;
        if (result.length > 0) return result as PYQ[];
      } else if (company && company !== "all") {
        const result = await sql`
          SELECT * FROM pyqs WHERE company = ${company}
          LIMIT ${limit}
        `;
        if (result.length > 0) return result as PYQ[];
      } else if (category && category !== "all") {
        const result = await sql`
          SELECT * FROM pyqs WHERE category = ${category}
          LIMIT ${limit}
        `;
        if (result.length > 0) return result as PYQ[];
      } else {
        const result = await sql`SELECT * FROM pyqs LIMIT ${limit}`;
        if (result.length > 0) return result as PYQ[];
      }
    } catch (e) {
      console.warn("Database pyq fetch error, falling back to seed PYQs:", e);
    }
  }

  let filtered = [...memoryPYQs];
  if (company && company !== "all") {
    filtered = filtered.filter((p) => p.company.toLowerCase() === company.toLowerCase());
  }
  if (category && category !== "all") {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  return filtered.slice(0, limit);
}

export async function getCompanies(): Promise<string[]> {
  const sql = await getNeonClient();
  if (sql) {
    try {
      const result = await sql`SELECT DISTINCT company FROM pyqs ORDER BY company`;
      if (result && result.length > 0) {
        return result.map((r: any) => r.company);
      }
    } catch (e) {
      console.warn("Database getCompanies failed:", e);
    }
  }
  const companies = Array.from(new Set(memoryPYQs.map((p) => p.company)));
  return companies.sort();
}

export async function getCategories(company?: string): Promise<string[]> {
  const sql = await getNeonClient();
  if (sql) {
    try {
      if (company && company !== "all") {
        const result = await sql`SELECT DISTINCT category FROM pyqs WHERE company = ${company} ORDER BY category`;
        if (result.length > 0) return result.map((r: any) => r.category);
      }
      const result = await sql`SELECT DISTINCT category FROM pyqs ORDER BY category`;
      if (result.length > 0) return result.map((r: any) => r.category);
    } catch (e) {
      console.warn("Database getCategories failed:", e);
    }
  }

  let pool = memoryPYQs;
  if (company && company !== "all") {
    pool = pool.filter((p) => p.company.toLowerCase() === company.toLowerCase());
  }
  const categories = Array.from(new Set(pool.map((p) => p.category)));
  return categories.sort();
}

// ===================== AI Guidance functions =====================
export async function saveAIGuidanceSession(session: Omit<AIGuidanceSession, "id" | "created_at">): Promise<AIGuidanceSession> {
  const sql = await getNeonClient();
  if (sql) {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS ai_guidance_sessions (
          id SERIAL PRIMARY KEY,
          user_email TEXT NOT NULL,
          topic TEXT,
          question TEXT NOT NULL,
          ai_response TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `;
      const result = await sql`
        INSERT INTO ai_guidance_sessions (user_email, topic, question, ai_response)
        VALUES (${session.user_email}, ${session.topic || ""}, ${session.question}, ${session.ai_response})
        RETURNING *
      `;
      return result[0] as AIGuidanceSession;
    } catch (e) {
      console.warn("Guidance session db save error:", e);
    }
  }

  const newSession: AIGuidanceSession = {
    ...session,
    id: Date.now(),
    created_at: new Date().toISOString(),
  };
  memoryGuidanceSessions = [newSession, ...memoryGuidanceSessions];
  return newSession;
}

export async function getUserGuidanceSessions(userEmail: string): Promise<AIGuidanceSession[]> {
  const sql = await getNeonClient();
  if (sql) {
    try {
      const result = await sql`
        SELECT * FROM ai_guidance_sessions 
        WHERE user_email = ${userEmail}
        ORDER BY created_at DESC
        LIMIT 50
      `;
      return result as AIGuidanceSession[];
    } catch (e) {
      console.warn("Error getting guidance sessions:", e);
    }
  }
  return memoryGuidanceSessions.filter((s) => s.user_email === userEmail);
}
