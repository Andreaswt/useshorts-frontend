import { headers } from "next/headers";
import { Resend } from "resend";
import type Stripe from "stripe";
import { env } from "~/env.mjs";
import { getPlanCredits, isUserActive } from "~/lib/stripe/helpers";
import { stripe } from "~/lib/stripe/stripe";
import { db } from "~/server/db";

const relevantEvents = new Set([
  "customer.deleted",
  "invoice.paid",
  "invoice.payment_failed",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("Stripe-Signature")!;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "customer.deleted":
          const customer = event.data.object as Stripe.Customer;

          await db.user.delete({
            where: {
              stripeCustomerId: customer.id,
            },
          });

          break;
        case "invoice.paid":
        case "invoice.payment_failed":
          const invoice = event.data.object as Stripe.Invoice;
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string,
          );

          let newPaymentStatus;
          if (event.type === "invoice.paid") {
            newPaymentStatus = "paid";
          } else if (event.type === "invoice.payment_failed") {
            newPaymentStatus = "payment_failed";
          }

          const user = await db.user.findUnique({
            where: {
              stripeCustomerId: subscription.customer as string,
            },
            select: {
              referredBy: true,
            },
          });

          let credits = 0;
          if (
            subscription.items.data[0]?.price.id !== undefined &&
            newPaymentStatus === "paid"
          ) {
            if (!invoice.billing_reason?.includes("subscription_update")) {
              credits = getPlanCredits(subscription.items.data[0].price.id);
            }

            if (user?.referredBy) {
              // Commission is 50% of the all revenue generated by affiliate. New subscriptions, plan switching, etc.
              const referredByUnpaidCommission =
                (invoice.subtotal_excluding_tax ?? invoice.subtotal) / 100 / 2;

              await db.user.update({
                where: {
                  stripeCustomerId: subscription.customer as string,
                },
                data: {
                  referredBy: {
                    update: {
                      unpaidCommission: {
                        increment: referredByUnpaidCommission,
                      },
                    },
                  },
                },
              });
            }
          }

          await db.user.update({
            where: {
              stripeCustomerId: subscription.customer as string,
            },
            data: {
              paymentStatus: newPaymentStatus,
              credits: {
                increment: credits,
              },
            },
          });

          if (
            event.type === "invoice.paid" &&
            subscription.status === "active"
          ) {
            await handleReferralBonus(subscription.customer as string);
          }

          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          await manageSubscriptionStatusChange(event.data.object);
          break;

        case "checkout.session.completed":
          {
            const checkoutSession = event.data.object;

            if (checkoutSession.mode === "subscription") {
              const newSubscription = await stripe.subscriptions.retrieve(
                checkoutSession.subscription as string,
              );

              // Manage the subscription status change for the new subscription
              await manageSubscriptionStatusChange(newSubscription);
            }
          }
          break;

        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.error(error);
      return new Response(
        "Webhook handler failed. View your Next.js function logs.",
        {
          status: 400,
        },
      );
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ received: true }));
}

const manageSubscriptionStatusChange = async (
  subscription: Stripe.Subscription,
) => {
  const customerId = subscription.customer as string;
  const newPriceId = subscription.items.data[0]?.price.id!;

  const oldUser = await db.user.findUniqueOrThrow({
    where: {
      stripeCustomerId: customerId,
    },
    select: {
      priceId: true,
      status: true,
      paymentStatus: true,
      highestPriceId: true,
    },
  });

  //// Handle plan switching by giving difference in credits ////
  const userCurrentlyActive =
    oldUser?.status !== null &&
    oldUser?.paymentStatus !== null &&
    isUserActive(oldUser.status, oldUser.paymentStatus);

  let differenceToAdd = 0;
  let newHighestPriceId = oldUser.highestPriceId ?? oldUser.priceId;

  // Only add credit difference if the user is on paid plan right now
  if (userCurrentlyActive) {
    const newPlanCredits = getPlanCredits(newPriceId);
    const highestPaidPlanCredits = getPlanCredits(newHighestPriceId ?? "");

    if (newPlanCredits > highestPaidPlanCredits) {
      // Only add credits when upgrading to a plan higher than the highest paid plan
      differenceToAdd = newPlanCredits - highestPaidPlanCredits;
      newHighestPriceId = newPriceId;
    }
  }

  await db.user.update({
    where: { stripeCustomerId: customerId },
    data: {
      status: subscription.status,
      priceId: newPriceId,
      highestPriceId:
        subscription.status === "canceled" ? null : newHighestPriceId,
      credits: {
        increment: differenceToAdd,
      },
    },
  });
};

const handleReferralBonus = async (stripeCustomerId: string) => {
  const referredUser = await db.user.findUnique({
    where: { stripeCustomerId },
  });

  if (
    !referredUser ||
    referredUser.referralBonusApplied ||
    referredUser.signedUpWithReferralCode === null
  )
    return;

  // Flag that prevents multiple referral bonuses for the same user
  await db.user.update({
    where: { id: referredUser.id },
    data: {
      referralBonusApplied: true,
      credits: {
        increment: 7,
      },
    },
  });

  // Give the referring user 16 credits for the referral
  const referringUser = await db.user.findUnique({
    where: { id: referredUser.signedUpWithReferralCode },
  });

  const referringStripeCustomerId = referringUser?.stripeCustomerId;
  if (!referringUser || !referringStripeCustomerId) return;

  await db.user.update({
    where: { id: referringUser.id },
    data: {
      credits: {
        increment: 16,
      },
    },
  });

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: "help@useshorts.app",
      to: [referringUser.email],
      subject: "You've received a referral bonus! 🎉",
      html: `
        <p>Great news! You've received a referral bonus in UseShorts. 16 credits have been added to your channel.</p>
        <p>Enjoy!</p>
      `,
    });
  } catch (error) {
    console.error({ error });
  }
};
