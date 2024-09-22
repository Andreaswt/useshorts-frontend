"use server";

import Link from "next/link";
import { redirect } from "next/navigation";
import { FaExternalLinkAlt } from "react-icons/fa";
import { TfiFaceSmile } from "react-icons/tfi";
import { Feedback } from "~/components/client/Feedback";
import PauseStartPosting from "~/components/client/PauseStartPosting";
import QueryMessageReceiver from "~/components/client/QueryMessageReceiver";
import YouTubeOAuth from "~/components/client/YouTubeOAuth";
import { ClientVideo } from "~/components/client/dashboard/ClientVideo";
import FreeLimitReachedOverlay from "~/components/client/dashboard/FreeLimitReachedOverlay";
import { GeneralOptions } from "~/components/client/dashboard/GeneralOptions";
import { YouTubeOptions } from "~/components/client/dashboard/YouTubeOptions";
import { env } from "~/env.mjs";
import { isUserActive } from "~/lib/stripe/helpers";
import { db } from "~/server/db";
import { userFromSession } from "../actions/authentication";
import { IoInformationCircleOutline } from "react-icons/io5";

export default async function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const sessionUser = await userFromSession();

  const user = await db.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    select: {
      admin: true,
      signedUpWithReferralCode: true,
      status: true,
      priceId: true,
      paymentStatus: true,
      isRunning: true,
      lastScheduledAt: true,
      schedulingOrder: true,
      credits: true,
      referredById: true,
      OAuthTokens: {
        select: {
          provider: true,
          invalid: true,
          selectedChannelId: true,
          selectedChannelName: true,
          selectedChannelImage: true,
          selectedPlaylistId: true,
          selectedPlaylistName: true,
          selectedPlaylistImage: true,
          postAsPrivate: true,
          notifySubscribers: true,
          postingFrequency: true,
        },
      },
      clips: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        select: {
          bucketUrl: true,
          createdAt: true,
        },
        where: {
          queuedVideo: null,
        },
      },
    },
  });

  if (!user) {
    console.error("User not found on page /dashboard");
    redirect("/signout");
  }

  const ref = searchParams.ref;

  if (ref && typeof ref === "string") {
    if (user.signedUpWithReferralCode === null) {
      await db.user.update({
        where: {
          id: sessionUser.id,
        },
        data: {
          signedUpWithReferralCode: ref,
        },
      });
    }
  }

  const affiliateId = searchParams.aid;

  if (affiliateId && typeof affiliateId === "string") {
    const affiliate = await db.affiliate.findUnique({
      where: {
        affiliateId: affiliateId,
      },
      select: {
        id: true,
      },
    });

    if (affiliate && !user.referredById) {
      await db.user.update({
        where: {
          id: sessionUser.id,
        },
        data: {
          referredById: affiliate.id,
        },
      });
    }
  }

  const isActive =
    user.status && user.paymentStatus
      ? isUserActive(user.status, user.paymentStatus)
      : false;

  const youTubeConnected = user.OAuthTokens.some(
    (x) => x.provider === "youtube",
  );

  const invalidYouTubeRefreshToken = user.OAuthTokens.some(
    (x) => x.provider === "youtube" && x.invalid,
  );

  return (
    <>
      {user.credits === 0 && !isActive && <FreeLimitReachedOverlay />}

      <QueryMessageReceiver />
      <Feedback />

      <div className="mt-4 flex h-full w-full flex-col items-center gap-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        {!youTubeConnected || invalidYouTubeRefreshToken ? (
          <>
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-center text-2xl font-medium tracking-wide text-[#3E3E3E]">
                Autoposting requires connecting your YouTube account
              </h2>
              <p className="text-md max-w-xl text-center text-[#5c5c5c]">
                UseShorts will be able to see your uploaded videos and playlists
                to create clips from them.{" "}
                <span className="font-semibold">
                  No clips will be posted on your behalf
                </span>{" "}
                until you explicitly enable it.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <YouTubeOAuth />
              {/* <Link
                href="/dashboard/generate"
                className="flex h-10 items-center justify-center gap-2 rounded-lg border-2 border-[#313131] bg-white px-3 py-1 text-sm font-medium text-[#313131]"
              >
                Or use a video link instead
              </Link> */}
            </div>

            <h2 className="mt-6 text-center text-lg font-medium tracking-wide text-[#3E3E3E] underline underline-offset-4">
              You&apos;re in good company
            </h2>
            <div className="flex w-full flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex max-h-52 w-60 flex-col gap-3 rounded-md border border-[#DFDFDF] bg-white p-3">
                <div className="flex items-center gap-1">
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                </div>
                <div className="flex items-center gap-2">
                  <img src="/gaplek.png" className="h-6 w-6 rounded-full" />
                  <div className="flex flex-col">
                    <p className="font-semibold">Dean</p>
                    <span className="text-xs">GaplekBehemoth</span>
                  </div>
                </div>
                <p className="overflow-y-scroll">
                  UseShorts has been a wonderful service that has helped me grow
                  my channel. It helps out a lot, especially if you are
                  regularly busy.
                </p>
                <span className="w-fit rounded-lg border border-[#8bf0b0] bg-[#dcfde7] px-3 py-1 text-sm font-medium text-[#14532d]">
                  +13.000 views / mo
                </span>
              </div>
              <div className="flex max-h-52 w-60 flex-col gap-3 rounded-md border border-[#DFDFDF] bg-white p-3">
                <div className="flex items-center gap-1">
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                </div>
                <div className="flex items-center gap-4">
                  <img src="/rc.png" className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col">
                    <p className="font-semibold">Jordan</p>
                    <span className="text-xs">RC Printer</span>
                  </div>
                </div>
                <p className="overflow-y-scroll">
                  UseShorts allows me to post interesting youtube content daily
                  with almost no effort to access new viewers that wouldn&apos;t
                  normally find my channel. This wider audience exposure results
                  in big gains in channel performance overall and I&apos;d
                  recommend it heartily to any channel with a back catalog of
                  videos that doesn&apos;t have the time to post new shorts
                  daily.
                </p>
                <span className="w-fit rounded-lg border border-[#8bf0b0] bg-[#dcfde7] px-3 py-1 text-sm font-medium text-[#14532d]">
                  +35.000 views / mo
                </span>
              </div>
              <div className="flex max-h-52 w-60 flex-col gap-3 rounded-md border border-[#DFDFDF] bg-white p-3">
                <div className="flex items-center gap-1">
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                  <img src="/star.png" alt="logo" className="h-3 w-3" />
                </div>
                <div className="flex items-center gap-4">
                  <img src="/filmatic.png" className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col">
                    <span className="text-xs">The Filmatic</span>
                  </div>
                </div>
                <p className="overflow-y-scroll">
                  UseShorts have been incredibly helpful for my channel and its
                  growth during downtime. It has boosted my audience range,
                  expanding through to shorts users in many different countries
                  and had allowed them to see parts of my actual videos in
                  quick, short-form content. In short (no pun intended),
                  they&apos;ve allowed my audience to grow and interact from
                  across the world, they&apos;ve also allowed me to get videos
                  out constantly (which is great for the algorithm) and
                  it&apos;s also allowed me to work harder on long-form videos
                  and not worry about time being spent on short-form content.
                  Honestly, one of the best things to happen to my channel and I
                  couldn&apos;t be happier to be in this partnership with
                  UseShorts. I recommend using UseShorts as soon as possible to
                  really grow your channel and reach those milestones fast.
                </p>
                <span className="w-fit rounded-lg border border-[#8bf0b0] bg-[#dcfde7] px-3 py-1 text-sm font-medium text-[#14532d]">
                  +18.000 views / mo
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex w-full flex-col items-center gap-5">
              <div className="relative flex h-7 w-full flex-col items-center md:flex-row md:items-center md:justify-between">
                <h2 className="absolute left-1/2 top-0 w-full -translate-x-1/2 transform text-center text-2xl font-medium tracking-wide text-[#3E3E3E]">
                  Autoposting is
                  {user.isRunning ? (
                    <span className="text-green-500"> active</span>
                  ) : (
                    <span className="text-red-500"> paused</span>
                  )}
                </h2>
                <div className="mt-12 hidden w-full flex-col items-center md:mt-0 md:flex md:flex-row md:items-center md:justify-end">
                  <div className="mb-4 flex flex-col items-center md:mb-0 md:mr-2 md:items-start">
                    <span className="text-medium text-gray-500">
                      <span className="rounded-full bg-[#918CF2] px-2 py-1 text-xs font-normal text-white">
                        {user.credits} credits left
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <PauseStartPosting isRunning={user.isRunning} />
              <div className="flex h-fit max-w-xl items-center gap-3 rounded-md bg-[#b4b1ee] bg-opacity-50 px-3 py-3">
                <IoInformationCircleOutline className="min-h-8 min-w-8 text-[#7e79e0]" />
                <div className="gap-1s flex flex-col">
                  <p className="text-sm font-bold text-black">
                    How Autoposting Works
                  </p>
                  <p className="text-xs text-black">
                    If active, UseShorts will automatically create and post
                    clips. One credit will be deducted when a clip is scheduled.
                    You will receive emails 2 hours before YouTube Shorts are
                    scheduled.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full border-t border-t-gray-200"></div>
            <div className="flex w-full justify-center">
              <h2 className="text-lg font-medium text-[#3E3E3E] underline underline-offset-[6px]">
                Autoposting options
              </h2>
            </div>
            <div className="flex w-full flex-wrap items-start gap-6">
              <YouTubeOptions
                youTubeConnected={youTubeConnected}
                invalidYouTubeRefreshToken={invalidYouTubeRefreshToken}
                selectedChannelId={user.OAuthTokens[0]?.selectedChannelId!}
                selectedChannelName={user.OAuthTokens[0]?.selectedChannelName!}
                selectedChannelImage={
                  user.OAuthTokens[0]?.selectedChannelImage!
                }
                selectedPlaylistId={user.OAuthTokens[0]?.selectedPlaylistId!}
                selectedPlaylistName={
                  user.OAuthTokens[0]?.selectedPlaylistName!
                }
                selectedPlaylistImage={
                  user.OAuthTokens[0]?.selectedPlaylistImage!
                }
                postAsPrivate={user.OAuthTokens[0]?.postAsPrivate!}
                notifySubscribers={user.OAuthTokens[0]?.notifySubscribers!}
                postingFrequency={user.OAuthTokens[0]?.postingFrequency!}
              />
              <GeneralOptions schedulingOrder={user.schedulingOrder} />
            </div>
            <div className="w-full border-t border-t-gray-200"></div>
            <div className="flex w-full flex-col items-center gap-5">
              <h2 className="mx-auto text-lg font-medium text-[#3E3E3E] underline underline-offset-[6px]">
                Autoposted videos
              </h2>
              {user.clips.length > 0 ? (
                <div className="flex h-fit w-full overflow-x-auto">
                  <div className="flex h-fit w-full justify-start gap-3">
                    {user.clips.map((clip, index) => (
                      <div
                        key={index}
                        className="flex h-fit min-w-32 max-w-32 flex-col items-center justify-center rounded-lg"
                      >
                        <ClientVideo url={clip.bucketUrl ?? ""} />
                        <a
                          href={clip.bucketUrl ?? undefined}
                          download
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                        >
                          Download
                        </a>
                        <span className="mt-1 text-center text-xs text-gray-600">
                          {new Date(clip.createdAt).toLocaleString("default", {
                            hour: "2-digit",
                            minute: "2-digit",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <TfiFaceSmile className="min-h-6 min-w-6 text-[#8C8C8C]" />
                  <p className="text-center text-sm text-[#8C8C8C]">
                    Your generated clips show up here.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
