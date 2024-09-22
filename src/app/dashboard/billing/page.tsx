"use server";

import { redirect } from "next/navigation";
import { TfiFaceSmile } from "react-icons/tfi";
import { userFromSession } from "~/app/actions/authentication";
import { Feedback } from "~/components/client/Feedback";
import ManageSubscription from "~/components/client/ManageSubscription";
import PricingCards from "~/components/client/dashboard/billing/PricingCards";
import {
  getPlanCredits,
  getPlanName,
  isUserActive,
} from "~/lib/stripe/helpers";
import { db } from "~/server/db";

export default async function Page() {
  const sessionUser = await userFromSession();

  const user = await db.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    select: {
      admin: true,
      status: true,
      priceId: true,
      paymentStatus: true,
      isRunning: true,
      lastScheduledAt: true,
      schedulingOrder: true,
      credits: true,
      OAuthTokens: {
        select: {
          provider: true,
          invalid: true,
          selectedChannelId: true,
          selectedChannelName: true,
          selectedChannelImage: true,
          postAsPrivate: true,
          notifySubscribers: true,
        },
      },
    },
  });

  if (!user) {
    console.error("User not found on page /dashboard");
    redirect("/signout");
  }

  const isActive =
    user.status && user.paymentStatus
      ? isUserActive(user.status, user.paymentStatus)
      : false;

  return (
    <>
      <Feedback />
      <div className="mt-4 flex h-full w-full flex-col items-center gap-6 rounded-lg border border-gray-200 bg-white p-10 shadow-sm">
        <div className="flex flex-col gap-8">
          <h2 className="text-center text-2xl font-medium tracking-wide text-[#3E3E3E]">
            Change Plan
          </h2>
          <div className="flex flex-col items-center justify-between gap-4 rounded-md border bg-gray-100 px-4 py-3 text-sm sm:flex-row sm:gap-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <TfiFaceSmile className="min-h-6 min-w-6" />
              <div className="flex flex-col">
                {/* On paid plan */}
                {isActive && user.priceId ? (
                  <>
                    <p className="font-semibold">
                      Your current plan is {getPlanName(user.priceId)}
                    </p>
                    <p>
                      You get {getPlanCredits(user.priceId)} credits every month
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-semibold">
                      You&apos;re on the free plan with {user.credits} credits
                      left
                    </p>
                  </>
                )}
              </div>
            </div>
            <ManageSubscription />
          </div>

          <PricingCards alreadySubscribed={isActive} />
        </div>
      </div>
    </>
  );
}
