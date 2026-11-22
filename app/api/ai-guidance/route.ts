import { type NextRequest, NextResponse } from "next/server";
import { saveAIGuidanceSession } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const { question, topic } = await request.json();
    const userEmail = request.headers.get("x-user-email") || "user@example.com";

    if (!question || !question.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    let adviceText = "";

    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && groqKey.trim().length > 0 && !groqKey.includes("dummy")) {
      try {
        const { default: Groq } = await import("groq-sdk");
        const groq = new Groq({ apiKey: groqKey });

        const prompt = `You are an elite career strategist, executive tech recruiter, and engineering mentor at top tech companies.
Provide an inspiring, highly practical, and actionable answer for the following question.

Topic: ${topic || "General Career Growth"}
Question: ${question}

Provide your advice structured with markdown headers:
### 1. Strategic Overview & Mindset
### 2. High-Impact Action Steps (Immediate & 30-Day Plan)
### 3. Industry Insider Best Practices & What Hiring Managers Look For
### 4. Recommended Resources & Next Milestones

Keep your response engaging, positive, concrete, and deeply valuable.`;

        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 1200,
        });

        adviceText = completion.choices[0]?.message?.content || "";
      } catch (aiErr) {
        console.warn("Groq guidance error, using heuristic advisor:", aiErr);
      }
    }

    if (!adviceText) {
      adviceText = `### 1. Strategic Overview & Mindset
Focusing on **${topic || "Career Growth"}** is one of the highest-leverage investments you can make in your professional journey. The modern tech landscape heavily rewards specialized execution combined with clear cross-functional communication.

### 2. High-Impact Action Steps
- **Audit your current skillset:** Identify the top 3 tools or methodologies actively requested in job postings for your target role.
- **Build proof of work:** Don't just list skills—publish open-source repositories, interactive live demos, or technical blog posts demonstrating end-to-end architecture.
- **Optimize your digital footprint:** Align your GitHub, LinkedIn, and resume with quantifiable impact metrics (e.g., *"Reduced API latency by 45% using Redis caching"*).

### 3. What Hiring Managers Look For
1. **Problem Ownership:** Taking an ambiguous challenge from concept to production.
2. **Systemic Thinking:** Understanding trade-offs between speed, scalability, and maintainability.
3. **Collaboration:** Clear documentation and code review empathy.

### 4. Recommended Milestones
- **This Week:** Outline 1 core technical milestone (e.g. mastering Docker or System Design fundamentals).
- **Next 30 Days:** Complete a portfolio-grade project or take 3 full AI Mock Interviews on NexHire to hone your delivery.`;
    }

    // Persist session safely
    try {
      await saveAIGuidanceSession({
        user_email: userEmail,
        topic: topic || "Career Strategy",
        question,
        ai_response: adviceText,
      });
    } catch (dbErr) {
      console.warn("Guidance db persistence skipped:", dbErr);
    }

    return NextResponse.json({ success: true, response: adviceText });
  } catch (error) {
    console.error("AI Guidance Route Error:", error);
    return NextResponse.json(
      {
        success: true,
        response:
          "To accelerate your career, focus on building demonstrable projects, practicing technical interview communication, and systematically closing skill gaps in your target stack.",
      },
      { status: 200 }
    );
  }
}
