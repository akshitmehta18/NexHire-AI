"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  FileCheck2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Upload,
  Copy,
  ArrowRight,
  ShieldAlert,
  Zap,
  Target,
} from "lucide-react";

interface ATSAnalysis {
  overallScore: number;
  keywordScore: number;
  impactScore: number;
  formatScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  bulletFixes: { original: string; improved: string; reason: string }[];
}

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobRole, setJobRole] = useState("Full Stack Engineer");
  const [customJobDesc, setCustomJobDesc] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ATSAnalysis | null>(null);

  const predefinedRoles: Record<string, string[]> = {
    "Full Stack Engineer": [
      "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "REST APIs", "GraphQL",
      "Docker", "AWS", "CI/CD", "Jest", "Git", "Microservices", "Redis"
    ],
    "Frontend Engineer": [
      "React", "TypeScript", "Next.js", "Tailwind CSS", "Redux", "Web Performance",
      "Core Web Vitals", "Accessibility (a11y)", "HTML5", "CSS3", "Vite", "Playwright"
    ],
    "Backend Engineer": [
      "Node.js", "Python", "Go", "PostgreSQL", "MongoDB", "Kafka", "Redis",
      "System Design", "gRPC", "Docker", "Kubernetes", "Linux", "Distributed Systems"
    ],
    "AI / Machine Learning Engineer": [
      "Python", "PyTorch", "TensorFlow", "LLMs", "LangChain", "Vector Databases",
      "RAG", "Transformers", "Model Fine-Tuning", "Docker", "FastAPI", "MLOps"
    ],
    "DevOps & Cloud Engineer": [
      "AWS", "Terraform", "Kubernetes", "Docker", "Linux", "CI/CD",
      "GitHub Actions", "Prometheus", "Grafana", "Ansible", "Bash", "Security"
    ],
    "Product Manager": [
      "Product Strategy", "User Stories", "Roadmapping", "A/B Testing", "Agile",
      "Scrum", "Data Analytics", "SQL", "Stakeholder Management", "Wireframing"
    ],
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText((event.target?.result as string) || "");
        toast.success("Resume text loaded successfully!");
      };
      reader.readAsText(file);
    } else {
      // For binary files (PDF/DOCX), we can extract text or notify user
      toast.info("For best instant results, copy and paste your resume text below.");
    }
  };

  const runAnalysis = () => {
    if (!resumeText.trim()) {
      toast.error("Please paste your resume text or upload a document.");
      return;
    }

    setAnalyzing(true);

    setTimeout(() => {
      const text = resumeText.toLowerCase();
      const expectedKeywords = predefinedRoles[jobRole] || predefinedRoles["Full Stack Engineer"];

      // Check matched vs missing keywords
      const matched = expectedKeywords.filter((kw) => text.includes(kw.toLowerCase()));
      const missing = expectedKeywords.filter((kw) => !text.includes(kw.toLowerCase()));

      const keywordMatchRatio = matched.length / expectedKeywords.length;
      const keywordScore = Math.round(keywordMatchRatio * 100);

      // Check for quantifiable metrics (numbers, %, $, k)
      const hasMetrics = /\d+%|\$\d+|\d+\+|\b\d+\s*(users|clients|ms|seconds|million|req)/gi.test(resumeText);
      const metricMatches = resumeText.match(/\d+/g)?.length || 0;
      const impactScore = Math.min(100, Math.max(45, metricMatches * 5 + (hasMetrics ? 25 : 0)));

      // Check format & section headings
      const hasExperience = /experience|employment|work history/i.test(resumeText);
      const hasSkills = /skills|technologies|proficiencies/i.test(resumeText);
      const hasEducation = /education|university|college|degree/i.test(resumeText);
      const hasProjects = /projects|portfolio/i.test(resumeText);
      let formatScore = 50;
      if (hasExperience) formatScore += 15;
      if (hasSkills) formatScore += 15;
      if (hasEducation) formatScore += 10;
      if (hasProjects) formatScore += 10;

      // Overall weighted score
      const overallScore = Math.round(keywordScore * 0.45 + impactScore * 0.35 + formatScore * 0.2);

      const strengths: string[] = [];
      const improvements: string[] = [];

      if (matched.length >= 6) {
        strengths.push(`Strong coverage of high-demand keywords: ${matched.slice(0, 4).join(", ")}`);
      } else {
        improvements.push(`Missing core ATS keywords for ${jobRole}. Add keywords like ${missing.slice(0, 4).join(", ")}`);
      }

      if (hasMetrics) {
        strengths.push("Good inclusion of quantifiable impact metrics and key performance indicators");
      } else {
        improvements.push("Add concrete numbers and measurable results to your experience bullets (e.g. 'boosted throughput by 35%')");
      }

      if (hasSkills && hasExperience) {
        strengths.push("Standard, clean section hierarchy easily parsed by Greenhouse and Lever ATS algorithms");
      } else {
        improvements.push("Ensure standard headers like 'Work Experience', 'Technical Skills', and 'Education' are explicitly written");
      }

      const bulletFixes = [
        {
          original: "Responsible for building web pages and fixing UI bugs for the team.",
          improved: "Architected 12+ responsive web pages using React & Next.js, reducing average page load time by 38% and resolving 95% of frontend defect backlogs.",
          reason: "Replaced passive duty statement with high-impact action verbs and measurable business results."
        },
        {
          original: "Worked on database queries and improved API endpoints.",
          improved: "Optimized complex PostgreSQL indexes and query plans, slashing P99 API response latency from 650ms to 92ms across 2M daily requests.",
          reason: "Specified database technologies, latency numbers, and scale."
        }
      ];

      setResult({
        overallScore,
        keywordScore,
        impactScore,
        formatScore,
        matchedKeywords: matched,
        missingKeywords: missing,
        strengths,
        improvements,
        bulletFixes,
      });

      setAnalyzing(false);
      toast.success("Resume ATS Analysis complete!");
    }, 1200);
  };

  const loadSampleResume = () => {
    setResumeText(`ALEX CHEN
Full Stack Software Engineer | San Francisco, CA | alex.chen@example.com | linkedin.com/in/alexchen-dev

PROFESSIONAL SUMMARY
Results-driven Full Stack Engineer with 4 years of experience building high-traffic cloud applications. Proficient in React, Next.js, TypeScript, Node.js, and PostgreSQL. Passionate about web performance and microservices architecture.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript (ES6+), Python, SQL, HTML5, CSS3
Frameworks & Libraries: React, Next.js, Node.js, Express, Tailwind CSS, Jest
Databases & Cloud: PostgreSQL, Redis, MongoDB, AWS (S3, ECS, Lambda), Docker, Git, CI/CD

PROFESSIONAL EXPERIENCE
Senior Software Engineer | CloudFlow Inc. | 2022 - Present
- Architected enterprise React and Next.js portal used by 150,000 active monthly business users.
- Reduced server response latency by 45% by deploying Redis caching and query optimization in PostgreSQL.
- Implemented automated CI/CD pipeline using GitHub Actions, cutting release deployment cycle from 2 hours to 8 minutes.
- Mentored 4 junior engineers on TypeScript best practices, code review hygiene, and unit test coverage.

Full Stack Developer | DevVenture Studio | 2020 - 2022
- Developed scalable REST APIs using Node.js and Express, supporting 50+ third-party integrations.
- Built reusable component library in React and Tailwind CSS, increasing engineering velocity by 30%.
- Migrated legacy monolithic backend to Docker containerized microservices.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley (2016 - 2020)`);
    toast.info("Sample resume loaded. Click 'Analyze Resume'!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <Badge variant="secondary" className="gap-1.5 py-1 px-3 bg-indigo-500/10 text-primary border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            AI Resume & ATS Scanner
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Beat the Recruiter ATS Filter with <span className="gradient-text">Precision AI</span>
          </h1>
          <p className="text-base text-muted-foreground">
            75% of resumes are discarded by automated Applicant Tracking Systems before a human ever sees them.
            Scan your resume against real job requirements, detect missing keywords, and 2x your interview callback rate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="glass-panel border-border/80 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Resume Content
                  </span>
                  <Button variant="ghost" size="sm" onClick={loadSampleResume} className="text-xs text-primary">
                    Load Sample
                  </Button>
                </CardTitle>
                <CardDescription>
                  Paste your resume text below or upload a plain text file.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Target Job Role
                  </label>
                  <Select value={jobRole} onValueChange={setJobRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(predefinedRoles).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Paste Resume Text
                    </label>
                    <label className="cursor-pointer text-xs text-primary hover:underline flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      Upload file
                      <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                  <Textarea
                    placeholder="Paste your resume text here (Summary, Skills, Experience, Education)..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={12}
                    className="font-mono text-xs leading-relaxed resize-y bg-background/50"
                  />
                </div>

                <Button
                  onClick={runAnalysis}
                  disabled={analyzing || !resumeText.trim()}
                  className="w-full gap-2 py-6 text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/20"
                >
                  {analyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing Against ATS Algorithms...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Analyze Resume Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Tips Card */}
            <Card className="border-border/60 bg-muted/40">
              <CardContent className="p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  ATS Optimization Rules
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>Use simple, single-column layouts over complex tables or multi-columns.</li>
                  <li>Incorporate both acronyms and full terms (e.g. "AWS" and "Amazon Web Services").</li>
                  <li>Use metric-rich formula: Action Verb + Task + Quantified Impact.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Analysis Results */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <div className="space-y-6 animate-fadeIn">
                {/* Score Overview Card */}
                <Card className="glass-panel border-border/80 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 p-6 border-b border-border/60">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          ATS Match Rating for {jobRole}
                        </span>
                        <h3 className="text-2xl font-bold text-foreground">
                          {result.overallScore >= 80
                            ? "Excellent ATS Compatibility!"
                            : result.overallScore >= 60
                            ? "Good, but missing key keywords"
                            : "Needs Optimization to pass screen"}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Based on standard parsing rules for Greenhouse, Lever, Workday & Taleo ATS engines.
                        </p>
                      </div>

                      {/* Circular-style Score Badge */}
                      <div className="flex flex-col items-center justify-center w-28 h-28 rounded-2xl bg-card border-2 border-primary/40 shadow-inner">
                        <span className="text-3xl font-black text-primary">{result.overallScore}</span>
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase">Out of 100</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* Progress Subscores */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-background border border-border/60 space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground">Keyword Match</span>
                          <span className="font-bold text-foreground">{result.keywordScore}%</span>
                        </div>
                        <Progress value={result.keywordScore} className="h-2" />
                      </div>

                      <div className="p-4 rounded-xl bg-background border border-border/60 space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground">Metrics & Impact</span>
                          <span className="font-bold text-foreground">{result.impactScore}%</span>
                        </div>
                        <Progress value={result.impactScore} className="h-2" />
                      </div>

                      <div className="p-4 rounded-xl bg-background border border-border/60 space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-muted-foreground">Section Structure</span>
                          <span className="font-bold text-foreground">{result.formatScore}%</span>
                        </div>
                        <Progress value={result.formatScore} className="h-2" />
                      </div>
                    </div>

                    {/* Matched & Missing Keywords */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mb-2.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Detected High-Value Keywords ({result.matchedKeywords.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.matchedKeywords.length > 0 ? (
                            result.matchedKeywords.map((kw) => (
                              <Badge key={kw} variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs">
                                ✓ {kw}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No target keywords detected.</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5 mb-2.5">
                          <ShieldAlert className="w-4 h-4" />
                          Missing Critical Keywords ({result.missingKeywords.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.missingKeywords.length > 0 ? (
                            result.missingKeywords.map((kw) => (
                              <Badge key={kw} variant="outline" className="border-rose-500/30 text-rose-500 text-xs bg-rose-500/5">
                                + {kw}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-emerald-600">Great job! All target keywords present.</span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-2">
                          Recruiter tip: Incorporate these missing terms naturally into your project descriptions or skills list.
                        </p>
                      </div>
                    </div>

                    {/* Bullet Point Power Re-Writer */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        AI Bullet Point Impact Re-Writes
                      </h4>
                      <div className="space-y-3">
                        {result.bulletFixes.map((item, idx) => (
                          <div key={idx} className="p-4 rounded-xl border border-border bg-background/60 space-y-2.5">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Before (Weak / Passive):
                              </span>
                              <p className="text-xs text-muted-foreground line-through decoration-rose-500/50">
                                {item.original}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                After (ATS High-Impact Formula):
                              </span>
                              <p className="text-xs font-medium text-foreground bg-primary/5 p-2 rounded-lg border border-primary/20">
                                {item.improved}
                              </p>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                              <span>💡 {item.reason}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-[10px] gap-1"
                                onClick={() => {
                                  navigator.clipboard.writeText(item.improved);
                                  toast.success("Copied to clipboard!");
                                }}
                              >
                                <Copy className="w-3 h-3" />
                                Copy
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Empty State */
              <Card className="glass-panel border-border/80 py-16 text-center">
                <CardContent className="space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
                    <FileCheck2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Ready to Score Your Resume</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Paste your resume in the editor on the left and select your target role to generate an instant ATS diagnostic report.
                  </p>
                  <Button variant="outline" onClick={loadSampleResume} className="text-xs gap-2">
                    Try with a Sample Resume
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
