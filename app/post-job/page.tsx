import { JobPostingForm } from "@/components/job-posting-form";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="secondary" className="gap-1.5 py-1 px-3 bg-indigo-500/10 text-primary border-indigo-500/20">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            Employer Job Portal
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Post an Opening on <span className="gradient-text">NexHire AI</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Connect with top developers, designers, and engineering leaders actively evaluating high-growth opportunities.
          </p>
        </div>

        <JobPostingForm />
      </main>
      <Footer />
    </div>
  );
}
