"use server";

import { db } from "~/server/db";
import { userFromSession } from "./authentication";
import { revalidatePath } from "next/cache";
import { SchedulingOrder } from "@prisma/client";
import { redirect } from "next/navigation";
import { env } from "~/env.mjs";

export const pauseStartPosting = async () => {
  const user = await userFromSession();

  const dbUser = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    select: {
      isRunning: true,
    },
  });

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      isRunning: !dbUser.isRunning,
    },
  });

  revalidatePath("/dashboard");
};

export const updateSelectedChannel = async (
  selectedChannelId: string | null,
  selectedChannelName: string | null,
  selectedChannelImage: string | null,
) => {
  const user = await userFromSession();

  const channelAlreadyConnected = await db.oAuth.findMany({
    where: {
      selectedChannelId: selectedChannelId,
    },
  });

  // Channel already connected, and doesn't belong to user
  if (
    channelAlreadyConnected.length > 0 &&
    !channelAlreadyConnected.some((x) => x.userId === user.id)
  ) {
    console.error("Channel already connected");
    redirect(
      env.NEXTAUTH_URL +
        `/dashboard?errorMessage=${encodeURIComponent("The selected YouTube account has already been connected to a UseShorts account. Try another one.")}`,
    );
  }

  await db.oAuth.update({
    where: {
      provider_userId: {
        userId: user.id,
        provider: "youtube",
      },
    },
    data: {
      selectedChannelId: selectedChannelId,
      selectedChannelName: selectedChannelName,
      selectedChannelImage: selectedChannelImage,
    },
  });
};

export const updatePostingFrequency = async (postingFrequencyValue: string) => {
  const user = await userFromSession();

  if (["0.5x", "1x", "2x"].includes(postingFrequencyValue)) {
    await db.oAuth.update({
      where: {
        provider_userId: {
          userId: user.id,
          provider: "youtube",
        },
      },
      data: {
        postingFrequency: postingFrequencyValue,
      },
    });
  }
};

export const updatePostFromPlaylist = async (
  selectedPlaylistId: string | null,
  selectedPlaylistName: string | null,
  selectedPlaylistImage: string | null,
) => {
  const user = await userFromSession();

  await db.oAuth.update({
    where: {
      provider_userId: {
        userId: user.id,
        provider: "youtube",
      },
    },
    data: {
      selectedPlaylistId: selectedPlaylistId,
      selectedPlaylistName: selectedPlaylistName,
      selectedPlaylistImage: selectedPlaylistImage,
    },
  });
};

export const updatePublicOrPrivate = async (postAsPrivate: boolean) => {
  const user = await userFromSession();

  await db.oAuth.update({
    where: {
      provider_userId: {
        userId: user.id,
        provider: "youtube",
      },
    },
    data: {
      postAsPrivate: postAsPrivate,
    },
  });
};

export const updateNotifySubscribers = async (notifySubscribers: boolean) => {
  const user = await userFromSession();

  await db.oAuth.update({
    where: {
      provider_userId: {
        userId: user.id,
        provider: "youtube",
      },
    },
    data: {
      notifySubscribers: notifySubscribers,
    },
  });
};

export const updateSchedulingOrder = async (
  schedulingOrder: SchedulingOrder,
) => {
  const user = await userFromSession();

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      schedulingOrder: schedulingOrder,
    },
  });
};
