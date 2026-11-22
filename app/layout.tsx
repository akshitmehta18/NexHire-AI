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
      <body className={`${geist.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}>
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
