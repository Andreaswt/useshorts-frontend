"use server";

import { redirect } from "next/navigation";
import { userFromSession } from "~/app/actions/authentication";
import { Feedback } from "~/components/client/Feedback";
import { CopyToClipboard } from "~/components/client/dashboard/billing/CopyToClipboard";
import { env } from "~/env.mjs";
import { db } from "~/server/db";

export default async function Page() {
  const sessionUser = await userFromSession();

  const user = await db.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    console.error("User not found on page /dashboard");
    redirect("/signout");
  }

  const signupUrl = env.NEXT_PUBLIC_BASE_URL + "/signup?ref=" + user.id;
  return (
    <>
      <Feedback />

      <div className="mt-4 flex h-full w-full flex-col items-center gap-6 rounded-lg border border-gray-200 bg-white p-10 shadow-sm">
        <div className="flex max-w-lg flex-col items-center gap-2">
          <h2 className="text-center text-2xl font-medium tracking-wide text-[#3E3E3E]">
            Refer a friend and get 16 credits for free
          </h2>
          <h2 className="text-md text-center text-[#999999]">
            Share your invite link and get 16 free credits when your friends
            subscribe. You friend will get 7 free credits.
          </h2>
          <div className="mt-6 flex w-full flex-col gap-4">
            <div className="relative flex items-center justify-between">
              <div className="flex w-full">
                <p
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                  id="url"
                >
                  {signupUrl}
                </p>
              </div>
              <CopyToClipboard text={signupUrl} version="v1" />
            </div>
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <CopyToClipboard text={signupUrl} version="v2" />
              <a
                href={`https://api.whatsapp.com/send?text=${signupUrl}`}
                type="button"
                className="flex h-10 w-fit items-center justify-center rounded-lg bg-[#232323] p-0.5 font-medium text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="px-3 py-1.5 text-center text-sm">
                  Share on WhatsApp
                </span>
              </a>
              <a
                href={`mailto:?body=${encodeURIComponent(signupUrl)}&subject=Get Started With UseShorts!`}
                type="button"
                className="flex h-10 w-fit items-center justify-center rounded-lg bg-[#232323] p-0.5 font-medium text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="px-3 py-1.5 text-center text-sm">
                  Share by email
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
