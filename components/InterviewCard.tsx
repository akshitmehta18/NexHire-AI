"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Star, Mic, ArrowRight } from "lucide-react";

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  score?: number;
}

export default function InterviewCard({
  interviewId = "1",
  role,
  type,
  techstack,
  createdAt,
  score,
}: InterviewCardProps) {
  const formattedDate = dayjs(createdAt || Date.now()).format("MMM D, YYYY");

  return (
    <div className="glass-panel border-border/80 rounded-2xl p-6 space-y-4 hover:border-primary/50 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs uppercase font-bold text-primary">
            {type}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground capitalize">{role} Interview</h3>
            <span className="text-xs text-muted-foreground">Interactive AI Simulator</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {techstack.map((tech, idx) => (
            <Badge key={idx} variant="secondary" className="text-[10px] py-0 px-2 bg-muted">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/60">
        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{score ? `${score}/100` : "Ready"}</span>
        </div>

        <Link href="/interview">
          <Button size="sm" className="text-xs gap-1.5 font-semibold">
            Start Practice
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
