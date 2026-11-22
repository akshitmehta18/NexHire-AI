"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApplicationForm } from "./application-form";
import { INITIAL_JOBS, JobItem } from "@/constants/seed-data";
import { toast } from "sonner";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  ExternalLink,
  Mail,
  ArrowLeft,
  FileText,
  Users,
  Award,
  Bookmark,
  BookmarkCheck,
  Send,
  Share2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface JobDetailsProps {
  jobId: string;
}

export function JobDetails({ jobId }: JobDetailsProps) {
  const [job, setJob] = useState<JobItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        // 1. Check seed jobs first
        const seedMatch = INITIAL_JOBS.find((j) => j.id.toString() === jobId);
        if (seedMatch) {
          setJob(seedMatch);
          checkSaved(seedMatch.id);
          setLoading(false);
          return;
        }

        // 2. Check local jobs in localStorage
        const localJobs: JobItem[] = JSON.parse(localStorage.getItem("localJobs") || "[]");
        const localMatch = localJobs.find((j) => j.id.toString() === jobId);
        if (localMatch) {
          setJob(localMatch);
          checkSaved(localMatch.id);
          setLoading(false);
          return;
        }

        // 3. Try Remotive API
        try {
          const res = await fetch("https://remotive.com/api/remote-jobs");
          if (res.ok) {
            const data = await res.json();
            const remoteMatch = data.jobs?.find((j: any) => j.id.toString() === jobId);
            if (remoteMatch) {
              const formatted: JobItem = {
                id: remoteMatch.id,
                title: remoteMatch.title,
                company: remoteMatch.company_name,
                location: remoteMatch.candidate_required_location || "Remote",
                job_type: remoteMatch.job_type || "Full-time",
                publication_date: remoteMatch.publication_date || new Date().toISOString(),
                candidate_required_location: remoteMatch.candidate_required_location || "Remote",
                salary: remoteMatch.salary || "$120,000 - $170,000",
                description: remoteMatch.description || "",
                url: remoteMatch.url || "#",
                tags: remoteMatch.tags || ["Engineering", "Remote"],
                isLocalJob: false,
                experienceLevel: "Mid Level",
              };
              setJob(formatted);
              checkSaved(formatted.id);
              setLoading(false);
              return;
            }
          }
        } catch (apiErr) {
          console.warn("Remotive job detail fetch error", apiErr);
        }
      } catch (err) {
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const checkSaved = (id: number) => {
    try {
      const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      setIsSaved(saved.some((j: any) => j.id === id));
    } catch (e) {
      console.warn(e);
    }
  };

  const toggleSave = () => {
    if (!job) return;
    try {
      const saved: JobItem[] = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      if (isSaved) {
        const updated = saved.filter((j) => j.id !== job.id);
        localStorage.setItem("savedJobs", JSON.stringify(updated));
        setIsSaved(false);
        toast.info("Job removed from saved list");
      } else {
        const updated = [job, ...saved];
        localStorage.setItem("savedJobs", JSON.stringify(updated));
        setIsSaved(true);
        toast.success("Job saved to profile!");
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const copyJobLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Job link copied to clipboard!");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Loading position details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-16 space-y-4 max-w-md mx-auto">
        <Building2 className="w-12 h-12 text-muted-foreground mx-auto" />
        <h2 className="text-2xl font-bold">Position Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The job listing you requested may have expired or is no longer accepting applications.
        </p>
        <Link href="/">
          <Button variant="default" className="text-xs gap-2">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Job Board
          </Button>
        </Link>
      </div>
    );
  }

  if (showApplicationForm) {
    return <ApplicationForm job={job} onBack={() => setShowApplicationForm(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to All Roles
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleSave} className="gap-1.5 text-xs">
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-primary fill-primary" /> : <Bookmark className="w-4 h-4" />}
            {isSaved ? "Saved" : "Save Job"}
          </Button>
          <Button variant="ghost" size="sm" onClick={copyJobLink} className="gap-1.5 text-xs">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Main Job Header Card */}
      <Card className="glass-panel border-border/80 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{job.title}</h1>
                  {job.isLocalJob && (
                    <Badge variant="default" className="text-xs bg-indigo-600 font-semibold">
                      Verified Post
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {job.job_type}
                  </Badge>
                </div>
                <p className="text-xl font-bold text-primary flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {job.company}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  {job.candidate_required_location || job.location || "Remote"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Posted {formatDate(job.publication_date)}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                    {job.salary}
                  </span>
                )}
                {job.experienceLevel && (
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <Award className="w-4 h-4 text-indigo-500" />
                    {job.experienceLevel}
                  </span>
                )}
              </div>

              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {job.tags.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs px-2.5 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Panel */}
            <div className="flex flex-col gap-3 w-full md:w-48 shrink-0">
              <Button
                onClick={() => setShowApplicationForm(true)}
                size="lg"
                className="w-full gap-2 text-sm font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 py-6"
              >
                <Send className="w-4 h-4" />
                Apply for Position
              </Button>

              {job.companyWebsite && (
                <Button variant="outline" size="sm" asChild className="w-full text-xs gap-1.5 border-border">
                  <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer">
                    Company Site
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Description Card */}
      <Card className="glass-panel border-border/80 shadow-md">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Position Overview & Responsibilities
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div
            className="prose dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed space-y-3"
            dangerouslySetInnerHTML={{
              __html: job.description.replace(/\n/g, "<br />"),
            }}
          />
        </CardContent>
      </Card>

      {/* Requirements Card */}
      {job.requirements && (
        <Card className="glass-panel border-border/80 shadow-md">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Requirements & Qualifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div
              className="prose dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed space-y-2"
              dangerouslySetInnerHTML={{
                __html: job.requirements.replace(/\n/g, "<br />"),
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Benefits Card */}
      {job.benefits && (
        <Card className="glass-panel border-border/80 shadow-md">
          <CardHeader className="pb-3 border-b border-border/60">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-500" />
              Perks, Benefits & Culture
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div
              className="prose dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed space-y-2"
              dangerouslySetInnerHTML={{
                __html: job.benefits.replace(/\n/g, "<br />"),
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Bottom CTA Card */}
      <Card className="border-border/80 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 p-6 text-center space-y-3 rounded-2xl">
        <h3 className="text-xl font-bold text-foreground">Interested in this role at {job.company}?</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Submit your application directly through NexHire AI with your customized resume and cover letter.
        </p>
        <Button
          onClick={() => setShowApplicationForm(true)}
          className="gap-2 px-8 py-5 text-xs font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
        >
          <Send className="w-4 h-4" />
          Apply Now
        </Button>
      </Card>
    </div>
  );
}
