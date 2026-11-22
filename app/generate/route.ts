import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { type = "Technical", role = "Full Stack Engineer", level = "Mid Level", techstack = "React, TypeScript, Node.js", amount = 5 } = await request.json();

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const { google } = await import("@ai-sdk/google");
        const { generateText } = await import("ai");

        const { text } = await generateText({
          model: google("gemini-2.0-flash-001"),
          prompt: `Generate ${amount} interview questions for a ${level} ${role}.
Focus area: ${type}. Tech stack: ${techstack}.
Return strictly a valid JSON array of strings, without any markdown formatting or commentary:
["Question 1", "Question 2", "Question 3"]`,
        });

        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return NextResponse.json({ success: true, questions: parsed });
        }
      } catch (geminiError) {
        console.warn("Gemini generation skipped:", geminiError);
      }
    }

    // High quality intelligent question sets by role
    const defaultQuestions: Record<string, string[]> = {
      frontend: [
        "Explain how the React Virtual DOM diffing algorithm works, and how keys optimize reconciliation.",
        "How do you optimize Core Web Vitals (LCP, FID/INP, CLS) in a modern Next.js web application?",
        "What is the difference between client-side rendering (CSR), server-side rendering (SSR), and static site generation (SSG)?",
        "Describe how you handle state management across deeply nested components while preventing unnecessary re-renders.",
        "How do browser security policies like CORS and Content Security Policy (CSP) protect modern frontend apps?"
      ],
      backend: [
        "How do you design a database schema and indexing strategy for a high-throughput read/write workload?",
        "Explain the differences between REST, GraphQL, and gRPC, and when you would select each for inter-service communication.",
        "How would you prevent and mitigate SQL injection, XSS, and CSRF vulnerabilities in an API?",
        "Describe your approach to implementing rate limiting and circuit breaking in a distributed microservices environment.",
        "How do you maintain data consistency across distributed services without distributed transactions?"
      ],
      fullstack: [
        "Walk me through the architecture of a full-stack application you designed from scratch, highlighting key trade-offs.",
        "How do you coordinate data fetching, server caching, and optimistic UI updates between the frontend and backend?",
        "How do you structure authentication and authorization using JWTs, HTTP-only cookies, and refresh token rotation?",
        "Explain your testing pyramid: what do you cover with Unit tests, Integration tests, and End-to-End (Playwright/Cypress)?",
        "How do you troubleshoot a sudden latency spike in production affecting both API response times and database load?"
      ],
      systemdesign: [
        "Design a distributed rate-limiter supporting millions of API requests per second with low latency.",
        "How would you architect a real-time collaborative document editor like Google Docs or Notion?",
        "Explain how you would design a video streaming service like YouTube or Netflix with adaptive bitrate transcoding.",
        "How do you choose between relational databases (PostgreSQL) and NoSQL (MongoDB, Cassandra, DynamoDB)?",
        "Explain Consistent Hashing and how it manages node addition/removal in a distributed cache."
      ]
    };

    const roleKey = role.toLowerCase().includes("front") ? "frontend" :
                    role.toLowerCase().includes("back") ? "backend" :
                    role.toLowerCase().includes("system") ? "systemdesign" : "fullstack";

    const questions = defaultQuestions[roleKey] || defaultQuestions["fullstack"];

    return NextResponse.json({
      success: true,
      questions: questions.slice(0, Number(amount) || 5),
    });
  } catch (error) {
    console.error("Interview questions generation error:", error);
    return NextResponse.json({
      success: true,
      questions: [
        "Tell me about a challenging technical problem you solved recently and the trade-offs you evaluated.",
        "How do you ensure high performance, testability, and clean architecture in your code?",
        "Explain how you handle disagreement with a peer or stakeholder on an architectural decision.",
        "What strategies do you use for debugging complex production issues?",
        "Where do you see your engineering skills evolving over the next two years?"
      ],
    });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: "Interview generation API is active" });
}
