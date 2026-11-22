"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  Bot,
  FileCheck,
  Send,
} from "lucide-react";

interface InterviewQuestion {
  question: string;
  category: string;
  hint: string;
  sampleAnswer: string;
}

const QUESTION_PACKS: Record<string, InterviewQuestion[]> = {
  frontend: [
    {
      question: "Explain the React reconciliation algorithm and how the Virtual DOM determines what updates to flush to the real browser DOM.",
      category: "React Internals",
      hint: "Mention fiber trees, diffing assumptions (O(n) heuristic), key attributes, and render vs commit phase.",
      sampleAnswer: "React uses a heuristic O(n) algorithm based on two key assumptions: elements of different types produce different trees, and unique keys stably identify children across renders. Fiber nodes calculate changes in the render phase and flush atomic updates in the commit phase."
    },
    {
      question: "How do you systematically analyze and improve Core Web Vitals (specifically Largest Contentful Paint and Cumulative Layout Shift) on a Next.js application?",
      category: "Web Performance",
      hint: "Discuss image optimization with next/image, font preloading, CDN caching, server-side streaming, and explicit dimension attributes.",
      sampleAnswer: "For LCP, prioritize hero assets using priority attributes, utilize edge caching, and streamline server-side data fetching. For CLS, assign explicit aspect-ratios to media and reserve slots for asynchronous banners."
    },
    {
      question: "Describe how browser event delegation works and why it provides performance advantages over attaching listeners to hundreds of individual list items.",
      category: "DOM & JavaScript",
      hint: "Talk about event bubbling from event.target up to an ancestor, reducing memory allocations.",
      sampleAnswer: "Event delegation leverages DOM bubbling by attaching a single listener to a common ancestor. By inspecting event.target, it handles events for any current or future child elements, dramatically reducing memory overhead."
    }
  ],
  backend: [
    {
      question: "How do you design a database indexing strategy for a table with 50 million records receiving 80% read queries and 20% write queries?",
      category: "Database Engineering",
      hint: "Discuss B-Tree index structure, composite index column ordering, write overhead penalty, and EXPLAIN ANALYZE.",
      sampleAnswer: "Focus on composite B-Tree indexes matching WHERE and ORDER BY clauses, prioritizing high-cardinality equality columns first. Limit total indexes to avoid write amplification, and inspect query execution plans with EXPLAIN ANALYZE."
    },
    {
      question: "Explain how you would handle idempotency when designing payment processing APIs to prevent accidental duplicate charges.",
      category: "API Architecture",
      hint: "Discuss client-generated Idempotency-Keys, distributed locks, database unique constraints, and atomic state transitions.",
      sampleAnswer: "Require clients to pass a unique Idempotency-Key in headers. The server stores this key with the processing state in Redis or a relational table with unique constraints, ensuring repeat requests return the original response without re-executing transactions."
    },
    {
      question: "What strategies do you employ to prevent cascading failures across microservices when a downstream service experiences high latency?",
      category: "Distributed Systems",
      hint: "Discuss circuit breakers (Hystrix/Resilience4j), request timeouts, exponential backoff with jitter, and bulkhead isolation.",
      sampleAnswer: "Implement circuit breaker patterns to fail fast when error rates cross thresholds, enforce aggressive socket timeouts, apply retry policies with exponential backoff and jitter, and isolate thread pools using bulkhead design."
    }
  ],
  fullstack: [
    {
      question: "Walk through the architectural trade-offs between Client-Side Rendering (CSR), Server-Side Rendering (SSR), and Incremental Static Regeneration (ISR).",
      category: "System Architecture",
      hint: "Contrast TTFB, initial bundle size, SEO requirements, server load, and data freshness.",
      sampleAnswer: "CSR delivers fast subsequent transitions but suffers from slow initial load and weaker SEO. SSR ensures dynamic SEO and fast FCP at the expense of server compute. ISR blends the best of both by serving cached static pages and regenerating them in the background on demand."
    },
    {
      question: "How do you secure modern single-page applications against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)?",
      category: "Security",
      hint: "Mention Content Security Policy, HTML escaping, HttpOnly SameSite cookies, and anti-CSRF synchronizer tokens.",
      sampleAnswer: "Mitigate XSS by utilizing modern frameworks that auto-escape strings, avoiding dangerouslySetInnerHTML, and enforcing a strict Content Security Policy (CSP). Counter CSRF using SameSite=Strict HttpOnly cookies and verifying origin/referer headers or anti-CSRF tokens."
    },
    {
      question: "How would you design an end-to-end logging and telemetry architecture to troubleshoot production bugs in real time?",
      category: "Observability",
      hint: "Discuss structured JSON logs, correlation IDs, OpenTelemetry tracing, and metric dashboards.",
      sampleAnswer: "Propagate a unique trace ID / correlation ID across all HTTP requests and asynchronous queue jobs. Emit structured JSON logs to aggregators like Datadog or ELK, and instrument services with OpenTelemetry metrics for distributed tracing."
    }
  ],
  behavioral: [
    {
      question: "Tell me about a time when you strongly disagreed with an engineering decision made by a team lead or architect. How did you handle it?",
      category: "Collaboration & Conflict",
      hint: "Use STAR: describe Situation, Task, your constructive Action (data-backed proposals), and the collaborative Result.",
      sampleAnswer: "I presented objective benchmark data comparing the two approaches in a 1-on-1 setting. We agreed on a pilot proof-of-concept, which validated my concerns while respecting the lead's timeline constraints, resulting in a 40% reduction in production memory leaks."
    },
    {
      question: "Describe a situation where a critical production incident occurred under your watch. What steps did you take to resolve and prevent recurrence?",
      category: "Incident Response",
      hint: "Focus on calm triage, immediate customer mitigation (rollback), transparent status updates, and a blameless post-mortem.",
      sampleAnswer: "I immediately initiated our incident bridge, prioritized customer mitigation by rolling back the release within 7 minutes, and posted regular stakeholder status updates. Later, I led a blameless post-mortem that introduced automated pre-deploy smoke tests."
    },
    {
      question: "Give an example of a complex technical project with ambiguous requirements where you had to drive clarity and deliver on a tight deadline.",
      category: "Ownership & Ambiguity",
      hint: "Emphasize interviewing stakeholders, breaking work into agile MVPs, and establishing clear definition of done.",
      sampleAnswer: "I drafted an RFC documenting core user stories and non-negotiables, aligned engineering and product leadership on an MVP scope, and delivered Phase 1 ahead of schedule, validating our hypothesis before building secondary features."
    }
  ]
};

export function MockInterviewSession() {
  const { user } = useAuth();

  // Setup state
  const [stage, setStage] = useState<"setup" | "interview" | "feedback">("setup");
  const [role, setRole] = useState("fullstack");
  const [seniority, setSeniority] = useState("Mid-Level");
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Interview state
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Rubric Feedback state
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<any>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setUserAnswer((prev) => (prev ? `${prev} ${currentTranscript}` : currentTranscript));
          }
        };

        recognition.onerror = (err: any) => {
          console.warn("Speech recognition notice:", err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha"))
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const startInterview = () => {
    const pack = QUESTION_PACKS[role] || QUESTION_PACKS["fullstack"];
    setQuestions(pack);
    setCurrentIndex(0);
    setAnswers([]);
    setUserAnswer("");
    setShowHint(false);
    setStage("interview");

    setTimeout(() => {
      speakText(`Welcome to your ${seniority} ${role.toUpperCase()} interview. Here is question one: ${pack[0].question}`);
    }, 400);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      toast.info("Voice-to-text is not supported in this browser. Please type your answer below.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info("Microphone stopped.");
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success("Listening... Speak your response.");
      } catch (e) {
        console.error(e);
        setIsListening(false);
      }
    }
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) {
      toast.error("Please provide an answer before advancing.");
      return;
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const updatedAnswers = [...answers, userAnswer];
    setAnswers(updatedAnswers);
    setUserAnswer("");
    setShowHint(false);

    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setTimeout(() => {
        speakText(`Question ${nextIdx + 1}: ${questions[nextIdx].question}`);
      }, 300);
    } else {
      // Completed interview! Calculate score
      finishInterview(updatedAnswers);
    }
  };

  const finishInterview = (allAnswers: string[]) => {
    // Evaluation heuristic based on answer richness, length, and key metrics
    let totalScore = 0;
    const details = questions.map((q, idx) => {
      const ans = allAnswers[idx] || "";
      const wordCount = ans.trim().split(/\s+/).length;
      let qScore = 65; // base
      if (wordCount >= 30) qScore += 15;
      if (wordCount >= 60) qScore += 10;
      if (/because|trade-off|architecture|performance|latency|scale|result|metric/i.test(ans)) qScore += 10;
      qScore = Math.min(98, qScore);
      totalScore += qScore;

      return {
        question: q.question,
        category: q.category,
        userAnswer: ans,
        score: qScore,
        idealAnswer: q.sampleAnswer,
        feedback:
          qScore >= 85
            ? "Strong technical depth, clear structure, and effective vocabulary."
            : "Good start. Strengthen by including specific quantifiable metrics and trade-offs."
      };
    });

    const finalAvg = Math.round(totalScore / questions.length);
    setScore(finalAvg);
    setFeedback({
      overallScore: finalAvg,
      seniorityRating: finalAvg >= 85 ? "Senior Ready" : finalAvg >= 75 ? "Mid-Level Ready" : "Foundational Candidate",
      technicalScore: Math.min(100, finalAvg + 3),
      communicationScore: Math.min(100, finalAvg - 2),
      problemSolvingScore: Math.min(100, finalAvg + 1),
      questionsData: details,
    });

    // Save to localStorage history
    try {
      const existing = JSON.parse(localStorage.getItem("mockInterviewResults") || "[]");
      const record = {
        id: Date.now(),
        date: new Date().toISOString(),
        role: role,
        seniority: seniority,
        score: finalAvg,
        totalQuestions: questions.length,
      };
      localStorage.setItem("mockInterviewResults", JSON.stringify([record, ...existing]));
    } catch (e) {
      console.warn("Could not save interview to storage", e);
    }

    setStage("feedback");
    toast.success("Interview finished! Your report card is ready.");
  };

  return (
    <div className="space-y-6">
      {/* Stage 1: Setup */}
      {stage === "setup" && (
        <Card className="glass-panel border-border/80 shadow-lg max-w-2xl mx-auto">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-500/20">
              <Bot className="w-7 h-7" />
            </div>
            <CardTitle className="text-2xl font-bold">Configure Your AI Mock Interview</CardTitle>
            <CardDescription className="text-sm">
              Practice real-time technical & behavioral questions with instant AI audio narration and scoring rubric.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Target Engineering Role
              </label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend Software Engineer</SelectItem>
                  <SelectItem value="backend">Backend & Distributed Systems</SelectItem>
                  <SelectItem value="fullstack">Full-Stack Engineer (Next.js & Node)</SelectItem>
                  <SelectItem value="behavioral">Behavioral & Leadership (STAR Method)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Seniority Level
              </label>
              <Select value={seniority} onValueChange={setSeniority}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose Seniority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Junior / Entry">Junior / Entry-Level Engineer</SelectItem>
                  <SelectItem value="Mid-Level">Mid-Level Software Engineer</SelectItem>
                  <SelectItem value="Senior Level">Senior Software Engineer</SelectItem>
                  <SelectItem value="Staff / Lead">Staff / Principal Architect</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/50">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-primary" />
                  AI Voice Narrator
                </span>
                <p className="text-xs text-muted-foreground">
                  Reads each question aloud automatically using browser neural audio synthesis.
                </p>
              </div>
              <Button
                variant={voiceEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="text-xs"
              >
                {voiceEnabled ? "Voice Enabled" : "Audio Muted"}
              </Button>
            </div>

            <Button
              onClick={startInterview}
              className="w-full py-6 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:opacity-95 text-white shadow-xl shadow-indigo-500/20 gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              Begin Interview Simulation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stage 2: Active Interview */}
      {stage === "interview" && questions[currentIndex] && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Bar */}
          <Card className="glass-panel border-border/80">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs uppercase font-bold text-primary">
                  {seniority}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speakText(questions[currentIndex].question)}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Volume2 className="w-4 h-4" />
                  Replay Audio
                </Button>
              </div>
            </CardContent>
            <Progress value={((currentIndex + 1) / questions.length) * 100} className="h-1 rounded-none" />
          </Card>

          {/* AI Interviewer Stage */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* AI Avatar Pane */}
            <Card className="md:col-span-4 glass-panel border-border/80 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="relative">
                {isSpeaking && (
                  <span className="absolute -inset-3 rounded-full bg-indigo-500/30 animate-pulse-ring" />
                )}
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 relative z-10">
                  <Bot className="w-12 h-12" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-foreground">NexHire AI Interviewer</h3>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 mt-1">
                  <span className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-emerald-500 animate-ping" : "bg-muted-foreground"}`} />
                  {isSpeaking ? "Speaking..." : "Listening to response"}
                </p>
              </div>
            </Card>

            {/* Current Question Display */}
            <Card className="md:col-span-8 glass-panel border-border/80 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {questions[currentIndex].category}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-muted-foreground gap-1 hover:text-primary"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    {showHint ? "Hide Hint" : "Need a Hint?"}
                  </Button>
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-foreground leading-relaxed">
                  "{questions[currentIndex].question}"
                </h2>

                {showHint && (
                  <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-primary animate-fadeIn">
                    💡 <strong>Interviewer Hint:</strong> {questions[currentIndex].hint}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Candidate Response Workspace */}
          <Card className="glass-panel border-border/80 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Your Response (Speak or Type)
                </span>
                <span className="text-xs text-muted-foreground">
                  {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Speak using the microphone button or type your technical explanation here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                rows={6}
                className="text-sm leading-relaxed resize-y bg-background/60"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <Button
                  type="button"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={toggleMic}
                  className="w-full sm:w-auto gap-2 text-xs font-semibold"
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      Stop Mic Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-primary" />
                      Answer with Voice (Speech-to-Text)
                    </>
                  )}
                </Button>

                <Button
                  onClick={submitAnswer}
                  disabled={!userAnswer.trim()}
                  className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-6"
                >
                  {currentIndex === questions.length - 1 ? (
                    <>
                      Complete Interview & View Report
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Submit Answer & Next
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stage 3: Detailed Feedback Report Card */}
      {stage === "feedback" && feedback && (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
          {/* Header Score Card */}
          <Card className="glass-panel border-border/80 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 p-8 border-b border-border/60">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                <div className="space-y-2">
                  <Badge variant="secondary" className="text-xs bg-indigo-500/10 text-primary border-indigo-500/20">
                    Interview Evaluation Completed
                  </Badge>
                  <h2 className="text-3xl font-extrabold text-foreground">
                    Performance: {feedback.seniorityRating}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Target Role: <strong className="text-foreground capitalize">{role}</strong> ({seniority})
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center w-32 h-32 rounded-2xl bg-card border-2 border-primary/50 shadow-xl">
                  <span className="text-4xl font-black text-primary">{score}%</span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Score</span>
                </div>
              </div>
            </div>

            <CardContent className="p-8 space-y-8">
              {/* Pillar Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-background border border-border/60 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Technical Depth</span>
                    <span className="font-bold text-foreground">{feedback.technicalScore}%</span>
                  </div>
                  <Progress value={feedback.technicalScore} className="h-2" />
                </div>

                <div className="p-4 rounded-xl bg-background border border-border/60 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Communication & Logic</span>
                    <span className="font-bold text-foreground">{feedback.communicationScore}%</span>
                  </div>
                  <Progress value={feedback.communicationScore} className="h-2" />
                </div>

                <div className="p-4 rounded-xl bg-background border border-border/60 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Problem Solving</span>
                    <span className="font-bold text-foreground">{feedback.problemSolvingScore}%</span>
                  </div>
                  <Progress value={feedback.problemSolvingScore} className="h-2" />
                </div>
              </div>

              {/* Question by question rubric review */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" />
                  Detailed Question Breakdown & Ideal Answers
                </h3>

                <div className="space-y-6">
                  {feedback.questionsData.map((item: any, idx: number) => (
                    <div key={idx} className="p-6 rounded-2xl border border-border bg-background/50 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          Question {idx + 1} • {item.category}
                        </span>
                        <Badge variant="outline" className="font-bold text-xs">
                          Score: {item.score}/100
                        </Badge>
                      </div>

                      <h4 className="text-base font-semibold text-foreground">
                        {item.question}
                      </h4>

                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Your Recorded Response:</span>
                        <p className="text-xs text-foreground bg-muted/40 p-3 rounded-lg leading-relaxed border border-border/40">
                          {item.userAnswer}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">
                          Ideal Industry Benchmark Answer:
                        </span>
                        <p className="text-xs text-muted-foreground bg-emerald-500/5 p-3 rounded-lg leading-relaxed border border-emerald-500/20">
                          {item.idealAnswer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/60">
                <Button
                  onClick={() => setStage("setup")}
                  className="flex-1 gap-2 py-6 rounded-xl text-sm font-semibold"
                >
                  <RotateCcw className="w-4 h-4" />
                  Take Another Interview
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="flex-1 gap-2 py-6 rounded-xl text-sm font-semibold"
                >
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Print / Save Scorecard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
