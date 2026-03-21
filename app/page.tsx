import Link from "next/link";
import styles from "./page.module.css";

export default function LandingPage() {
  return (
    <div className={styles.page}>
      {/* Nav */}
      <nav className={styles.nav}>
        <div className="container">
          <div className={styles.navInner}>
            <div className={styles.logo}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="4" stroke="#00d4aa" strokeWidth="2"/>
                <rect x="7" y="7" width="10" height="10" rx="2" fill="#00d4aa" opacity="0.3"/>
                <rect x="9" y="9" width="6" height="6" rx="1" fill="#00d4aa"/>
              </svg>
              <span>GreyBox</span>
            </div>
            <div className={styles.navLinks}>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#pricing">Pricing</a>
              <Link href="/dashboard">
                <button className="btn btn-secondary">Sign in</button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroBadge}>
            <span className={styles.dot} />
            Now in public beta
          </div>
          <h1 className={styles.heroTitle}>
            Agents are black boxes.<br />
            <span className={styles.heroAccent}>We fix that.</span>
          </h1>
          <p className={styles.heroSub}>
            GreyBox gives you complete observability into your AI agents — every decision,
            every tool call, every reasoning step. Ship faster. Debug easier. Sleep better.
          </p>
          <div className={styles.heroCta}>
            <Link href="/sign-up">
              <button className="btn btn-primary btn-lg">
                Start free — no credit card
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </Link>
            <a href="#how-it-works" className="btn btn-ghost">
              See how it works
            </a>
          </div>
          <div className={styles.heroCode}>
            <pre><code>{`// One line to start logging
POST /api/v1/log
Authorization: Bearer YOUR_API_KEY

{
  "agentId": "agent_abc123",
  "sessionId": "sess_xyz789",
  "action": "web_search",
  "reasoning": "User asked about weather in NYC",
  "confidence": 0.94,
  "tools": ["web_search", "calculator"]
}`}</code></pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className={styles.features}>
        <div className="container">
          <div className={styles.sectionLabel}>What you get</div>
          <h2 className={styles.sectionTitle}>Full agent observability</h2>
          <div className="grid-3">
            <div className="card">
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3>Logging</h3>
              <p>Capture every agent action — tool calls, decisions, context windows. Structured data you can query.</p>
            </div>
            <div className="card">
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4M12 8h.01"/>
                </svg>
              </div>
              <h3>Explanation</h3>
              <p>Every decision comes with reasoning. See exactly why your agent did what it did — not just what it did.</p>
            </div>
            <div className="card">
              <div className={styles.featureIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3>Visualization</h3>
              <p>Timeline views, session graphs, confidence charts. Turn raw logs into actionable insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className="container">
          <div className={styles.sectionLabel}>Getting started</div>
          <h2 className={styles.sectionTitle}>Three steps to full visibility</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>01</div>
              <div className={styles.stepContent}>
                <h3>Integrate</h3>
                <p>Add one API call to your agent. Supply your API key and start sending events — no SDK required.</p>
              </div>
            </div>
            <div className={styles.stepArrow}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>02</div>
              <div className={styles.stepContent}>
                <h3>Capture</h3>
                <p>Every action, tool call, and decision gets logged automatically. Structured. Searchable. Permanent.</p>
              </div>
            </div>
            <div className={styles.stepArrow}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>03</div>
              <div className={styles.stepContent}>
                <h3>Query</h3>
                <p>Search sessions, filter by agent or tool, drill into reasoning chains. Find issues in seconds.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className={styles.pricing}>
        <div className="container">
          <div className={styles.sectionLabel}>Pricing</div>
          <h2 className={styles.sectionTitle}>Simple, honest pricing</h2>
          <div className="grid-2">
            <div className="card">
              <div className={styles.planName}>Free</div>
              <div className={styles.planPrice}>$0<span>/mo</span></div>
              <ul className={styles.planFeatures}>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  10,000 events/month
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  3 agents
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  7-day log retention
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Basic dashboard
                </li>
              </ul>
              <Link href="/sign-up">
                <button className="btn btn-secondary" style={{width: "100%"}}>Get started</button>
              </Link>
            </div>
            <div className={`card ${styles.proCard}`}>
              <div className={styles.proBadge}>Most popular</div>
              <div className={styles.planName}>Pro</div>
              <div className={styles.planPrice}>$29<span>/mo</span></div>
              <ul className={styles.planFeatures}>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Unlimited events
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Unlimited agents
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  90-day log retention
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Advanced visualization
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Priority support
                </li>
              </ul>
              <Link href="/sign-up?upgrade=true">
                <button className="btn btn-primary" style={{width: "100%"}}>Upgrade to Pro</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className={styles.ctaBanner}>
        <div className="container">
          <h2>Start debugging your agents today</h2>
          <p>Free forever for small projects. No credit card required.</p>
          <Link href="/sign-up">
            <button className="btn btn-primary">Get your API key</button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <div className={styles.footerLogo}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="4" stroke="#00d4aa" strokeWidth="2"/>
                <rect x="7" y="7" width="10" height="10" rx="2" fill="#00d4aa" opacity="0.3"/>
                <rect x="9" y="9" width="6" height="6" rx="1" fill="#00d4aa"/>
              </svg>
              <span>GreyBox</span>
            </div>
            <div className={styles.footerLinks}>
              <a href="#">Documentation</a>
              <a href="#">API Reference</a>
              <a href="#">Status</a>
              <a href="#">Privacy</a>
            </div>
            <div className={styles.footerCopy}>© 2026 GreyBox. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
