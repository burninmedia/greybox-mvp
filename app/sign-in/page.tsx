"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // For GitHub Pages static deployment, use localStorage-based auth
      // The API route at /api/auth/sign-in will be unavailable, so we simulate auth
      // For production (Vercel), replace this with a real API call
      const storedUser = localStorage.getItem("greybox_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === email) {
          sessionStorage.setItem("greybox_session", JSON.stringify({ email, userId: user.id }));
          router.push("/dashboard");
          return;
        }
      }

      // Simulate auth for demo purposes (replace with real auth in production)
      // In production, this would call your API route
      if (email && password.length >= 6) {
        const user = { id: `user_${Date.now()}`, email, firstName: email.split("@")[0] };
        localStorage.setItem("greybox_user", JSON.stringify(user));
        sessionStorage.setItem("greybox_session", JSON.stringify({ email, userId: user.id }));
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Use any email with a 6+ character password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="4" stroke="#00d4aa" strokeWidth="2"/>
            <rect x="7" y="7" width="10" height="10" rx="2" fill="#00d4aa" opacity="0.3"/>
            <rect x="9" y="9" width="6" height="6" rx="1" fill="#00d4aa"/>
          </svg>
          <span>GreyBox</span>
        </div>

        <h1 className={styles.title}>Sign in to GreyBox</h1>
        <p className={styles.subtitle}>Log, explain, and visualize your AI agent decisions.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className={styles.switch}>
          Don&apos;t have an account?{" "}
          <a href="/sign-up">Sign up</a>
        </p>

        <p className={styles.note}>
          <strong>Demo:</strong> Use any email + 6+ char password.
          Auth is simulated for GitHub Pages. Use Vercel for real auth.
        </p>
      </div>
    </div>
  );
}
