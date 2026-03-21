import { neon } from "@neondatabase/serverless";

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return neon(process.env.DATABASE_URL);
}

export async function initDb() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS audit_events (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      agent_id VARCHAR(255) NOT NULL,
      session_id VARCHAR(255) NOT NULL,
      action VARCHAR(255) NOT NULL,
      reasoning TEXT,
      context JSONB,
      confidence DECIMAL(3,2),
      tools JSONB,
      user_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS api_keys (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      key_hash VARCHAR(255) UNIQUE NOT NULL,
      user_id VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS usage_counts (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id VARCHAR(255) UNIQUE NOT NULL,
      event_count INTEGER DEFAULT 0,
      period_start TIMESTAMP DEFAULT DATE_TRUNC('month', NOW()),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

// Lazy SQL accessor — call this in API routes instead of importing sql directly
export function getDb() {
  return getSql();
}
