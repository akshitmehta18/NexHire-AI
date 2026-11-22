import { JobDetails } from "@/components/job-details";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

interface JobPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <JobDetails jobId={id} />
      </main>
      <Footer />
    </div>
  );
}
