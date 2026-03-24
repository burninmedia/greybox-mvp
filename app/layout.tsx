import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreyBox — Agents are black boxes. We fix that.",
  description: "Log, explain, and visualize your AI agent decisions. Ship faster with full observability.",
};

// NOTE: Clerk is disabled for GitHub Pages static deployment.
// Auth is handled client-side via localStorage.
// For Vercel: restore ClerkProvider here (import from '@clerk/nextjs' and wrap children).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
