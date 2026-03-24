"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./auth.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // For GitHub Pages static deployment, simulate account creation
      // In production (Vercel), replace with real API call to /api/auth/sign-up
      const user = { id: `user_${Date.now()}`, email, firstName: email.split("@")[0] };
      localStorage.setItem("greybox_user", JSON.stringify(user));
      sessionStorage.setItem("greybox_session", JSON.stringify({ email, userId: user.id }));
      router.push("/dashboard");
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

        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Start logging and explaining your AI agent decisions.</p>

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

          <div className={styles.field}>
            <label htmlFor="confirm">Confirm password</label>
            <input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className={styles.switch}>
          Already have an account?{" "}
          <a href="/sign-in">Sign in</a>
        </p>

        <p className={styles.note}>
          <strong>Demo:</strong> Auth is simulated for GitHub Pages. Use Vercel for production auth.
        </p>
      </div>
    </div>
  );
}
