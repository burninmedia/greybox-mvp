import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreyBox — Agents are black boxes. We fix that.",
  description: "Log, explain, and visualize your AI agent decisions. Ship faster with full observability.",
};

function isValidClerkKey(key: string | undefined): boolean {
  if (!key) return false;
  // Clerk publishable keys start with pk_test_ or pk_live_ and are followed by a base64-like string
  return /^pk_(test|live)_[A-Za-z0-9]+$/.test(key);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const hasValidKey = isValidClerkKey(publishableKey);

  if (!hasValidKey) {
    // Skip ClerkProvider during build without valid credentials
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }

  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
