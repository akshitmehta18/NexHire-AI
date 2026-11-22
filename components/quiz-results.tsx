"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  RotateCcw,
  Home,
  Award,
  Sparkles,
  Download,
  Share2,
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface QuizResultsProps {
  topic: string;
  questions: Question[];
  selectedAnswers: number[];
  timeLimit: number;
  timeUsed: number;
  onRestart: () => void;
  onComplete: () => void;
}

export function QuizResults({
  topic,
  questions,
  selectedAnswers,
  timeLimit,
  timeUsed,
  onRestart,
  onComplete,
}: QuizResultsProps) {
  const { user } = useAuth();
  const [showCertificate, setShowCertificate] = useState(false);

  const correctAnswers = selectedAnswers.filter(
    (answer, index) => answer === questions[index]?.correctAnswer
  ).length;
  const score = Math.round((correctAnswers / (questions.length || 1)) * 100);
  const timeUsedMinutes = Math.floor(timeUsed / 60);
  const timeUsedSeconds = timeUsed % 60;

  useEffect(() => {
    try {
      const result = {
        id: Date.now(),
        userId: user?.id || "guest",
        userName: user ? `${user.firstName} ${user.lastName}` : "Candidate",
        topic,
        score,
        correctAnswers,
        totalQuestions: questions.length,
        timeUsed,
        date: new Date().toISOString(),
      };

      const existingResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
      localStorage.setItem("quizResults", JSON.stringify([result, ...existingResults.slice(0, 49)]));
    } catch (e) {
      console.warn("Storage save error", e);
    }
  }, [topic, score, correctAnswers, questions.length, timeUsed, user]);

  const candidateName = user ? `${user.firstName} ${user.lastName}` : "Certified Candidate";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Overview Score Card */}
      <Card className="glass-panel border-border/80 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 p-8 border-b border-border/60 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center mx-auto text-white shadow-xl shadow-indigo-500/30 mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <Badge variant="secondary" className="text-xs bg-indigo-500/10 text-primary border-indigo-500/20 mb-2">
            Skill Assessment Complete
          </Badge>
          <h2 className="text-3xl font-extrabold text-foreground">{topic} Knowledge Benchmark</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Completed by <strong className="text-foreground">{candidateName}</strong>
          </p>

          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="p-4 rounded-xl bg-card border border-border/60 text-center min-w-[120px]">
              <span className="text-4xl font-black text-primary">{score}%</span>
              <span className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wider mt-0.5">
                Accuracy Score
              </span>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/60 text-center min-w-[120px]">
              <span className="text-2xl font-bold text-foreground">
                {correctAnswers} / {questions.length}
              </span>
              <span className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wider mt-0.5">
                Questions Correct
              </span>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border/60 text-center min-w-[120px]">
              <span className="text-2xl font-bold text-foreground">
                {timeUsedMinutes}:{timeUsedSeconds.toString().padStart(2, "0")}
              </span>
              <span className="block text-[10px] font-bold uppercase text-muted-foreground tracking-wider mt-0.5">
                Time Elapsed
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {score >= 80 && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">
                    Congratulations! You earned the {topic} Verified Skill Badge!
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    You scored above the 80% passing threshold for enterprise engineering hiring bars.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowCertificate(!showCertificate)}
                size="sm"
                className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shrink-0 gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                {showCertificate ? "Hide Certificate" : "View Certificate"}
              </Button>
            </div>
          )}

          {/* Certificate View */}
          {showCertificate && (
            <div className="p-8 rounded-2xl border-4 border-double border-indigo-500/40 bg-card text-center space-y-4 shadow-xl animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
                  NexHire AI Verified Skill Credential
                </span>
                <h3 className="text-2xl font-black text-foreground">Certificate of Competency</h3>
                <p className="text-xs text-muted-foreground">This is proudly presented to</p>
                <div className="text-2xl font-extrabold text-foreground py-1">{candidateName}</div>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  For successfully passing the comprehensive <strong className="text-foreground">{topic}</strong> AI technical assessment with an accuracy score of <strong className="text-primary">{score}%</strong>.
                </p>
              </div>
              <div className="flex items-center justify-between max-w-sm mx-auto pt-4 border-t border-border/60 text-[10px] text-muted-foreground">
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>Verification ID: NH-{Date.now().toString().slice(-8)}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="text-xs gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Print / Download Certificate
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={onRestart} variant="outline" className="flex-1 gap-2 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Assessment
            </Button>
            <Button onClick={onComplete} className="flex-1 gap-2 text-xs font-semibold">
              <Home className="w-3.5 h-3.5" />
              Return to Quizzes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question by Question Review */}
      <Card className="glass-panel border-border/80 shadow-md">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-lg font-bold">Answer Explanations & Review</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div
                key={question.id || index}
                className="p-4 rounded-xl border border-border/80 bg-background/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                    <span className="text-xs font-bold text-foreground">
                      Question {index + 1}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                      {question.difficulty}
                    </Badge>
                  </div>
                  <span className={`text-xs font-semibold ${isCorrect ? "text-emerald-600" : "text-rose-500"}`}>
                    {isCorrect ? "+10 Points" : "0 Points"}
                  </span>
                </div>

                <p className="text-sm font-semibold text-foreground">{question.question}</p>

                <div className="space-y-1.5 text-xs">
                  {question.options.map((option, optIdx) => {
                    const isRight = optIdx === question.correctAnswer;
                    const isPicked = optIdx === userAnswer;

                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-lg border flex items-center justify-between ${
                          isRight
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium"
                            : isPicked && !isCorrect
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                            : "border-border/40 text-muted-foreground bg-muted/20"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                          <span>{option}</span>
                        </div>
                        {isRight && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            ✓ Correct
                          </span>
                        )}
                        {isPicked && !isCorrect && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/20 text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-primary font-semibold">Explanation: </strong>
                  {question.explanation}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
