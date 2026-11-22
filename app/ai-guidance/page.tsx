"use client";

import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { marked } from "marked";
import { toast } from "sonner";
import {
  Sparkles,
  MessageCircle,
  Clock,
  User,
  Bot,
  Send,
  Map,
  Compass,
  CheckCircle2,
  TrendingUp,
  Zap,
} from "lucide-react";

interface GuidanceSession {
  id: number;
  topic?: string;
  question: string;
  ai_response: string;
  created_at: string;
}

const ROADMAPS: Record<string, { weeks: string; title: string; desc: string; topics: string[] }[]> = {
  fullstack: [
    {
      weeks: "Weeks 1 - 3",
      title: "Modern TypeScript & Advanced React Foundations",
      desc: "Deep dive into generics, utility types, React 19 hooks, concurrent rendering, and performance profiling.",
      topics: ["TypeScript Discriminated Unions & Generics", "React Server Components (RSC) vs Client Components", "Custom Hooks with state and cleanup", "Core Web Vitals profiling with Chrome DevTools"]
    },
    {
      weeks: "Weeks 4 - 6",
      title: "Production Next.js 15 & Serverless Architecture",
      desc: "Master App Router, streaming SSR, parallel routes, Server Actions, edge middleware, and caching layers.",
      topics: ["Next.js App Router & Layout nesting", "Server Actions with optimistic UI updates", "Edge Middleware for auth and rate limiting", "Dynamic caching with unmemoized fetch tags"]
    },
    {
      weeks: "Weeks 7 - 9",
      title: "Database Engineering, APIs & Security",
      desc: "Relational modeling, PostgreSQL indexing, ORMs (Prisma/Drizzle), REST & GraphQL, and security hardening.",
      topics: ["PostgreSQL indexing, foreign keys, and transactions", "Drizzle ORM / Prisma schema migrations", "JWT authentication with HttpOnly cookies & refresh rotation", "CORS, CSRF, and CSP security policies"]
    },
    {
      weeks: "Weeks 10 - 12",
      title: "DevOps, Distributed Systems & System Design",
      desc: "Docker containerization, CI/CD with GitHub Actions, Redis caching, microservices, and capstone project.",
      topics: ["Dockerizing full-stack apps for production", "GitHub Actions CI/CD pipelines to AWS / Vercel", "Redis caching & pub/sub for real-time messaging", "Capstone: Launch an AI-powered SaaS product"]
    }
  ],
  aiml: [
    {
      weeks: "Weeks 1 - 3",
      title: "Python, PyTorch & Linear Algebra Essentials",
      desc: "Master vectorized computation with NumPy, autograd in PyTorch, tensor manipulation, and gradient descent.",
      topics: ["NumPy matrix operations & broadcasting", "PyTorch Tensors, Autograd, and DataLoader", "Loss functions and optimizers (AdamW, SGD)", "Building a basic neural network from scratch"]
    },
    {
      weeks: "Weeks 4 - 6",
      title: "Transformer Architecture & LLM Foundations",
      desc: "Explore attention mechanisms, multi-head self-attention, tokenization, and pre-training vs fine-tuning.",
      topics: ["Scaled Dot-Product & Multi-Head Attention", "BPE & SentencePiece Tokenization", "HuggingFace Transformers pipeline", "Decoder-only (GPT) vs Encoder-Decoder architectures"]
    },
    {
      weeks: "Weeks 7 - 9",
      title: "RAG Systems & Vector Databases",
      desc: "Architect production Retrieval-Augmented Generation with vector embeddings, chunking, and rerankers.",
      topics: ["Embeddings with OpenAI & open-source models", "Vector DBs: Pinecone, Qdrant, and pgvector", "Semantic chunking & hybrid keyword-vector search", "Context window optimization and hallucination mitigation"]
    },
    {
      weeks: "Weeks 10 - 12",
      title: "Model Fine-Tuning & MLOps Deployment",
      desc: "LoRA/QLoRA parameter-efficient fine-tuning, quantization, vLLM inference scaling, and monitoring.",
      topics: ["PEFT and LoRA fine-tuning with Unsloth", "Model quantization (GGML, AWQ, GGUF)", "vLLM / Triton inference server deployment", "LLM evaluation metrics (BLEU, ROUGE, LLM-as-a-judge)"]
    }
  ]
};

export default function AIGuidancePage() {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<GuidanceSession[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [activeRoadmap, setActiveRoadmap] = useState("fullstack");
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});

  const promptSuggestions = [
    "How can I transition from Mid-Level to Senior Software Engineer in 6 months?",
    "What are the most critical System Design topics asked at Google and Amazon?",
    "How do I prepare for a technical interview when I have limited time?",
    "What is the best strategy to negotiate an engineering job offer with equity?",
  ];

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/ai-guidance/history", {
        headers: user ? { "x-user-email": user.email } : {},
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setSessions(data);
        }
      }
    } catch (e) {
      console.warn("History fetch notice:", e);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setCurrentResponse("");

    try {
      const response = await fetch("/api/ai-guidance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user ? { "x-user-email": user.email } : {}),
        },
        body: JSON.stringify({
          question: question.trim(),
          topic: topic.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (data && data.response) {
        setCurrentResponse(data.response);
        toast.success("AI Career Advisor generated your recommendations!");
        fetchHistory();
      }
    } catch (error) {
      console.error("Error asking career mentor:", error);
      toast.error("Failed to fetch advice.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMilestone = (key: string) => {
    setCompletedMilestones((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="secondary" className="gap-1.5 py-1 px-3 bg-indigo-500/10 text-primary border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI Career Advisor & Career Roadmaps
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Personalized Mentorship for Your <span className="gradient-text">Engineering Journey</span>
          </h1>
          <p className="text-base text-muted-foreground">
            Get instant strategic answers on career pivots, salary negotiations, system design, and follow structured 12-week learning roadmaps.
          </p>
        </div>

        <Tabs defaultValue="ask" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-11 p-1 bg-muted/60">
            <TabsTrigger value="ask" className="text-xs font-semibold gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              Ask AI Career Mentor
            </TabsTrigger>
            <TabsTrigger value="roadmaps" className="text-xs font-semibold gap-1.5">
              <Map className="w-3.5 h-3.5" />
              12-Week Roadmaps
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Interactive Chat Advisor */}
          <TabsContent value="ask" className="space-y-6 animate-fadeIn">
            <Card className="glass-panel border-border/80 shadow-xl">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  Ask Your Career Question
                </CardTitle>
                <CardDescription className="text-xs">
                  Ask anything about interview preparation, leveling up to Senior/Staff, portfolio building, or overcoming technical blockers.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Quick Prompts */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Suggested Questions:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {promptSuggestions.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setQuestion(prompt);
                          setTopic("Career Strategy");
                        }}
                        className="text-left text-xs p-2 rounded-lg bg-background border border-border/80 hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all"
                      >
                        💡 {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1 space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Category (Optional)</label>
                      <Input
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Promotion, System Design"
                        className="h-10 text-xs bg-background/50"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Your Question *</label>
                      <Input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Type your question..."
                        required
                        className="h-10 text-xs bg-background/50"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !question.trim()}
                    className="w-full py-5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-md shadow-indigo-500/20 gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generating Tailored Career Guidance...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Get AI Guidance
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Current Active Response */}
            {currentResponse && (
              <Card className="glass-panel border-border/80 shadow-lg animate-fadeIn">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-base font-bold text-foreground">
                      Advisor Recommendations
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div
                    className="prose dark:prose-invert max-w-none text-sm text-foreground leading-relaxed space-y-3"
                    dangerouslySetInnerHTML={{ __html: marked(currentResponse) }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Past History */}
            {sessions.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Your Previous Guidance Sessions
                </h3>
                <div className="space-y-4">
                  {sessions.slice(0, 5).map((s) => (
                    <Card key={s.id} className="glass-panel border-border/80">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          {s.topic && <Badge variant="outline">{s.topic}</Badge>}
                          <span>{new Date(s.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-muted-foreground">Q: {s.question}</span>
                          <div
                            className="text-xs text-foreground bg-muted/30 p-3 rounded-lg leading-relaxed line-clamp-4"
                            dangerouslySetInnerHTML={{ __html: marked(s.ai_response) }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tab 2: 12-Week Structured Learning Roadmaps */}
          <TabsContent value="roadmaps" className="space-y-6 animate-fadeIn">
            <Card className="glass-panel border-border/80 shadow-xl">
              <CardHeader className="pb-4 border-b border-border/60">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Compass className="w-5 h-5 text-primary" />
                      12-Week Engineering Mastery Roadmaps
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      Step-by-step curriculum with weekly milestones, must-learn topics, and capstone goals.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={activeRoadmap === "fullstack" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveRoadmap("fullstack")}
                      className="text-xs"
                    >
                      Full-Stack Next.js
                    </Button>
                    <Button
                      variant={activeRoadmap === "aiml" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveRoadmap("aiml")}
                      className="text-xs"
                    >
                      AI / ML Engineer
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(ROADMAPS[activeRoadmap] || ROADMAPS["fullstack"]).map((phase, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-border/80 bg-background/50 space-y-3.5 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs font-bold text-primary">
                          {phase.weeks}
                        </Badge>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">
                          Phase {idx + 1}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-foreground">{phase.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{phase.desc}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-border/50">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          Core Milestones & Checklist:
                        </span>
                        <div className="space-y-1.5">
                          {phase.topics.map((topic, tIdx) => {
                            const key = `${activeRoadmap}-${idx}-${tIdx}`;
                            const isDone = completedMilestones[key];

                            return (
                              <div
                                key={tIdx}
                                onClick={() => toggleMilestone(key)}
                                className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors ${
                                  isDone ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "hover:bg-muted/40"
                                }`}
                              >
                                <Checkbox checked={Boolean(isDone)} className="mt-0.5" />
                                <span className={`text-xs font-medium ${isDone ? "line-through opacity-80" : "text-foreground"}`}>
                                  {topic}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
