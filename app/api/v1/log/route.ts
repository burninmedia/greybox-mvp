import { NextRequest, NextResponse } from "next/server";

// Stub — API only works on Vercel (server-side).
// GitHub Pages uses client-side auth only.
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "API not available on GitHub Pages. Deploy to Vercel for full functionality." },
    { status: 503 }
  );
}
