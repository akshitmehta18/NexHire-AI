"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Plus,
  X,
  Sparkles,
  Send,
  Eye,
  CheckCircle2,
  Briefcase,
} from "lucide-react";

export function JobPostingForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "Senior Full Stack Engineer",
    company: "Acme Cloud AI",
    location: "San Francisco, CA",
    jobType: "Full-time",
    salaryMin: "140,000",
    salaryMax: "185,000",
    currency: "USD",
    description: "We are building the next generation of cloud infrastructure. You will architect serverless microservices and lead full-stack feature development with Next.js, TypeScript, and PostgreSQL.",
    requirements: "• 4+ years building production web apps\n• Mastery of React, Next.js, and TypeScript\n• Experience with SQL schema design and Docker",
    benefits: "• 100% remote work flexibility\n• Comprehensive health, dental, and vision\n• $2,500 annual conference and learning budget",
    contactEmail: user?.email || "hiring@acme.ai",
    companyWebsite: "https://example.com",
    tags: ["Next.js", "TypeScript", "React", "PostgreSQL", "Remote"],
    isRemote: true,
    experienceLevel: "Senior Level",
  });

  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formattedSalary =
        formData.salaryMin && formData.salaryMax
          ? `${formData.currency === "USD" ? "$" : formData.currency + " "}${formData.salaryMin} - ${formData.salaryMax}`
          : "$120,000 - $160,000";

      const newJob = {
        id: Date.now(),
        title: formData.title,
        company: formData.company,
        location: formData.isRemote ? "Remote" : formData.location,
        candidate_required_location: formData.isRemote ? "Worldwide / Remote" : formData.location,
        job_type: formData.jobType,
        publication_date: new Date().toISOString(),
        salary: formattedSalary,
        description: formData.description,
        requirements: formData.requirements,
        benefits: formData.benefits,
        contactEmail: formData.contactEmail,
        companyWebsite: formData.companyWebsite,
        url: `mailto:${formData.contactEmail}`,
        tags: formData.tags,
        isLocalJob: true,
        postedBy: user?.id || "guest-employer",
        postedByName: user ? `${user.firstName} ${user.lastName}` : formData.company,
        experienceLevel: formData.experienceLevel,
      };

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem("localJobs") || "[]");
      localStorage.setItem("localJobs", JSON.stringify([newJob, ...existing]));

      // Also try to post to API
      try {
        await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newJob),
        });
      } catch (apiErr) {
        console.warn("Backend job sync notice:", apiErr);
      }

      toast.success(`Job opening for "${formData.title}" published!`);
      setTimeout(() => {
        router.push("/profile");
      }, 700);
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("Error posting job opening.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Form Column */}
      <div className="lg:col-span-7">
        <Card className="glass-panel border-border/80 shadow-xl">
          <CardHeader className="pb-4 border-b border-border/60">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Job Opening Details
            </CardTitle>
            <CardDescription className="text-xs">
              Reach tens of thousands of skilled engineers and designers actively looking for their next opportunity.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Job Title & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs font-semibold">Job Title *</Label>
                  <Input
                    id="title"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="h-10 text-xs bg-background/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-xs font-semibold">Company Name *</Label>
                  <Input
                    id="company"
                    required
                    placeholder="e.g. Stripe, Vercel, Startup"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="h-10 text-xs bg-background/50"
                  />
                </div>
              </div>

              {/* Location & Remote */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs font-semibold">Location</Label>
                  <Input
                    id="location"
                    disabled={formData.isRemote}
                    placeholder="e.g. San Francisco, CA or Bengaluru"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="h-10 text-xs bg-background/50"
                  />
                </div>

                <div className="pt-5 flex items-center space-x-2">
                  <Checkbox
                    id="isRemote"
                    checked={formData.isRemote}
                    onCheckedChange={(c) => handleInputChange("isRemote", Boolean(c))}
                  />
                  <Label htmlFor="isRemote" className="text-xs font-semibold cursor-pointer">
                    100% Remote Opportunity
                  </Label>
                </div>
              </div>

              {/* Job Type & Experience Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Employment Type</Label>
                  <Select value={formData.jobType} onValueChange={(v) => handleInputChange("jobType", v)}>
                    <SelectTrigger className="h-10 text-xs bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Experience Level</Label>
                  <Select value={formData.experienceLevel} onValueChange={(v) => handleInputChange("experienceLevel", v)}>
                    <SelectTrigger className="h-10 text-xs bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry Level">Entry / Junior Level</SelectItem>
                      <SelectItem value="Mid Level">Mid Level</SelectItem>
                      <SelectItem value="Senior Level">Senior Level</SelectItem>
                      <SelectItem value="Lead/Principal">Lead / Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Salary Range */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Annual Compensation Range</Label>
                <div className="flex items-center gap-2">
                  <Select value={formData.currency} onValueChange={(v) => handleInputChange("currency", v)}>
                    <SelectTrigger className="w-24 h-10 text-xs bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Min (e.g. 130,000)"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                    className="h-10 text-xs bg-background/50"
                  />
                  <span className="text-xs text-muted-foreground">to</span>
                  <Input
                    placeholder="Max (e.g. 175,000)"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                    className="h-10 text-xs bg-background/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="desc" className="text-xs font-semibold">Role Description *</Label>
                <Textarea
                  id="desc"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Detail the mission, stack, and daily impact of the role..."
                  className="text-xs leading-relaxed bg-background/50"
                />
              </div>

              {/* Requirements & Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="req" className="text-xs font-semibold">Requirements</Label>
                  <Textarea
                    id="req"
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    placeholder="Bullet points of necessary skills..."
                    className="text-xs leading-relaxed bg-background/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="benefits" className="text-xs font-semibold">Benefits & Perks</Label>
                  <Textarea
                    id="benefits"
                    rows={3}
                    value={formData.benefits}
                    onChange={(e) => handleInputChange("benefits", e.target.value)}
                    placeholder="Healthcare, equity, PTO, learning stipend..."
                    className="text-xs leading-relaxed bg-background/50"
                  />
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Skills & Tech Stack Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a technology (e.g. Next.js, Docker, Go)..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="h-10 text-xs bg-background/50"
                  />
                  <Button type="button" onClick={addTag} variant="outline" size="sm" className="h-10 px-3">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs gap-1.5 py-0.5 px-2 bg-muted">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact Email & Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contactEmail" className="text-xs font-semibold">Contact / Application Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    className="h-10 text-xs bg-background/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="companyWebsite" className="text-xs font-semibold">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    type="url"
                    value={formData.companyWebsite}
                    onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                    className="h-10 text-xs bg-background/50"
                  />
                </div>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 font-semibold text-sm rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-500/20 gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Publishing Job Listing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Publish Job Opening
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Live Interactive Card Preview */}
      <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-primary" />
            Live Candidate Preview
          </span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
            Updates in real-time
          </span>
        </div>

        <Card className="glass-panel border-border/80 shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  {formData.title || "Job Title"}
                </h3>
                <Badge variant="default" className="text-[10px] bg-indigo-600">
                  Verified Post
                </Badge>
              </div>
              <p className="text-sm font-semibold text-primary">{formData.company || "Company Name"}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {formData.isRemote ? "Remote" : formData.location || "Location"}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {formData.jobType}
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <DollarSign className="w-3.5 h-3.5" />
                {formData.salaryMin && formData.salaryMax
                  ? `${formData.currency} ${formData.salaryMin} - ${formData.salaryMax}`
                  : "Competitive Salary"}
              </span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {formData.description || "Job description excerpt will appear here..."}
            </p>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {formData.tags.slice(0, 5).map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px] py-0 px-2">
                    {t}
                  </Badge>
                ))}
              </div>
            )}

            <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
              <span>Experience: {formData.experienceLevel}</span>
              <Button size="sm" disabled className="h-8 text-xs font-semibold opacity-80">
                Apply Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
