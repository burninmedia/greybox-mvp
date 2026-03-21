"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

// Sample audit events for display
const SAMPLE_EVENTS = [
  {
    id: "evt_01",
    agentId: "agent_climate_bot",
    sessionId: "sess_4f8a2b",
    action: "web_search",
    reasoning: "User asked about current weather in Seattle. Need to fetch real-time weather data.",
    confidence: 0.97,
    tools: ["web_search"],
    createdAt: "2026-03-21T13:30:00Z",
  },
  {
    id: "evt_02",
    agentId: "agent_climate_bot",
    sessionId: "sess_4f8a2b",
    action: "tool_call",
    reasoning: "Web search returned weather data. Now calling calculator to convert Fahrenheit to Celsius.",
    confidence: 0.99,
    tools: ["calculator"],
    createdAt: "2026-03-21T13:30:02Z",
  },
  {
    id: "evt_03",
    agentId: "agent_climate_bot",
    sessionId: "sess_4f8a2b",
    action: "response_generated",
    reasoning: "All data collected. Formatting final response with temperature and conditions.",
    confidence: 0.95,
    tools: [],
    createdAt: "2026-03-21T13:30:05Z",
  },
  {
    id: "evt_04",
    agentId: "agent_code_review",
    sessionId: "sess_9c3d71",
    action: "file_read",
    reasoning: "Reading auth.ts to check for security vulnerabilities before review.",
    confidence: 0.88,
    tools: ["file_system"],
    createdAt: "2026-03-21T12:15:00Z",
  },
  {
    id: "evt_05",
    agentId: "agent_code_review",
    sessionId: "sess_9c3d71",
    action: "security_check",
    reasoning: "Found potential SQL injection in user query builder. Flagging for review.",
    confidence: 0.92,
    tools: ["code_analysis"],
    createdAt: "2026-03-21T12:15:03Z",
  },
  {
    id: "evt_06",
    agentId: "agent_support_bot",
    sessionId: "sess_2e7f44",
    action: "context_retrieval",
    reasoning: "User asking about billing. Retrieving account history from database.",
    confidence: 0.96,
    tools: ["db_query"],
    createdAt: "2026-03-21T11:00:00Z",
  },
  {
    id: "evt_07",
    agentId: "agent_support_bot",
    sessionId: "sess_2e7f44",
    action: "response_generated",
    reasoning: "Found 2 invoices. Formatting response with payment links.",
    confidence: 0.98,
    tools: [],
    createdAt: "2026-03-21T11:00:04Z",
  },
  {
    id: "evt_08",
    agentId: "agent_research",
    sessionId: "sess_8a1c33",
    action: "web_search",
    reasoning: "Researching latest LLM benchmarks for client report.",
    confidence: 0.93,
    tools: ["web_search"],
    createdAt: "2026-03-20T16:45:00Z",
  },
];

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getActionColor(action: string) {
  if (action.includes("search")) return "#3b82f6";
  if (action.includes("tool")) return "#a855f7";
  if (action.includes("response")) return "#22c55e";
  if (action.includes("security")) return "#f59e0b";
  if (action.includes("file")) return "#6366f1";
  if (action.includes("context")) return "#14b8a6";
  return "#888";
}

export default function DashboardContent() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const isPro = user?.publicMetadata?.is_pro === true;
  const apiKey = (user?.publicMetadata?.api_key as string) || "gbx_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  const eventsUsed = 3247;
  const eventsLimit = isPro ? "∞" : "10,000";

  function copyKey() {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!isLoaded) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.loading}>
        <p>Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <div className={styles.logo}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="4" stroke="#00d4aa" strokeWidth="2"/>
                <rect x="7" y="7" width="10" height="10" rx="2" fill="#00d4aa" opacity="0.3"/>
                <rect x="9" y="9" width="6" height="6" rx="1" fill="#00d4aa"/>
              </svg>
              <span>GreyBox</span>
            </div>
            <div className={styles.headerRight}>
              <span className={styles.userEmail}>{user.primaryEmailAddress?.emailAddress}</span>
              <button onClick={() => signOut()} className="btn btn-ghost">Sign out</button>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className="container">
          {/* Welcome */}
          <div className={styles.welcome}>
            <h1>Welcome back{user.firstName ? `, ${user.firstName}` : ""}</h1>
            <p>Here&apos;s what&apos;s happening with your agents.</p>
          </div>

          {/* Stats Row */}
          <div className={styles.statsRow}>
            <div className={`card ${styles.statCard}`}>
              <div className={styles.statLabel}>Events this month</div>
              <div className={styles.statValue}>
                {eventsUsed.toLocaleString()}
                <span className={styles.statLimit}>/ {eventsLimit}</span>
              </div>
              <div className={styles.statBar}>
                <div
                  className={styles.statBarFill}
                  style={{ width: `${Math.min((eventsUsed / 10000) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className={`card ${styles.statCard}`}>
              <div className={styles.statLabel}>Plan</div>
              <div className={styles.statValue}>
                {isPro ? (
                  <span className={styles.proBadge}>Pro</span>
                ) : (
                  <span>Free</span>
                )}
              </div>
              <div className={styles.statSub}>
                {isPro ? "Unlimited events" : "Upgrade available"}
              </div>
            </div>

            <div className={`card ${styles.statCard}`}>
              <div className={styles.statLabel}>Active agents</div>
              <div className={styles.statValue}>3</div>
              <div className={styles.statSub}>Across all sessions</div>
            </div>
          </div>

          {/* API Key */}
          <div className={`card ${styles.apiKeyCard}`}>
            <div className={styles.apiKeyHeader}>
              <div>
                <h2>API Key</h2>
                <p>Use this key to send events from your agents.</p>
              </div>
              {!isPro && (
                <a href="#upgrade">
                  <button className="btn btn-primary">Upgrade to Pro</button>
                </a>
              )}
            </div>
            <div className={styles.apiKeyRow}>
              <code className={styles.apiKeyValue}>
                {showApiKey ? apiKey : apiKey.slice(0, 12) + "•".repeat(28) + apiKey.slice(-4)}
              </code>
              <div className={styles.apiKeyActions}>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="btn btn-ghost"
                  title={showApiKey ? "Hide key" : "Show key"}
                >
                  {showApiKey ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
                <button onClick={copyKey} className="btn btn-ghost">
                  {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <p className={styles.apiKeyNote}>
              Keep this key secret. Do not share it in client-side code.
            </p>
          </div>

          {/* Event Timeline */}
          <div className={styles.eventsSection}>
            <div className={styles.eventsSectionHeader}>
              <h2>Recent events</h2>
              <span className={styles.sampleNote}>Sample data — real query UI coming soon</span>
            </div>
            <div className={`card ${styles.eventsTable}`}>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Agent</th>
                    <th>Session</th>
                    <th>Action</th>
                    <th>Confidence</th>
                    <th>Tools</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_EVENTS.map((event) => (
                    <tr key={event.id}>
                      <td className={styles.tdTime}>
                        <span className={styles.eventTime}>{formatTime(event.createdAt)}</span>
                        <span className={styles.eventDate}>{formatDate(event.createdAt)}</span>
                      </td>
                      <td>
                        <code className={styles.agentId}>{event.agentId}</code>
                      </td>
                      <td>
                        <code className={styles.sessionId}>{event.sessionId}</code>
                      </td>
                      <td>
                        <span
                          className={styles.actionBadge}
                          style={{ background: `${getActionColor(event.action)}20`, color: getActionColor(event.action) }}
                        >
                          {event.action}
                        </span>
                      </td>
                      <td>
                        <div className={styles.confidenceCell}>
                          <div className={styles.confidenceBar}>
                            <div
                              className={styles.confidenceFill}
                              style={{ width: `${(event.confidence as number) * 100}%` }}
                            />
                          </div>
                          <span>{((event.confidence as number) * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.toolsCell}>
                          {(event.tools as string[]).map((tool) => (
                            <code key={tool} className={styles.toolCode}>{tool}</code>
                          ))}
                          {!(event.tools as string[]).length && <span className={styles.noTools}>—</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upgrade CTA */}
          {!isPro && (
            <div id="upgrade" className={`card ${styles.upgradeCard}`}>
              <div className={styles.upgradeContent}>
                <div>
                  <h3>Unlock unlimited events</h3>
                  <p>Get unlimited events, 90-day retention, and advanced visualization.</p>
                </div>
                <div className={styles.upgradeRight}>
                  <div className={styles.upgradePrice}>$29<span>/mo</span></div>
                  <button className="btn btn-primary" onClick={() => {
                    window.location.href = "/api/create-checkout";
                  }}>Upgrade to Pro</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
