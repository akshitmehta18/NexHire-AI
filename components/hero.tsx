"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  Award,
  Mic,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 border-b border-border/40 bg-gradient-to-b from-card/80 via-background to-background">
      {/* Decorative gradient glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-cyan-500/15 blur-3xl pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl space-y-8">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-primary backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
          <span>The All-In-One Intelligent Career & Hiring Ecosystem</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
          Fast-Track Your Dream Job with{" "}
          <span className="gradient-text">Next-Gen AI Automation</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Discover verified engineering & design roles, simulate real-time voice interviews with AI feedback, optimize your resume for ATS screening, and master top tech company PYQs.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <a href="#jobs-section">
            <Button
              size="lg"
              className="gap-2 px-7 py-6 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:opacity-95 text-white shadow-xl shadow-indigo-500/20"
            >
              Explore Open Jobs
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
          <Link href="/interview">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 px-7 py-6 text-sm font-semibold rounded-xl border-border hover:border-primary/50 bg-background/60"
            >
              <Mic className="w-4 h-4 text-primary" />
              Try AI Mock Interview
            </Button>
          </Link>
          <Link href="/resume-analyzer">
            <Button
              size="lg"
              variant="secondary"
              className="gap-2 px-6 py-6 text-sm font-semibold rounded-xl"
            >
              <FileCheck2 className="w-4 h-4 text-indigo-500" />
              Scan ATS Resume
            </Button>
          </Link>
        </div>

        {/* Platform Proof Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto border-t border-border/50">
          <div className="p-4 rounded-2xl glass-panel text-center space-y-1">
            <div className="text-2xl md:text-3xl font-extrabold text-foreground">12,500+</div>
            <div className="text-xs text-muted-foreground font-medium">Live Global Jobs</div>
          </div>
          <div className="p-4 rounded-2xl glass-panel text-center space-y-1">
            <div className="text-2xl md:text-3xl font-extrabold text-primary">850+</div>
            <div className="text-xs text-muted-foreground font-medium">Hiring Companies</div>
          </div>
          <div className="p-4 rounded-2xl glass-panel text-center space-y-1">
            <div className="text-2xl md:text-3xl font-extrabold text-foreground">94%</div>
            <div className="text-xs text-muted-foreground font-medium">ATS Match Success</div>
          </div>
          <div className="p-4 rounded-2xl glass-panel text-center space-y-1">
            <div className="text-2xl md:text-3xl font-extrabold text-emerald-500">45,000+</div>
            <div className="text-xs text-muted-foreground font-medium">Engineers Prepped</div>
          </div>
        </div>

        {/* Trusted By Banner */}
        <div className="pt-8 text-center space-y-3">
          <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Interview Questions & Preparation Trusted By Alumni At
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm font-bold text-muted-foreground/80">
            <span className="hover:text-foreground transition-colors">Google</span>
            <span className="hover:text-foreground transition-colors">Stripe</span>
            <span className="hover:text-foreground transition-colors">Microsoft</span>
            <span className="hover:text-foreground transition-colors">Amazon</span>
            <span className="hover:text-foreground transition-colors">Meta</span>
            <span className="hover:text-foreground transition-colors">Netflix</span>
            <span className="hover:text-foreground transition-colors">OpenAI</span>
            <span className="hover:text-foreground transition-colors">Vercel</span>
          </div>
        </div>
      </div>
    </section>
  );
}
