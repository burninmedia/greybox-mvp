import { NextRequest, NextResponse } from "next/server";

// Stub — Webhooks only work on Vercel (server-side).
// GitHub Pages cannot handle Stripe webhooks.
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "Webhook not available on GitHub Pages. Deploy to Vercel for full functionality." },
    { status: 503 }
  );
}
