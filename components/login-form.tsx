"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LogIn, Eye, EyeOff, Sparkles, User, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Welcome back!");
        router.push("/profile");
      } else {
        // Auto create account if doesn't exist for seamless user testing
        await signup({
          firstName: email.split("@")[0] || "User",
          lastName: "Candidate",
          email,
          password,
          userType: "job-seeker",
        });
        toast.success("Account created and logged in!");
        router.push("/profile");
      }
    } catch (err) {
      setError("An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoCandidate = async () => {
    setIsLoading(true);
    try {
      await signup({
        firstName: "Alex",
        lastName: "Chen",
        email: "alex.chen@example.com",
        password: "password123",
        userType: "job-seeker",
      });
      toast.success("Signed in as Demo Candidate: Alex Chen");
      router.push("/profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoEmployer = async () => {
    setIsLoading(true);
    try {
      await signup({
        firstName: "Sarah",
        lastName: "Recruiter",
        email: "sarah@techcorp.com",
        password: "password123",
        userType: "employer",
      });
      toast.success("Signed in as Demo Employer: Sarah (TechCorp)");
      router.push("/profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-panel border-border/80 shadow-xl max-w-md mx-auto">
      <CardHeader className="text-center pb-4 border-b border-border/60">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-500/20 mb-2">
          <LogIn className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold">Sign In to NexHire AI</CardTitle>
        <CardDescription className="text-xs">
          Access your mock interview scorecards, job applications, and ATS reports.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-5">
        {/* Quick 1-Click Demo Buttons */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block text-center">
            Instant 1-Click Demo Access
          </span>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoCandidate}
              disabled={isLoading}
              className="text-xs font-semibold gap-1.5 h-9 border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10 text-primary"
            >
              <User className="w-3.5 h-3.5" />
              Job Seeker Demo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoEmployer}
              disabled={isLoading}
              className="text-xs font-semibold gap-1.5 h-9 border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
            >
              <Building2 className="w-3.5 h-3.5" />
              Employer Demo
            </Button>
          </div>
        </div>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground text-[10px] font-medium">Or Sign In with Email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-lg text-xs">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 text-xs bg-background/50"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-semibold">Password</Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 text-xs bg-background/50 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Continue to Dashboard"}
          </Button>

          <div className="text-center text-xs pt-1">
            <span className="text-muted-foreground">New to NexHire AI? </span>
            <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
