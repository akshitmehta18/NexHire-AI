"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { ArrowLeft, User, Send, CheckCircle2, ShieldCheck, Upload } from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  isLocalJob?: boolean;
}

interface ApplicationFormProps {
  job: Job;
  onBack: () => void;
}

export function ApplicationForm({ job, onBack }: ApplicationFormProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    linkedinUrl: "",
    portfolioUrl: "",
    coverLetter: "",
    resumeFileName: "Alex_Chen_Resume.pdf",
    agreedToTerms: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, resumeFileName: file.name }));
      toast.success(`Attached ${file.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      toast.error("Please agree to the privacy policy to submit.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const application = {
          id: Date.now(),
          userId: user?.id || "guest",
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          applicantName: `${formData.firstName} ${formData.lastName}`.trim() || "Candidate",
          email: formData.email,
          phone: formData.phone,
          linkedinUrl: formData.linkedinUrl,
          portfolioUrl: formData.portfolioUrl,
          coverLetter: formData.coverLetter,
          resumeFileName: formData.resumeFileName,
          appliedDate: new Date().toISOString(),
          status: "Under Review",
        };

        const existingApplications = JSON.parse(localStorage.getItem("jobApplications") || "[]");
        localStorage.setItem("jobApplications", JSON.stringify([application, ...existingApplications]));

        setIsSubmitting(false);
        setSubmitted(true);
        toast.success(`Application sent to ${job.company}!`);
      } catch (err) {
        console.error(err);
        setIsSubmitting(false);
        toast.error("Failed to submit application. Please try again.");
      }
    }, 900);
  };

  if (submitted) {
    return (
      <Card className="glass-panel border-border/80 max-w-xl mx-auto text-center p-8 space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Application Received!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your application for <strong className="text-foreground">{job.title}</strong> at{" "}
            <strong className="text-foreground">{job.company}</strong> has been successfully submitted. You can track the status in your Candidate Dashboard.
          </p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <Button onClick={onBack} variant="outline" className="text-xs">
            Back to Job Details
          </Button>
          <a href="/profile">
            <Button className="text-xs font-semibold">View in Dashboard</Button>
          </a>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" />
        Back to Job Description
      </Button>

      <Card className="glass-panel border-border/80 shadow-xl">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Apply for {job.title}</CardTitle>
              <CardDescription className="text-xs">
                at <strong className="text-foreground">{job.company}</strong>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-semibold">First Name *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="h-10 text-xs bg-background/50"
                  placeholder="e.g. Alex"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-semibold">Last Name *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="h-10 text-xs bg-background/50"
                  placeholder="e.g. Morgan"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="h-10 text-xs bg-background/50"
                  placeholder="e.g. alex@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-10 text-xs bg-background/50"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-xs font-semibold">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                  className="h-10 text-xs bg-background/50"
                  placeholder="https://linkedin.com/in/alex"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="portfolio" className="text-xs font-semibold">GitHub / Portfolio Website</Label>
                <Input
                  id="portfolio"
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                  className="h-10 text-xs bg-background/50"
                  placeholder="https://github.com/alex"
                />
              </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Resume Attachment *</Label>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background/40">
                <label className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" className="text-xs gap-1.5 pointer-events-none">
                    <Upload className="w-3.5 h-3.5" />
                    Choose File
                  </Button>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-muted-foreground truncate">
                  {formData.resumeFileName || "PDF or DOCX format"}
                </span>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="space-y-1.5">
              <Label htmlFor="coverLetter" className="text-xs font-semibold">
                Cover Note / Message to Hiring Team *
              </Label>
              <Textarea
                id="coverLetter"
                required
                rows={5}
                value={formData.coverLetter}
                onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                placeholder="Share a concise summary of why you're a great fit for this role, mentioning relevant stack experience..."
                className="text-xs leading-relaxed bg-background/50"
              />
            </div>

            {/* Agreement */}
            <div className="flex items-start space-x-2 pt-1">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(c) => handleInputChange("agreedToTerms", Boolean(c))}
                className="mt-0.5"
              />
              <Label htmlFor="terms" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                I authorize NexHire AI to securely forward my application profile and resume details to the hiring team at {job.company}.
              </Label>
            </div>

            <div className="flex gap-3 pt-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 font-semibold text-xs py-5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Submit Application
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onBack} className="text-xs">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
