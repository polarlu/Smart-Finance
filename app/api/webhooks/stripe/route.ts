import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  try {
    // Verificação de variáveis de ambiente
    const secret = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret || !webhookSecret) {
      console.error("Missing Stripe env vars");
      return NextResponse.error();
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      console.error("Missing Stripe signature header");
      return NextResponse.error();
    }

    const body = await request.text();

    const stripe = new Stripe(secret, {
      apiVersion: "2024-10-28.acacia",
    });

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed.", err);
      return new NextResponse("Webhook Error", { status: 400 });
    }

    // 🔍 Debug opcional
    // console.log("Stripe Event:", JSON.stringify(event, null, 2));

    switch (event.type) {
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription;
        const customerId = invoice.customer;
        const clerkUserId = invoice.lines.data[0]?.metadata?.clerk_user_id;

        if (!clerkUserId) {
          console.error("Missing clerk_user_id in metadata.");
          return new NextResponse("Missing clerk_user_id", { status: 400 });
        }

        await clerkClient.users.updateUser(clerkUserId, {
          privateMetadata: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
          },
          publicMetadata: {
            subscriptionPlan: "premium",
          },
        });

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const clerkUserId = subscription.metadata?.clerk_user_id;

        if (!clerkUserId) {
          console.error("Missing clerk_user_id on subscription delete.");
          return new NextResponse("Missing clerk_user_id", { status: 400 });
        }

        await clerkClient.users.updateUser(clerkUserId, {
          privateMetadata: {
            stripeCustomerId: null,
            stripeSubscriptionId: null,
          },
          publicMetadata: {
            subscriptionPlan: null,
          },
        });

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
