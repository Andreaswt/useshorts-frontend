"use server";

import { cookies } from "next/headers";
import { db } from "~/server/db";

export async function trackSignupClicks(urlAffiliateId: string | null) {
  "use server";
  let affiliateId: string | undefined;

  const cookie = cookies().get("aid");

  if (cookie !== undefined) {
    affiliateId = cookie.value;
  } else if (urlAffiliateId !== null) {
    affiliateId = urlAffiliateId;
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    cookies().set("aid", affiliateId, {
      expires: new Date(Date.now() + thirtyDays),
    });
  }

  if (typeof affiliateId === "string") {
    const affiliateExists = await db.affiliate.findUnique({
      where: {
        affiliateId: affiliateId,
      },
    });

    if (affiliateExists) {
      await db.affiliate.update({
        where: {
          affiliateId: affiliateId,
        },
        data: {
          signupPageClicks: {
            increment: 1,
          },
        },
      });
    }
  }

  return affiliateId;
}
