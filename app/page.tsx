import { JobSearch } from "@/components/job-search";
import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <Hero />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <JobSearch />
      </main>
      <Footer />
    </div>
  );
}
