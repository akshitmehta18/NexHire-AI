import { MockInterviewSession } from "@/components/mock-interview-session";
import { Badge } from "@/components/ui/badge";
import { Mic, Sparkles } from "lucide-react";

export default function InterviewPage() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="secondary" className="gap-1.5 py-1 px-3 bg-indigo-500/10 text-primary border-indigo-500/20">
          <Mic className="w-3.5 h-3.5 text-primary" />
          Voice & Audio AI Interview Simulator
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Master the Technical Interview with <span className="gradient-text">Real-Time AI Voice</span>
        </h1>
        <p className="text-base text-muted-foreground">
          Simulate high-stakes engineering interviews with speech synthesis, live microphone transcription, follow-up pacing, and comprehensive scoring rubrics.
        </p>
      </div>

      <MockInterviewSession />
    </div>
  );
}
