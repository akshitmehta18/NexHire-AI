"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Eye, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

type UserType = "job-seeker" | "employer" | "both";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: UserType | "";
}

export function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "job-seeker",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const router = useRouter();

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const success = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        userType: (formData.userType as UserType) || "job-seeker",
      });

      if (success) {
        toast.success("Account created successfully!");
        router.push("/profile");
      } else {
        setError("An account with this email already exists");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-panel border-border/80 shadow-xl max-w-md mx-auto">
      <CardHeader className="text-center pb-4 border-b border-border/60">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-500/20 mb-2">
          <UserPlus className="w-6 h-6" />
        </div>
        <CardTitle className="text-2xl font-bold">Create NexHire AI Account</CardTitle>
        <CardDescription className="text-xs">
          Join thousands of developers and recruiters accelerating their hiring pipeline.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-3 py-2 rounded-lg text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-xs font-semibold">First Name *</Label>
              <Input
                id="firstName"
                placeholder="Alex"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                className="h-10 text-xs bg-background/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-xs font-semibold">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Chen"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                className="h-10 text-xs bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="alex@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className="h-10 text-xs bg-background/50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="userType" className="text-xs font-semibold">Primary Focus</Label>
            <Select value={formData.userType} onValueChange={(v) => handleInputChange("userType", v)}>
              <SelectTrigger className="h-10 text-xs bg-background/50">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="job-seeker">Job Seeker (Candidate)</SelectItem>
                <SelectItem value="employer">Employer / Recruiter</SelectItem>
                <SelectItem value="both">Both (Seeker & Hiring Manager)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-semibold">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
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

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-semibold">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
                className="h-10 text-xs bg-background/50 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account & Get Started"}
          </Button>

          <div className="text-center text-xs pt-1">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/auth/login" className="text-primary hover:underline font-semibold">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
