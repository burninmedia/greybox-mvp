import { NextResponse } from "next/server";
import Stripe from "stripe";

// Clerk's auth() from @clerk/nextjs/server reads from request headers/cookies
// It doesn't require API key at module level — only at request time
export async function GET() {
  // Dynamic import to avoid triggering Clerk SDK at module-level during build
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(new URL("/sign-in", appUrl));
  }

  // Get user from Clerk API
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
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
    public_metadata?: { is_pro?: boolean };
  };

  const email = clerkUser.email_addresses?.[0]?.email_address || "";
  const name = [clerkUser.first_name, clerkUser.last_name].filter(Boolean).join(" ");

  if (clerkUser.public_metadata?.is_pro) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(new URL("/dashboard?upgrade=already_pro", appUrl));
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    return NextResponse.json({ error: "Stripe price not configured" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });

  try {
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId: string;

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email,
        metadata: { user_id: userId },
        ...(name ? { name } : {}),
      });
      customerId = customer.id;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${appUrl}/dashboard?upgrade=success`,
      cancel_url: `${appUrl}/dashboard?upgrade=cancelled`,
      metadata: { user_id: userId },
      subscription_data: {
        metadata: { user_id: userId },
      },
    });

    if (session.url) {
      return NextResponse.redirect(session.url);
    } else {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
