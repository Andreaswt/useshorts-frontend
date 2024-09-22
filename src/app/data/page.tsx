"use server";

import { FaArrowRight } from "react-icons/fa";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { userFromSession } from "../actions/authentication";

export default async function Page() {
  const sessionUser = await userFromSession();
  if (sessionUser.email !== "andreas.trolle@hotmail.com") {
    return "Yo";
  }

  const relevantPriceIds = [
    "price_1PVHeiGIunVusOO1ypltLGX9",
    "price_1PVHiCGIunVusOO1nefZon56",
    "price_1PVHfYGIunVusOO1nx5pillM",
    "price_1PVHitGIunVusOO14WO4f0zx",
    "price_1PVHgHGIunVusOO1Okf6BXNx",
    "price_1PVHqvGIunVusOO1fiQYWyDi",
  ];

  const users = await db.user.findMany({
    select: {
      status: true,
      priceId: true,
      paymentStatus: true,
      OAuthTokens: {
        where: {
          provider: "youtube",
          invalid: false,
        },
      },
      QueuedVideo: true,
      isRunning: true,
      lastScheduledAt: true,
      emailVerified: true,
    },
  });

  const now = Date.now();
  const hours12 = 12 * 60 * 60 * 1000;
  const hours24 = 24 * 60 * 60 * 1000;
  const hours48 = 48 * 60 * 60 * 1000;
  const days7 = 7 * 24 * 60 * 60 * 1000;

  const freeplan = users.filter(
    (u) =>
      u.status !== "active" &&
      u.priceId &&
      relevantPriceIds.includes(u.priceId),
  ).length;
  const subscribed = users.filter(
    (u) =>
      u.status === "active" &&
      u.paymentStatus === "paid" &&
      u.priceId &&
      relevantPriceIds.includes(u.priceId),
  ).length;
  const oauthconnected = users.filter((u) => u.OAuthTokens.length > 0).length;
  const running = users.filter(
    (u) => u.OAuthTokens.length > 0 && u.isRunning,
  ).length;
  const videosScheduled48 = users.filter(
    (u) =>
      u.OAuthTokens.length > 0 &&
      u.isRunning &&
      u.lastScheduledAt &&
      now - new Date(u.lastScheduledAt).getTime() <= hours48,
  ).length;
  const signupsweek = users.filter(
    (u) =>
      u.emailVerified && now - new Date(u.emailVerified).getTime() <= days7,
  ).length;
  const signups24 = users.filter(
    (u) =>
      u.emailVerified && now - new Date(u.emailVerified).getTime() <= hours24,
  ).length;
  const signups12 = users.filter(
    (u) =>
      u.emailVerified && now - new Date(u.emailVerified).getTime() <= hours12,
  ).length;

  const generatedlast48hoursfailed = users.filter(
    (u) =>
      u.QueuedVideo.filter(
        (x) =>
          x.status === "Failed" &&
          now - new Date(x.createdAt).getTime() <= hours48,
      ).length > 0,
  ).length;

  const generatedlast48hours = users.filter(
    (u) =>
      u.QueuedVideo.filter(
        (x) => now - new Date(x.createdAt).getTime() <= hours48,
      ).length > 0,
  ).length;

  return (
    <div className="items-cente flex h-screen w-full flex-col justify-center gap-14">
      <div className="flex items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-1">
          <span>Signups last 7 days</span>
          <span>{signupsweek}</span>
        </div>
        <FaArrowRight />
        <div className="flex flex-col items-center gap-1">
          <span>Signups last 24 hours</span>
          <span>{signups24}</span>
        </div>
        <FaArrowRight />
        <div className="flex flex-col items-center gap-1">
          <span>Signups last 12 hours</span>
          <span>{signups12}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-1">
          <span>Users that generated a video in the last 48 hours</span>
          <span>{generatedlast48hours}</span>
        </div>
        <FaArrowRight />
        <div className="flex flex-col items-center gap-1">
          <span>Users with a failed generated video in the last 48 hours</span>
          <span>{generatedlast48hoursfailed}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-1">
          <span>Connected YouTube</span>
          <span>{oauthconnected}</span>
        </div>
        <FaArrowRight />
        <div className="flex flex-col items-center gap-1">
          <span>Running</span>
          <span>{running}</span>
        </div>
        <FaArrowRight />
        <div className="flex flex-col items-center gap-1">
          <span>Had video scheduled within 48 hours</span>
          <span>{videosScheduled48}</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-1">
          <span>Free plan</span>
          <span>{freeplan}</span>
        </div>
        <FaArrowRight />
        <div className="flex flex-col items-center gap-1">
          <span>Paying</span>
          <span>{subscribed}</span>
        </div>
      </div>
    </div>
  );
}
