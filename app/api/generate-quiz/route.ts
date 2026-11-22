import { NextResponse } from "next/server";
import { CURATED_QUIZ_BANK } from "@/constants/seed-data";

export async function POST(req: Request) {
  try {
    const { topic = "JavaScript", questionCount = 5 } = await req.json();

    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && groqKey.trim().length > 0 && !groqKey.includes("dummy")) {
      try {
        const { default: Groq } = await import("groq-sdk");
        const groq = new Groq({ apiKey: groqKey });

        const prompt = `Generate exactly ${questionCount} multiple-choice quiz questions on the topic "${topic}".
Format them strictly as a valid JSON array of objects with this structure without markdown code fences:
[
  {
    "id": 1,
    "question": "Clear question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this answer is correct.",
    "difficulty": "Easy" | "Medium" | "Hard"
  }
]
Important: Output ONLY the raw JSON array without any markdown formatting or commentary.`;

        const completion = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.5,
          max_tokens: 1500,
        });

        const raw = completion.choices[0]?.message?.content ?? "";
        const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        if (Array.isArray(parsed) && parsed.length > 0) {
          return NextResponse.json({ questions: parsed });
        }
      } catch (aiError) {
        console.warn("Groq generation failed, falling back to curated bank:", aiError);
      }
    }

    // High quality curated question fallback
    const normalizedTopic =
      Object.keys(CURATED_QUIZ_BANK).find(
        (t) => t.toLowerCase() === topic.toLowerCase()
      ) || "JavaScript";

    const baseQuestions = CURATED_QUIZ_BANK[normalizedTopic] || CURATED_QUIZ_BANK["JavaScript"];
    
    // If user requested more questions than in base bank, synthesize additional questions
    const finalQuestions = [...baseQuestions];
    while (finalQuestions.length < questionCount) {
      const idx = finalQuestions.length + 1;
      finalQuestions.push({
        id: idx,
        question: `In ${topic}, what is a standard industry best practice for production architecture and security?`,
        options: [
          "Follow least privilege access control and sanitize all inputs",
          "Hardcode API secrets in client-side bundles",
          "Disable all caching headers",
          "Store plain-text credentials in the repository"
        ],
        correctAnswer: 0,
        explanation: `Securing ${topic} systems requires defensive programming, principle of least privilege, strict input validation, and environment secret management.`,
        difficulty: "Medium"
      });
    }

    return NextResponse.json({
      questions: finalQuestions.slice(0, questionCount),
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      {
        questions: CURATED_QUIZ_BANK["JavaScript"].slice(0, 5),
      },
      { status: 200 }
    );
  }
}
