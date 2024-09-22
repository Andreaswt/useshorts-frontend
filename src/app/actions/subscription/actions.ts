"use server";

import { redirect } from "next/navigation";
import { env } from "~/env.mjs";
import { stripe } from "~/lib/stripe/stripe";
import { db } from "~/server/db";
import { userFromSession } from "../authentication";
import { isUserActive } from "~/lib/stripe/helpers";

export const redirectToCheckoutSession = async (
  plan:
    | "starter-monthly"
    | "growth-monthly"
    | "double-growth-monthly"
    | "starter-yearly"
    | "growth-yearly"
    | "double-growth-yearly",
) => {
  const user = await userFromSession();
  const dbUser = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    select: {
      stripeCustomerId: true,
      priceId: true,
    },
  });

  let priceId = env.STARTER_MONTHLY_PRICE_ID;
  switch (plan) {
    case "starter-monthly":
      priceId = env.STARTER_MONTHLY_PRICE_ID;
      break;
    case "growth-monthly":
      priceId = env.GROWTH_MONTHLY_PRICE_ID;
      break;
    case "double-growth-monthly":
      priceId = env.DOUBLE_GROWTH_MONTHLY_PRICE_ID;
      break;
    case "starter-yearly":
      priceId = env.STARTER_YEARLY_PRICE_ID;
      break;
    case "growth-yearly":
      priceId = env.GROWTH_YEARLY_PRICE_ID;
      break;
    case "double-growth-yearly":
      priceId = env.DOUBLE_GROWTH_YEARLY_PRICE_ID;
      break;
  }

  if (dbUser.stripeCustomerId) {
    const session = await stripe.checkout.sessions.create({
      success_url: `${env.NEXTAUTH_URL}/api/v1/stripe/checkoutcallback`,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer: dbUser.stripeCustomerId,
      mode: "subscription",
    });

    if (!session.url) throw new Error("No session URL");

    redirect(session.url);
  }
};

export const redirectToBillingPortal = async () => {
  const user = await userFromSession();

  const dbUser = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    select: {
      stripeCustomerId: true,
    },
  });

  if (dbUser.stripeCustomerId) {
    const session = await stripe.billingPortal.sessions.create({
      customer: dbUser.stripeCustomerId,
      return_url: `${env.NEXTAUTH_URL}/api/v1/stripe/checkoutcallback`,
    });

    if (!session.url) throw new Error("No session URL");

    redirect(session.url);
  }
};
