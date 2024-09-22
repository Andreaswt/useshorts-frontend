"use server";

import { redirect } from "next/navigation";
import { userFromSession } from "~/app/actions/authentication";
import { Feedback } from "~/components/client/Feedback";
import { CopyToClipboard } from "~/components/client/dashboard/billing/CopyToClipboard";
import { db } from "~/server/db";

export default async function Page() {
  const sessionUser = await userFromSession();

  const user = await db.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    select: {
      id: true,
      affiliate: {
        select: {
          signupPageClicks: true,
          referredUsers: true,
          conversions: true,
          unpaidCommission: true,
          affiliateId: true,
          framerPage: true,
        },
      },
    },
  });

  if (!user?.affiliate) {
    redirect("/dashboard");
  }

  if (!user) {
    console.error("User not found on page /dashboard");
    redirect("/signout");
  }

  const signupUrl = "useshorts.app" + "?aid=" + user.affiliate.affiliateId;

  return (
    <>
      <Feedback />

      <div className="mt-4 flex h-full w-full flex-col items-center gap-6 rounded-lg border border-gray-200 bg-white p-10 shadow-sm">
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-center text-2xl font-medium tracking-wide text-[#3E3E3E]">
            Affiliate
          </h2>
          <div className="flex w-fit max-w-full flex-wrap justify-between gap-3">
            <div className="rounded-md border px-6 py-4">
              <div className="flex flex-col items-center">
                <p className="text-lg">{user.affiliate.signupPageClicks}</p>
                <p className="whitespace-nowrap text-sm">Signup page visits</p>
              </div>
            </div>
            <div className="rounded-md border px-6 py-4">
              <div className="flex flex-col items-center">
                <p className="text-lg">{user.affiliate.referredUsers.length}</p>
                <p className="whitespace-nowrap text-sm">Signups</p>
              </div>
            </div>
            <div className="rounded-md border px-6 py-4">
              <div className="flex flex-col items-center">
                <p className="text-lg">
                  {
                    user.affiliate.referredUsers.filter(
                      (x) => x.priceId !== null && x.status !== null,
                    ).length
                  }
                </p>
                <p className="whitespace-nowrap text-sm">Conversions</p>
              </div>
            </div>
            <div className="rounded-md border px-6 py-4">
              <div className="flex flex-col items-center">
                <p className="text-lg">${user.affiliate.unpaidCommission}</p>
                <p className="whitespace-nowrap text-sm">Unpaid commision</p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4">
            <div className="flex flex-col">
              <label className="mb-1 font-[#222A31] text-sm">
                Your affiliate link
              </label>
              <div className="relative flex items-center justify-between">
                <div className="flex w-full">
                  <p
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                    id="url"
                  >
                    {user.affiliate.framerPage}
                  </p>
                </div>
                <CopyToClipboard
                  text={user.affiliate.framerPage}
                  version="v1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
