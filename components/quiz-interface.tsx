"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, ArrowRight, ArrowLeft, Brain, Sparkles } from "lucide-react";
import { QuizResults } from "./quiz-results";
import { CURATED_QUIZ_BANK } from "@/constants/seed-data";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface QuizInterfaceProps {
  topic: string;
  timeLimit: number;
  questionCount: number;
  onComplete: () => void;
}

export function QuizInterface({ topic, timeLimit, questionCount, onComplete }: QuizInterfaceProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch("/api/generate-quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, questionCount }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.questions) && data.questions.length > 0) {
            if (isMounted) {
              setQuestions(data.questions);
              setSelectedAnswers(new Array(data.questions.length).fill(-1));
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn("Quiz API fetch error, using curated question bank:", err);
      }

      // Safe Fallback
      if (isMounted) {
        const fallbackTopic =
          Object.keys(CURATED_QUIZ_BANK).find((t) => t.toLowerCase() === topic.toLowerCase()) || "JavaScript";
        const fallbackList = CURATED_QUIZ_BANK[fallbackTopic] || CURATED_QUIZ_BANK["JavaScript"];
        setQuestions(fallbackList.slice(0, questionCount));
        setSelectedAnswers(new Array(Math.min(fallbackList.length, questionCount)).fill(-1));
        setLoading(false);
      }
    };

    fetchQuestions();

    return () => {
      isMounted = false;
    };
  }, [topic, questionCount]);

  useEffect(() => {
    if (loading || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setQuizCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, quizCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (loading) {
    return (
      <Card className="glass-panel border-border/80 shadow-md">
        <CardContent className="py-16 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">Preparing {topic} Assessment</h3>
            <p className="text-xs text-muted-foreground">
              Synthesizing domain questions and balancing technical difficulty levels...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quizCompleted) {
    return (
      <QuizResults
        topic={topic}
        questions={questions}
        selectedAnswers={selectedAnswers}
        timeLimit={timeLimit}
        timeUsed={timeLimit * 60 - timeRemaining}
        onRestart={() => {
          setSelectedAnswers(new Array(questions.length).fill(-1));
          setCurrentQuestionIndex(0);
          setTimeRemaining(timeLimit * 60);
          setQuizCompleted(false);
        }}
        onComplete={onComplete}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex] || {
    id: 1,
    question: "Loading question details...",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    explanation: "",
    difficulty: "Medium" as const,
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Quiz Header Bar */}
      <Card className="glass-panel border-border/80 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-base md:text-lg font-bold flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                {topic} Assessment
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <Badge
              variant={timeRemaining < 120 ? "destructive" : "secondary"}
              className="gap-1.5 px-3 py-1 font-mono text-xs font-semibold"
            >
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timeRemaining)}
            </Badge>
          </div>
          <Progress value={progress} className="h-1.5 mt-3" />
        </CardHeader>
      </Card>

      {/* Current Question Card */}
      <Card className="glass-panel border-border/80 shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs uppercase font-semibold">
              {currentQuestion.difficulty}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Select one option
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-2">
          <h2 className="text-lg md:text-xl font-bold text-foreground leading-relaxed">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === index;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border/80 bg-background/50 hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold transition-colors ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-sm font-medium text-foreground">{option}</span>
                  </div>

                  {isSelected && <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              className="gap-1.5 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </Button>

            <Button
              onClick={nextQuestion}
              disabled={selectedAnswers[currentQuestionIndex] === -1}
              size="sm"
              className="gap-1.5 text-xs font-semibold px-5 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {currentQuestionIndex === questions.length - 1 ? "Submit & View Score" : "Next Question"}
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question Jumper Grid */}
      <Card className="glass-panel border-border/80">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {questions.map((_, index) => {
              const isCurrent = index === currentQuestionIndex;
              const isAnswered = selectedAnswers[index] !== -1;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-md"
                      : isAnswered
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
