import Stripe from "stripe";
import { env } from "~/env.mjs";

declare const global: Global & { stripe?: Stripe };

export let stripe: Stripe;

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    stripe = new Stripe(env.STRIPE_SECRET_KEY);
  } else {
    if (!global.stripe) {
      global.stripe = new Stripe(env.STRIPE_SECRET_KEY);
    }
    stripe = global.stripe;
  }
}
