import { QuizSetup } from "@/components/quiz-setup";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-4xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="secondary" className="gap-1.5 py-1 px-3 bg-indigo-500/10 text-primary border-indigo-500/20">
            <Brain className="w-3.5 h-3.5 text-primary" />
            AI Adaptive Skill Assessment
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Benchmark Your Skills with <span className="gradient-text">Instant Credentialing</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Take timed, domain-specific quizzes tailored to your stack. Score above 80% to earn verified skill badges for your candidate profile.
          </p>
        </div>

        <QuizSetup />
      </main>
      <Footer />
    </div>
  );
}
