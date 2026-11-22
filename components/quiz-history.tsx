"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Clock, Calendar, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface QuizResult {
  id: number;
  userId?: string;
  topic: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeUsed: number;
  date: string;
}

interface QuizHistoryProps {
  onBack: () => void;
}

export function QuizHistory({ onBack }: QuizHistoryProps) {
  const { user } = useAuth();
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    try {
      const savedResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
      setResults(savedResults);
    } catch (e) {
      console.warn(e);
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const formatTime = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const averageScore =
    results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0;
  const bestScore = results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-xs">
          <ArrowLeft className="w-4 h-4" />
          Back to Setup
        </Button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-panel text-center p-4">
            <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
            <div className="text-2xl font-black text-foreground">{bestScore}%</div>
            <div className="text-xs text-muted-foreground uppercase font-semibold">Best Score</div>
          </Card>
          <Card className="glass-panel text-center p-4">
            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-1" />
            <div className="text-2xl font-black text-primary">{averageScore}%</div>
            <div className="text-xs text-muted-foreground uppercase font-semibold">Average Accuracy</div>
          </Card>
          <Card className="glass-panel text-center p-4">
            <Calendar className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
            <div className="text-2xl font-black text-foreground">{results.length}</div>
            <div className="text-xs text-muted-foreground uppercase font-semibold">Tests Completed</div>
          </Card>
        </div>
      )}

      <Card className="glass-panel border-border/80 shadow-md">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-base font-bold">Assessment History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {results.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Trophy className="w-10 h-10 text-muted-foreground mx-auto" />
              <h3 className="text-base font-bold text-foreground">No assessment records found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Complete your first technical quiz to track accuracy trends and unlock verified badges.
              </p>
              <Button onClick={onBack} size="sm" className="text-xs mt-2">
                Start a Quiz Now
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl border border-border/80 bg-background/50 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{res.topic}</h4>
                      {res.score >= 80 && (
                        <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Verified Badge
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(res.date)}
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(res.timeUsed)} elapsed
                    </p>
                  </div>

                  <div className="text-right">
                    <div className={`text-xl font-black ${res.score >= 80 ? "text-emerald-500" : "text-primary"}`}>
                      {res.score}%
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {res.correctAnswers}/{res.totalQuestions} Correct
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
