import { SignupForm } from "@/components/signup-form";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <SignupForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
