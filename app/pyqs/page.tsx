"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { INITIAL_PYQS, PYQItem } from "@/constants/seed-data";
import { toast } from "sonner";
import {
  Clock,
  Building2,
  BookOpen,
  Trophy,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  Lightbulb,
} from "lucide-react";

export default function PYQsPage() {
  const [pyqs, setPyqs] = useState<PYQItem[]>(INITIAL_PYQS);
  const [companies, setCompanies] = useState<string[]>([
    "all",
    "Google",
    "Amazon",
    "Microsoft",
    "Meta",
    "Apple",
    "Netflix",
    "TCS",
  ]);
  const [categories, setCategories] = useState<string[]>([
    "all",
    "Technical",
    "DSA",
    "System Design",
    "Behavioral",
    "Aptitude",
  ]);
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [selectedCompany, selectedCategory]);

  const fetchMetadata = async () => {
    try {
      const compRes = await fetch("/api/pyqs/companies");
      if (compRes.ok) {
        const compData = await compRes.json();
        if (Array.isArray(compData) && compData.length > 0) {
          setCompanies(["all", ...compData.filter((c: any) => typeof c === "string")]);
        }
      }

      const catRes = await fetch("/api/pyqs/categories");
      if (catRes.ok) {
        const catData = await catRes.json();
        if (Array.isArray(catData) && catData.length > 0) {
          setCategories(["all", ...catData.filter((c: any) => typeof c === "string")]);
        }
      }
    } catch (e) {
      console.warn("Metadata fetch error:", e);
    }
  };

  const filterQuestions = () => {
    let pool = [...INITIAL_PYQS];
    if (selectedCompany !== "all") {
      pool = pool.filter((p) => p.company.toLowerCase() === selectedCompany.toLowerCase());
    }
    if (selectedCategory !== "all") {
      pool = pool.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    setPyqs(pool);
    setCurrentIndex(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (option: string) => {
    if (showAnswer) return;
    setSelectedAnswer(option);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer && currentPYQ.options && currentPYQ.options.length > 0) {
      toast.error("Please pick an option first.");
      return;
    }

    const isCorrect = selectedAnswer === currentPYQ.correct_answer;
    if (isCorrect && !answeredQuestions.has(currentIndex)) {
      setScore((prev) => prev + 1);
      toast.success("Correct answer!");
    } else if (!isCorrect && currentPYQ.options && currentPYQ.options.length > 0) {
      toast.error("Incorrect. Check the explanation below.");
    }

    setAnsweredQuestions((prev) => new Set([...prev, currentIndex]));
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (currentIndex < pyqs.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const currentPYQ = pyqs[currentIndex] || INITIAL_PYQS[0];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="secondary" className="gap-1.5 py-1 px-3 bg-indigo-500/10 text-primary border-indigo-500/20">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            Company Interview Archive
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Real Past Year Questions from <span className="gradient-text">Top Tech Firms</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Practice actual technical, system design, and behavioral questions asked at Google, Amazon, Microsoft, Meta, and Netflix.
          </p>
        </div>

        {/* Filter Controls Card */}
        <Card className="glass-panel border-border/80 shadow-md">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  Target Company
                </label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="h-10 text-xs bg-background/50">
                    <SelectValue placeholder="Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c === "all" ? "All Companies" : c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Interview Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-10 text-xs bg-background/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {pyqs.length > 0 ? (
          <div className="space-y-6">
            {/* Progress Bar & Counter */}
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>
                Question <strong className="text-foreground">{currentIndex + 1}</strong> of {pyqs.length}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                Score: {score} / {answeredQuestions.size}
              </span>
            </div>

            {/* Question Card */}
            <Card className="glass-panel border-border/80 shadow-lg">
              <CardHeader className="pb-4 border-b border-border/60">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs font-bold bg-primary text-primary-foreground">
                      {currentPYQ.company}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {currentPYQ.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${
                        currentPYQ.difficulty === "Easy"
                          ? "text-emerald-500 border-emerald-500/30"
                          : currentPYQ.difficulty === "Medium"
                          ? "text-amber-500 border-amber-500/30"
                          : "text-rose-500 border-rose-500/30"
                      }`}
                    >
                      {currentPYQ.difficulty}
                    </Badge>
                  </div>
                  {currentPYQ.year && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Asked in {currentPYQ.year}
                    </span>
                  )}
                </div>

                <CardTitle className="text-lg md:text-xl font-bold text-foreground leading-relaxed pt-3">
                  {currentPYQ.question}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Options if Multiple Choice */}
                {currentPYQ.options && currentPYQ.options.length > 0 ? (
                  <div className="space-y-3">
                    {currentPYQ.options.map((opt, idx) => {
                      const isSelected = selectedAnswer === opt;
                      const isCorrect = opt === currentPYQ.correct_answer;

                      let itemStyle = "border-border/80 bg-background/50 hover:border-primary/40";
                      if (showAnswer) {
                        if (isCorrect) {
                          itemStyle = "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold";
                        } else if (isSelected && !isCorrect) {
                          itemStyle = "border-rose-500/60 bg-rose-500/10 text-rose-700 dark:text-rose-300";
                        }
                      } else if (isSelected) {
                        itemStyle = "border-primary bg-primary/10 shadow-sm";
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAnswerSelect(opt)}
                          disabled={showAnswer}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between text-xs sm:text-sm ${itemStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-md border flex items-center justify-center font-bold text-xs shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {showAnswer && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                          {showAnswer && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-background/50 border border-border/60 text-xs text-muted-foreground leading-relaxed">
                    💡 This is an open-ended architectural/system question. Formulate your solution points and click below to view the official rubric explanation.
                  </div>
                )}

                {/* Explanation Reveal */}
                {showAnswer && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 border border-emerald-500/20 space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4" />
                      Explanation & Solution Approach
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">
                      {currentPYQ.explanation}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="gap-1.5 text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    {!showAnswer ? (
                      <Button
                        onClick={handleSubmitAnswer}
                        size="sm"
                        className="text-xs font-semibold px-5 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {currentPYQ.options && currentPYQ.options.length > 0 ? "Check Answer" : "Show Solution"}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        disabled={currentIndex === pyqs.length - 1}
                        size="sm"
                        className="text-xs font-semibold gap-1.5 px-5 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Next Question
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="glass-panel text-center py-16">
            <CardContent className="space-y-3">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-bold">No questions found for this filter</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try switching the company or category filter to view other interview archives.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedCompany("all");
                  setSelectedCategory("all");
                }}
                className="text-xs mt-2"
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
