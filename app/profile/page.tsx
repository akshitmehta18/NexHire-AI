import { UserProfile } from "@/components/user-profile";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
        <UserProfile />
      </main>
      <Footer />
    </div>
  );
}
