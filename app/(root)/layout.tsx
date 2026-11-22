import { ReactNode } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
