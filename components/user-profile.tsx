"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  User,
  Briefcase,
  Brain,
  FileText,
  Calendar,
  Trophy,
  LogOut,
  Bookmark,
  Mic,
  Award,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";

export function UserProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<any[]>([]);
  const [quizResults, setQuizResults] = useState<any[]>([]);
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [interviewResults, setInterviewResults] = useState<any[]>([]);

  useEffect(() => {
    // If not logged in, provide a helpful fallback state with demo data so they can see all tabs
    const allApplications = JSON.parse(localStorage.getItem("jobApplications") || "[]");
    const allQuizResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
    const allPostedJobs = JSON.parse(localStorage.getItem("localJobs") || "[]");
    const allSavedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    const allInterviewResults = JSON.parse(localStorage.getItem("mockInterviewResults") || "[]");

    setApplications(allApplications);
    setQuizResults(allQuizResults);
    setPostedJobs(allPostedJobs);
    setSavedJobs(allSavedJobs);
    setInterviewResults(allInterviewResults);
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.info("Signed out successfully");
    router.push("/");
  };

  const removeSavedJob = (jobId: number) => {
    const updated = savedJobs.filter((j) => j.id !== jobId);
    setSavedJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
    toast.info("Removed job from saved list");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
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

  const averageQuizScore =
    quizResults.length > 0
      ? Math.round(quizResults.reduce((sum: number, r: any) => sum + (r.score || 0), 0) / quizResults.length)
      : 88;

  const displayName = user ? `${user.firstName} ${user.lastName}` : "Alex Chen";
  const displayEmail = user ? user.email : "alex.chen@example.com";
  const displayRole = user?.userType === "employer" ? "Employer Account" : "Software Engineer";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Profile Header Banner */}
      <Card className="glass-panel border-border/80 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 p-8 border-b border-border/60">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-indigo-500/30">
                {displayName[0]}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{displayName}</h1>
                <p className="text-sm text-muted-foreground">{displayEmail}</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Badge variant="secondary" className="text-xs bg-indigo-500/10 text-primary border-indigo-500/20">
                    {displayRole}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Verified Candidate
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/resume-analyzer">
                <Button variant="outline" size="sm" className="text-xs gap-1.5 border-border">
                  <FileText className="w-3.5 h-3.5" />
                  ATS Scanner
                </Button>
              </Link>
              {user && (
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs text-muted-foreground hover:text-destructive gap-1.5">
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/60 bg-card">
          <div className="p-5 text-center space-y-1">
            <span className="text-2xl font-bold text-foreground">{applications.length || 3}</span>
            <span className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Applications
            </span>
          </div>

          <div className="p-5 text-center space-y-1">
            <span className="text-2xl font-bold text-primary">{savedJobs.length || 2}</span>
            <span className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Saved Jobs
            </span>
          </div>

          <div className="p-5 text-center space-y-1">
            <span className="text-2xl font-bold text-emerald-500">{quizResults.length || 4}</span>
            <span className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Skill Badges
            </span>
          </div>

          <div className="p-5 text-center space-y-1">
            <span className="text-2xl font-bold text-foreground">{averageQuizScore}%</span>
            <span className="block text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Avg Assessment
            </span>
          </div>
        </div>
      </Card>

      {/* Tabs Layout */}
      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-11 bg-muted/60 p-1">
          <TabsTrigger value="applications" className="text-xs font-semibold gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="saved" className="text-xs font-semibold gap-1.5">
            <Bookmark className="w-3.5 h-3.5" />
            Saved Roles ({savedJobs.length})
          </TabsTrigger>
          <TabsTrigger value="interviews" className="text-xs font-semibold gap-1.5">
            <Mic className="w-3.5 h-3.5" />
            Mock Interviews ({interviewResults.length})
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="text-xs font-semibold gap-1.5">
            <Brain className="w-3.5 h-3.5" />
            Skill Badges ({quizResults.length})
          </TabsTrigger>
          <TabsTrigger value="posted" className="text-xs font-semibold gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            Posted Jobs ({postedJobs.length})
          </TabsTrigger>
        </TabsList>

        {/* 1. Job Applications Tab */}
        <TabsContent value="applications" className="space-y-4 animate-fadeIn">
          <Card className="glass-panel border-border/80 shadow-md">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Submitted Job Applications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {applications.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <FileText className="w-10 h-10 text-muted-foreground mx-auto" />
                  <h3 className="text-base font-bold text-foreground">No applications submitted yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Explore verified openings and apply in one click with your customized resume.
                  </p>
                  <Link href="/">
                    <Button size="sm" className="text-xs mt-2">
                      Browse Jobs
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl border border-border/80 bg-background/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-foreground">{app.jobTitle}</h4>
                          <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                            {app.status || "Under Review"}
                          </Badge>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5" />
                          {app.company}
                          <span>•</span>
                          <Clock className="w-3.5 h-3.5" />
                          Applied {formatDate(app.appliedDate)}
                        </p>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Resume: </span>
                        {app.resumeFileName || "Default_Resume.pdf"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Saved Jobs Tab */}
        <TabsContent value="saved" className="space-y-4 animate-fadeIn">
          <Card className="glass-panel border-border/80 shadow-md">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-primary" />
                Bookmarked Job Listings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {savedJobs.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Bookmark className="w-10 h-10 text-muted-foreground mx-auto" />
                  <h3 className="text-base font-bold text-foreground">No saved jobs yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Click the bookmark icon on any job card to save it for later review.
                  </p>
                  <Link href="/">
                    <Button size="sm" className="text-xs mt-2">
                      Find Jobs to Save
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 rounded-xl border border-border/80 bg-background/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-foreground">{job.title}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="text-primary font-medium">{job.company}</span>
                          <span>•</span>
                          <span>{job.candidate_required_location || job.location || "Remote"}</span>
                          <span>•</span>
                          <span>{job.salary || "Competitive"}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/jobs/${job.id}`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            View Position
                          </Button>
                        </Link>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeSavedJob(job.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Mock Interviews Tab */}
        <TabsContent value="interviews" className="space-y-4 animate-fadeIn">
          <Card className="glass-panel border-border/80 shadow-md">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Mic className="w-4 h-4 text-primary" />
                AI Mock Interview History & Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {interviewResults.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Mic className="w-10 h-10 text-muted-foreground mx-auto" />
                  <h3 className="text-base font-bold text-foreground">No mock interviews completed yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Practice with the real-time AI speech simulator to sharpen your responses and get scored.
                  </p>
                  <Link href="/interview">
                    <Button size="sm" className="text-xs mt-2">
                      Start Mock Interview
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {interviewResults.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-xl border border-border/80 bg-background/50 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-foreground capitalize">
                            {rec.role} Interview
                          </h4>
                          <Badge variant="outline" className="text-[10px]">
                            {rec.seniority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(rec.date)} • {rec.totalQuestions} Questions Answered
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-lg font-black text-primary">{rec.score}%</span>
                          <span className="block text-[10px] text-muted-foreground uppercase font-bold">
                            Score
                          </span>
                        </div>
                        <Link href="/interview">
                          <Button size="sm" variant="outline" className="text-xs">
                            Retake
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Skill Quizzes Tab */}
        <TabsContent value="quizzes" className="space-y-4 animate-fadeIn">
          <Card className="glass-panel border-border/80 shadow-md">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                Verified Skill Assessments & Badges
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {quizResults.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Brain className="w-10 h-10 text-muted-foreground mx-auto" />
                  <h3 className="text-base font-bold text-foreground">No assessments taken yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Benchmark your technical knowledge and earn verified competency badges.
                  </p>
                  <Link href="/quiz">
                    <Button size="sm" className="text-xs mt-2">
                      Take a Skill Quiz
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {quizResults.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-xl border border-border/80 bg-background/50 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-foreground">{q.topic}</h4>
                          {q.score >= 80 && (
                            <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              ✓ Verified Badge
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(q.date)} • {q.correctAnswers}/{q.totalQuestions} Correct
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className={`text-lg font-black ${q.score >= 80 ? "text-emerald-500" : "text-primary"}`}>
                            {q.score}%
                          </span>
                          <span className="block text-[10px] text-muted-foreground uppercase font-bold">
                            Accuracy
                          </span>
                        </div>
                        <Link href="/quiz">
                          <Button size="sm" variant="outline" className="text-xs">
                            Retake
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Posted Jobs Tab (for employers) */}
        <TabsContent value="posted" className="space-y-4 animate-fadeIn">
          <Card className="glass-panel border-border/80 shadow-md">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Your Published Job Openings
                </CardTitle>
                <Link href="/post-job">
                  <Button size="sm" className="text-xs font-semibold">
                    Post New Job
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {postedJobs.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Building2 className="w-10 h-10 text-muted-foreground mx-auto" />
                  <h3 className="text-base font-bold text-foreground">No jobs posted yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Post a new role to start receiving qualified applications through NexHire AI.
                  </p>
                  <Link href="/post-job">
                    <Button size="sm" className="text-xs mt-2">
                      Post Your First Role
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {postedJobs.map((j) => (
                    <div
                      key={j.id}
                      className="p-4 rounded-xl border border-border/80 bg-background/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-foreground">{j.title}</h4>
                          <Badge variant="secondary" className="text-[10px]">
                            {j.job_type || j.jobType}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>{j.company}</span>
                          <span>•</span>
                          <span>{j.location || "Remote"}</span>
                          <span>•</span>
                          <span>Published {formatDate(j.publication_date)}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/jobs/${j.id}`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            View Public Listing
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
