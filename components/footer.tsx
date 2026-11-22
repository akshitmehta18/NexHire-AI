"use client";

import Link from "next/link";
import { Sparkles, Briefcase, Brain, FileSearch, ShieldCheck, Heart, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/60 backdrop-blur-md mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                NexHire AI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              The all-in-one AI career acceleration platform. Discover verified high-impact jobs, master interactive voice mock interviews, optimize your resume for recruiter ATS systems, and test your engineering skills.
            </p>
            <div className="flex items-center gap-3 text-muted-foreground pt-2">
              <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Explore Jobs
                </Link>
              </li>
              <li>
                <Link href="/post-job" className="hover:text-primary transition-colors">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link href="/interview" className="hover:text-primary transition-colors">
                  AI Mock Interview
                </Link>
              </li>
              <li>
                <Link href="/resume-analyzer" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  ATS Resume Scanner
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-500 font-semibold px-1.5 py-0.5 rounded">NEW</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">Prep & Skills</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/quiz" className="hover:text-primary transition-colors">
                  AI Skill Quizzes
                </Link>
              </li>
              <li>
                <Link href="/pyqs" className="hover:text-primary transition-colors">
                  Company PYQs Archive
                </Link>
              </li>
              <li>
                <Link href="/ai-guidance" className="hover:text-primary transition-colors">
                  Career Mentor & Roadmaps
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-foreground">Community</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com/akshitmehta18"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/akshitmehta18"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              Empowering engineers and hiring teams worldwide with next-gen AI automation.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NexHire AI. Built with Next.js 15, React 19 & Tailwind CSS.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
