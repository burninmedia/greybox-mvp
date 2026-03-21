import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { generateApiKey, hashApiKey } from "@/lib/clerk";

// Use Clerk auth via dynamic import to avoid module-level initialization
export async function POST() {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch current user metadata from Clerk API to check if API key exists
  const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!clerkRes.ok) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }

  const clerkUser = (await clerkRes.json()) as {
    public_metadata?: { api_key?: string };
  };

  const existingKey = clerkUser.public_metadata?.api_key;
  if (existingKey) {
    return NextResponse.json({ apiKey: existingKey });
  }

  // Generate new API key
  const apiKey = generateApiKey();
  const keyHash = hashApiKey(apiKey);

  try {
    const sql = getDb();
    await sql`
      INSERT INTO api_keys (key_hash, user_id)
      VALUES (${keyHash}, ${userId})
      ON CONFLICT (key_hash) DO NOTHING
    `;

    // Update Clerk metadata via direct API
    const updateRes = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_metadata: { api_key: apiKey },
      }),
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      console.error("Clerk update error:", updateRes.status, errText);
      return NextResponse.json({ error: "Failed to save API key" }, { status: 500 });
    }

    return NextResponse.json({ apiKey });
  } catch (err) {
    console.error("Onboarding error:", err);
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
  }
}
