"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/use-auth";
import {
  Briefcase,
  PlusCircle,
  Brain,
  User,
  LogIn,
  BookOpen,
  Sparkles,
  Mic,
  FileCheck2,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";

export function Navigation() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Jobs", icon: Briefcase },
    { href: "/post-job", label: "Post Job", icon: PlusCircle },
    { href: "/interview", label: "Mock Interview", icon: Mic },
    { href: "/resume-analyzer", label: "ATS Scanner", icon: FileCheck2, badge: "NEW" },
    { href: "/quiz", label: "Skill Quizzes", icon: Brain },
    { href: "/pyqs", label: "PYQs", icon: BookOpen },
    { href: "/ai-guidance", label: "Career Mentor", icon: Sparkles },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                NexHire<span className="text-foreground">.ai</span>
              </span>
              <span className="text-[10px] text-muted-foreground -mt-1 font-medium tracking-wide">
                NEXT-GEN CAREER PLATFORM
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`relative gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      active
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-indigo-500 text-white leading-tight">
                        {link.badge}
                      </span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Auth + Theme + Mobile toggle) */}
          <div className="flex items-center gap-2.5">
            <ModeToggle />

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full border-border/80 hover:border-primary/50"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.firstName ? user.firstName[0].toUpperCase() : "U"}
                    </div>
                    <span className="hidden sm:inline-block max-w-[100px] truncate text-xs font-medium">
                      {user.firstName || "Profile"}
                    </span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-muted-foreground hover:text-destructive"
                  onClick={() => logout()}
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-xs font-medium">
                    <LogIn className="w-3.5 h-3.5 mr-1.5" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    size="sm"
                    className="text-xs font-medium rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border/80 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge ? (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500 text-white">
                    {link.badge}
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
                )}
              </Link>
            );
          })}

          {!user && (
            <div className="pt-3 border-t border-border flex gap-2">
              <Link href="/auth/login" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full text-xs">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full text-xs">Create Account</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
