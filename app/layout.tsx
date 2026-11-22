import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "sonner";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "NexHire AI — Next-Gen Intelligent Career & Hiring Platform",
  description:
    "Discover verified high-impact tech jobs, simulate interactive AI voice mock interviews, optimize resumes for ATS recruiter screens, and benchmark engineering skills with verified credentials.",
  keywords: [
    "AI job board",
    "mock interview AI",
    "ATS resume checker",
    "tech jobs",
    "coding interview prep",
    "software engineer careers",
    "NexHire",
  ],
  authors: [{ name: "Akshit Mehta" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground relative selection:bg-indigo-500/20 selection:text-indigo-600`}>
        {/* Apple-style ambient liquid background orbs */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[140px]" />
          <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[140px]" />
          <div className="absolute -bottom-32 left-1/4 w-[36rem] h-[36rem] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[140px]" />
        </div>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
