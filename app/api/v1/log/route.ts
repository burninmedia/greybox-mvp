import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const FREE_TIER_LIMIT = 10_000;

interface LogBody {
  agentId: string;
  sessionId: string;
  action: string;
  reasoning?: string;
  context?: Record<string, unknown>;
  confidence?: number;
  tools?: string[];
}

function getKeyHash(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid Authorization header" }, { status: 401 });
    }

    const apiKey = authHeader.slice(7);
    const keyHash = getKeyHash(apiKey);
    const sql = getDb();

    // Look up the API key owner
    const keys = await sql`
      SELECT user_id FROM api_keys WHERE key_hash = ${keyHash}
    `;

    if (keys.length === 0) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const userId: string = keys[0].user_id;

    // Rate limiting — check usage for free tier
    const usageRows = await sql`
      SELECT event_count FROM usage_counts
      WHERE user_id = ${userId}
      AND period_start = DATE_TRUNC('month', NOW())
    `;

    if (usageRows.length > 0) {
      const currentCount = Number(usageRows[0].event_count);
      if (currentCount >= FREE_TIER_LIMIT) {
        return NextResponse.json(
          { error: "Monthly event limit reached. Upgrade to Pro for unlimited events." },
          { status: 429 }
        );
      }
      await sql`
        UPDATE usage_counts
        SET event_count = event_count + 1, updated_at = NOW()
        WHERE user_id = ${userId}
        AND period_start = DATE_TRUNC('month', NOW())
      `;
    } else {
      await sql`
        INSERT INTO usage_counts (user_id, event_count, period_start)
        VALUES (${userId}, 1, DATE_TRUNC('month', NOW()))
      `;
    }

    const body: LogBody = await req.json();

    if (!body.agentId || !body.sessionId || !body.action) {
      return NextResponse.json(
        { error: "Missing required fields: agentId, sessionId, action" },
        { status: 400 }
      );
    }

    const event = await sql`
      INSERT INTO audit_events (
        agent_id, session_id, action, reasoning, context, confidence, tools, user_id
      ) VALUES (
        ${body.agentId},
        ${body.sessionId},
        ${body.action},
        ${body.reasoning ?? null},
        ${body.context ? JSON.stringify(body.context) : null},
        ${body.confidence ?? null},
        ${body.tools ? JSON.stringify(body.tools) : null},
        ${userId}
      )
      RETURNING id
    `;

    return NextResponse.json({ success: true, eventId: event[0].id }, { status: 200 });
  } catch (err) {
    console.error("[/api/v1/log] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
