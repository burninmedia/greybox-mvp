import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
  });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.user_id;

    if (userId) {
      try {
        // Call Clerk API directly to update user metadata
        const response = await fetch(
          `https://api.clerk.com/v1/users/${userId}/metadata`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              public_metadata: { is_pro: true, stripeCustomerId: session.customer },
            }),
          }
        );

        if (!response.ok) {
          const errText = await response.text();
          console.error("Clerk API error:", response.status, errText);
          return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
        }

        console.log(`Upgraded user ${userId} to Pro`);
      } catch (err) {
        console.error("Failed to update Clerk user metadata:", err);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
      }
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    console.log(`Subscription deleted: ${subscription.id}, customer: ${subscription.customer}`);
  }

  return NextResponse.json({ received: true });
}
