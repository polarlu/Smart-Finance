"use client";

import { Button } from "@/app/_components/ui/button";
import { createStripeCheckout } from "../_actions/creat-stipe-checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const AcquirePlanButton = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleAcquirePlanClick = async () => {
    try {
      setLoading(true);
      const { sessionId } = await createStripeCheckout();

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key not found");
      }

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );

      if (!stripe) {
        throw new Error("Stripe not found");
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const hasPremiumPlan = user?.publicMetadata.subscriptionPlan === "premium";

  if (hasPremiumPlan) {
    return (
      <Button
        className="w-full rounded-full text-sm font-bold sm:text-base"
        variant="link"
        asChild
      >
        <Link
          href={`${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL as string}?prefilled_email=${user.emailAddresses[0].emailAddress}`}
        >
          Gerenciar plano
        </Link>
      </Button>
    );
  }

  return (
    <Button
      className="w-full rounded-full px-4 py-2 text-sm font-bold sm:px-6 sm:py-3 sm:text-base"
      onClick={handleAcquirePlanClick}
      disabled={loading}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin sm:h-5 sm:w-5" />
          <span className="text-xs sm:text-sm">Processando...</span>
        </>
      ) : (
        <span>Adquirir plano</span>
      )}
    </Button>
  );
};

export default AcquirePlanButton;
