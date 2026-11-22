"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Clock, Hash, Play, History, CheckCircle2, Sparkles } from "lucide-react";
import { QuizInterface } from "./quiz-interface";
import { QuizHistory } from "./quiz-history";

interface QuizConfig {
  topic: string;
  customTopic: string;
  timeLimit: number;
  questionCount: number;
}

export function QuizSetup() {
  const [config, setConfig] = useState<QuizConfig>({
    topic: "JavaScript",
    customTopic: "",
    timeLimit: 10,
    questionCount: 5,
  });
  const [quizStarted, setQuizStarted] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const predefinedTopics = [
    "JavaScript",
    "React",
    "Python",
    "System Design",
    "Node.js",
    "Data Structures",
    "Algorithms",
    "Database Design",
    "DevOps",
    "Machine Learning",
    "Cybersecurity",
    "UI/UX Design",
    "Custom Topic",
  ];

  const handleConfigChange = (field: keyof QuizConfig, value: string | number) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const startQuiz = () => {
    if (!config.topic || (config.topic === "Custom Topic" && !config.customTopic.trim())) {
      alert("Please select or enter a topic for your assessment.");
      return;
    }
    setQuizStarted(true);
  };

  const handleQuizComplete = () => {
    setQuizStarted(false);
    setShowHistory(false);
  };

  if (showHistory) {
    return <QuizHistory onBack={() => setShowHistory(false)} />;
  }

  if (quizStarted) {
    return (
      <QuizInterface
        topic={config.topic === "Custom Topic" ? config.customTopic : config.topic}
        timeLimit={config.timeLimit}
        questionCount={config.questionCount}
        onComplete={handleQuizComplete}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card className="glass-panel border-border/80 shadow-xl">
        <CardHeader className="pb-4 border-b border-border/60">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Configure Skill Assessment
          </CardTitle>
          <CardDescription className="text-xs">
            Select your primary technical domain and customize test duration and question limits.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Topic Selector */}
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Assessment Topic *
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {predefinedTopics.map((t) => {
                const isSelected = config.topic === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleConfigChange("topic", t)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border/80 bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Topic Input */}
          {config.topic === "Custom Topic" && (
            <div className="space-y-1.5 animate-fadeIn">
              <Label htmlFor="customTopic" className="text-xs font-semibold">Custom Technical Subject *</Label>
              <Input
                id="customTopic"
                placeholder="e.g. Next.js 15 App Router, Kubernetes CKA, Golang Concurrency..."
                value={config.customTopic}
                onChange={(e) => handleConfigChange("customTopic", e.target.value)}
                className="h-10 text-xs bg-background/50"
              />
            </div>
          )}

          {/* Time & Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="timeLimit" className="text-xs font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                Time Limit (Minutes)
              </Label>
              <Select
                value={config.timeLimit.toString()}
                onValueChange={(v) => handleConfigChange("timeLimit", Number.parseInt(v))}
              >
                <SelectTrigger className="h-10 text-xs bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Minutes (Quick Sprint)</SelectItem>
                  <SelectItem value="10">10 Minutes (Standard)</SelectItem>
                  <SelectItem value="15">15 Minutes (Comprehensive)</SelectItem>
                  <SelectItem value="25">25 Minutes (Deep Dive)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="questionCount" className="text-xs font-semibold flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                Number of Questions
              </Label>
              <Select
                value={config.questionCount.toString()}
                onValueChange={(v) => handleConfigChange("questionCount", Number.parseInt(v))}
              >
                <SelectTrigger className="h-10 text-xs bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-background/60 border border-border/60 text-xs space-y-1">
            <span className="font-bold text-foreground">Assessment Structure:</span>
            <ul className="text-muted-foreground space-y-0.5 list-disc list-inside">
              <li>Multiple-choice format with instant solution explanations after completion.</li>
              <li>Questions span fundamental concepts, architecture trade-offs, and edge cases.</li>
              <li>Score 80% or higher to unlock an official Verified Skill Certificate.</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={startQuiz}
              className="flex-1 py-6 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/20 gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Begin Skill Assessment
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowHistory(true)}
              className="gap-2 text-xs font-semibold px-5"
            >
              <History className="w-4 h-4 text-muted-foreground" />
              Past Quizzes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
