"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { INITIAL_JOBS, JobItem } from "@/constants/seed-data";
import { toast } from "sonner";
import {
  Search,
  MapPin,
  Clock,
  ExternalLink,
  Loader2,
  Mail,
  Eye,
  Bookmark,
  BookmarkCheck,
  Building2,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Filter,
  Sparkles,
  Send,
  X,
} from "lucide-react";

export function JobSearch() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all-categories");
  const [workType, setWorkType] = useState("all");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);

  // Quick Apply Modal State
  const [applyingJob, setApplyingJob] = useState<JobItem | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  useEffect(() => {
    // Load saved job IDs from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      setSavedJobIds(saved.map((j: any) => j.id));
    } catch (e) {
      console.warn(e);
    }

    if (user) {
      setApplicantName(`${user.firstName} ${user.lastName}`);
      setApplicantEmail(user.email);
    }

    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // 1. Get locally created jobs from localStorage
      const localJobs: JobItem[] = JSON.parse(localStorage.getItem("localJobs") || "[]");

      // 2. Fetch remote jobs from Remotive API with timeout protection
      let remoteJobs: JobItem[] = [];
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (category && category !== "all-categories") params.append("category", category);

        const response = await fetch(`https://remotive.com/api/remote-jobs?${params.toString()}`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && data.jobs) {
            remoteJobs = data.jobs.map((j: any) => ({
              id: j.id,
              title: j.title,
              company: j.company_name,
              location: j.candidate_required_location || "Remote",
              job_type: j.job_type || "Full-time",
              publication_date: j.publication_date || new Date().toISOString(),
              candidate_required_location: j.candidate_required_location || "Remote",
              salary: j.salary || "$110,000 - $160,000",
              description: j.description || "",
              url: j.url || "#",
              tags: j.tags || ["Remote", "Engineering"],
              isLocalJob: false,
              experienceLevel: "Mid Level",
            }));
          }
        }
      } catch (networkErr) {
        // Remotive API unavailable or slow, continue gracefully with seed and local jobs
        console.warn("Remotive API unavailable, continuing with verified jobs bank");
      }

      // Combine: Local posted jobs first, then INITIAL_JOBS, then Remotive
      const combined = [...localJobs, ...INITIAL_JOBS, ...remoteJobs];

      // Deduplicate by ID
      const seen = new Set<number>();
      const unique = combined.filter((job) => {
        if (seen.has(job.id)) return false;
        seen.add(job.id);
        return true;
      });

      // Filter locally based on criteria
      const filtered = unique.filter((job) => {
        const matchesSearch =
          !searchTerm ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesWorkType =
          workType === "all" ||
          (workType === "remote" && (job.candidate_required_location?.toLowerCase().includes("remote") || job.location?.toLowerCase().includes("remote"))) ||
          (workType === "onsite" && !job.candidate_required_location?.toLowerCase().includes("remote"));

        const matchesExp =
          experienceLevel === "all" ||
          (job.experienceLevel && job.experienceLevel.toLowerCase().includes(experienceLevel.toLowerCase()));

        return matchesSearch && matchesWorkType && matchesExp;
      });

      setJobs(filtered);
    } catch (error) {
      console.error("Error loading jobs:", error);
      setJobs(INITIAL_JOBS);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const toggleSaveJob = (job: JobItem) => {
    try {
      const saved: JobItem[] = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      const exists = saved.some((j) => j.id === job.id);

      if (exists) {
        const updated = saved.filter((j) => j.id !== job.id);
        localStorage.setItem("savedJobs", JSON.stringify(updated));
        setSavedJobIds(updated.map((j) => j.id));
        toast.info(`Removed ${job.title} from saved jobs`);
      } else {
        const updated = [job, ...saved];
        localStorage.setItem("savedJobs", JSON.stringify(updated));
        setSavedJobIds(updated.map((j) => j.id));
        toast.success(`Saved ${job.title} to your profile!`);
      }
    } catch (e) {
      console.warn("Storage error", e);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    setIsSubmittingApp(true);
    setTimeout(() => {
      try {
        const applications = JSON.parse(localStorage.getItem("jobApplications") || "[]");
        const newApp = {
          id: Date.now(),
          userId: user?.id || "guest",
          jobId: applyingJob.id,
          jobTitle: applyingJob.title,
          company: applyingJob.company,
          applicantName: applicantName || "Candidate",
          email: applicantEmail || "candidate@example.com",
          coverLetter: coverNote,
          appliedDate: new Date().toISOString(),
          status: "Under Review",
        };
        localStorage.setItem("jobApplications", JSON.stringify([newApp, ...applications]));
        toast.success(`Application submitted for ${applyingJob.title} at ${applyingJob.company}!`);
      } catch (err) {
        console.warn(err);
      }
      setIsSubmittingApp(false);
      setApplyingJob(null);
      setCoverNote("");
    }, 800);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Recently";
    }
  };

  return (
    <div id="jobs-section" className="space-y-8">
      {/* Header & Filter Card */}
      <Card className="glass-panel border-border/80 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                Find Your Next Career Move
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Filter through verified remote & global roles from top tech companies and startups.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-primary/5 text-primary border-primary/20">
              {jobs.length} Opportunities Available
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Keyword Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Job title, skills (React, Python)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-10 bg-background/60"
                />
              </div>

              {/* Category */}
              <div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10 bg-background/60">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">All Specializations</SelectItem>
                    <SelectItem value="software-dev">Software Development</SelectItem>
                    <SelectItem value="design">UI/UX & Product Design</SelectItem>
                    <SelectItem value="data">Data Science & AI/ML</SelectItem>
                    <SelectItem value="devops">DevOps & Cloud Infra</SelectItem>
                    <SelectItem value="product">Product Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Work Type */}
              <div>
                <Select value={workType} onValueChange={setWorkType}>
                  <SelectTrigger className="h-10 bg-background/60">
                    <SelectValue placeholder="Work Environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations (Remote & Onsite)</SelectItem>
                    <SelectItem value="remote">100% Remote Only</SelectItem>
                    <SelectItem value="onsite">On-Site / Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level */}
              <div>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger className="h-10 bg-background/60">
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experience Levels</SelectItem>
                    <SelectItem value="entry">Entry / Junior Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead / Principal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Popular Tags:</span>
                {["Next.js", "TypeScript", "React", "Python", "Kubernetes", "AI/ML"].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => {
                      setSearchTerm(t);
                    }}
                    className="px-2 py-0.5 rounded-md bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-[11px]"
                  >
                    {t}
                  </button>
                ))}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground text-xs shadow-md shadow-primary/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Filtering Jobs...
                  </>
                ) : (
                  <>
                    <Filter className="w-3.5 h-3.5 mr-2" />
                    Apply Filters
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Job Cards Listing */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">Fetching verified job openings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <Card className="glass-panel text-center py-16">
            <CardContent className="space-y-3">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-bold">No jobs matching your exact filters</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try clearing your search keyword or switching the specialization filter to view more roles.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setCategory("all-categories");
                  setWorkType("all");
                  setExperienceLevel("all");
                  fetchJobs();
                }}
                className="text-xs mt-2"
              >
                Reset All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);

              return (
                <Card
                  key={job.id}
                  className="glass-panel glow-card border-border/80 hover:border-primary/50 transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                      {/* Left: Job Meta & Info */}
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/jobs/${job.id}`}>
                            <h3 className="text-lg md:text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
                              {job.title}
                            </h3>
                          </Link>
                          {job.isLocalJob && (
                            <Badge variant="default" className="text-[10px] bg-indigo-600 font-semibold px-2 py-0.5">
                              Verified Post
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-[10px] font-medium border-border">
                            {job.job_type}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-muted-foreground">
                          <span className="font-semibold text-primary flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.candidate_required_location || job.location || "Remote"}
                          </span>
                          {job.salary && (
                            <span className="font-medium text-foreground flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                              {job.salary}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-muted-foreground/80">
                            <Clock className="w-3.5 h-3.5" />
                            Posted {formatDate(job.publication_date)}
                          </span>
                        </div>

                        {/* Description excerpt */}
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {job.description.replace(/<[^>]*>/g, "").substring(0, 190)}...
                        </p>

                        {/* Tags */}
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {job.tags.slice(0, 5).map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-[11px] font-normal py-0 px-2 bg-muted">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Action Buttons */}
                      <div className="flex sm:flex-row lg:flex-col items-center gap-2 w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0">
                        <Button
                          onClick={() => setApplyingJob(job)}
                          className="flex-1 lg:w-36 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-sm"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Apply Now
                        </Button>

                        <Link href={`/jobs/${job.id}`} className="flex-1 lg:w-36">
                          <Button variant="outline" className="w-full text-xs font-medium gap-1.5 border-border hover:border-primary/50">
                            <Eye className="w-3.5 h-3.5" />
                            Details
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSaveJob(job)}
                          className={`rounded-lg ${isSaved ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                          title={isSaved ? "Saved" : "Save Job"}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4 fill-primary" /> : <Bookmark className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Application Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <Card className="glass-panel border-border shadow-2xl max-w-lg w-full">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="text-[10px] text-primary mb-1">
                    Quick Application
                  </Badge>
                  <CardTitle className="text-lg font-bold">{applyingJob.title}</CardTitle>
                  <CardDescription className="text-xs">
                    at <strong className="text-foreground">{applyingJob.company}</strong> ({applyingJob.candidate_required_location || "Remote"})
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setApplyingJob(null)}
                  className="rounded-full text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Full Name *</label>
                  <Input
                    required
                    placeholder="e.g. Alex Morgan"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Email Address *</label>
                  <Input
                    type="email"
                    required
                    placeholder="e.g. alex@example.com"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Brief Note / Why You're a Great Fit *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Highlight your relevant engineering experience, GitHub projects, and reasons you're excited about this role..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full rounded-md border border-input bg-background/50 p-3 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmittingApp}
                    className="flex-1 font-semibold text-xs bg-primary hover:bg-primary/90 text-primary-foreground py-5"
                  >
                    {isSubmittingApp ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setApplyingJob(null)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
