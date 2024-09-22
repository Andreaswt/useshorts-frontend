"use server";

import { redirect } from "next/navigation";
import React from "react";
import { TfiFaceSmile } from "react-icons/tfi";
import { userFromSession } from "~/app/actions/authentication";
import { Feedback } from "~/components/client/Feedback";
import { ClientVideo } from "~/components/client/dashboard/ClientVideo";
import YouTubeLinkInput from "~/components/client/dashboard/generate/YouTubeLinkInput";
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
      QueuedVideo: {
        orderBy: {
          createdAt: "desc",
        },
        take: 31,
        select: {
          clip: {
            where: {
              queuedVideo: {
                isNot: null,
              },
            },
            select: {
              bucketUrl: true,
              createdAt: true,
            },
          },
          createdAt: true,
          status: true,
        },
      },
    },
  });

  if (!user) {
    console.error("User not found on page /dashboard");
    redirect("/signout");
  }

  return (
    <>
      <Feedback />
      <div className="mt-4 flex h-full w-full flex-col items-center gap-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex w-full flex-col-reverse items-center sm:flex-row">
              <div className="hidden w-1/3 sm:flex"></div>

              <div className="flex w-full items-center justify-center sm:w-1/3">
                {" "}
                <h2 className="text-center text-2xl font-medium tracking-wide text-[#3E3E3E]">
                  Generate a highlight clip
                </h2>
              </div>

              <div className="flex w-full items-center justify-center sm:w-1/3 sm:justify-end">
                <span className="rounded-full bg-[#918CF2] px-2 py-1 text-xs font-normal text-white">
                  {user.credits} clips left
                </span>
              </div>
            </div>
            <h2 className="text-md max-w-md text-center text-[#999999]">
              Paste the link to one of your podcast episodes and generate a
              clip. You receive an email when the clip is ready.
            </h2>
          </div>
          <div className="flex w-full flex-col items-center gap-4">
            <YouTubeLinkInput />
          </div>
        </div>
        <div className="w-full border-t border-t-gray-200"></div>
        <div className="flex w-full flex-col items-center gap-5">
          <h2 className="mx-auto text-lg font-medium text-[#3E3E3E] underline underline-offset-[6px]">
            Generated videos
          </h2>
          {user.QueuedVideo.length > 0 ? (
            <div className="flex h-fit w-full overflow-x-auto">
              <div className="flex h-fit w-full justify-start gap-3">
                {user.QueuedVideo.map((queuedVideo, index) => (
                  <React.Fragment key={queuedVideo.clip?.bucketUrl}>
                    {queuedVideo.clip === null ? (
                      <div
                        key={index}
                        className="flex h-fit min-h-48 min-w-fit flex-col items-center justify-center rounded-lg bg-gray-100 px-4"
                      >
                        <p className="text-sm text-[#3E3E3E]">Clip</p>
                        <p className="text-xs text-[#3E3E3E]">
                          {new Date(queuedVideo.createdAt).toLocaleString(
                            "default",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                        <p className="mt-6 text-sm text-[#3E3E3E]">Status</p>
                        <span className="mt-1 min-w-fit whitespace-nowrap rounded-full bg-[#a5a1f8] px-2 py-1 text-xs font-normal text-white">
                          {queuedVideo.status}
                        </span>
                      </div>
                    ) : (
                      <div
                        key={index}
                        className="flex h-fit min-w-32 max-w-32 flex-col items-center justify-center rounded-lg"
                      >
                        <ClientVideo url={queuedVideo.clip.bucketUrl ?? ""} />
                        <a
                          href={queuedVideo.clip.bucketUrl ?? undefined}
                          download
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                        >
                          Download
                        </a>
                        <span className="mt-1 text-center text-xs text-gray-600">
                          {new Date(queuedVideo.clip.createdAt).toLocaleString(
                            "default",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <TfiFaceSmile className="min-h-6 min-w-6 text-[#8C8C8C]" />
              <p className="text-center text-sm text-[#8C8C8C]">
                When clips are created, they will show up here.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
