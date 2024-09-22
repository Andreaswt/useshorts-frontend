"use server";

import { SQS } from "aws-sdk";
import { google } from "googleapis";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as Yup from "yup";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { userFromSession } from "../authentication";

export const generateVideo = async (youtubeLink: string) => {
  const user = await userFromSession();

  const Schema = Yup.object().shape({
    youtubeLink: Yup.string()
      .matches(
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
        "Invalid YouTube link",
      )
      .required("YouTube link is required"),
  });

  try {
    await Schema.validate({ youtubeLink: youtubeLink });
  } catch (err) {
    return "Invalid YouTube link";
  }

  // Extract the video ID from the YouTube link
  const videoIdMatch = youtubeLink.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (!videoIdMatch) {
    return "Invalid YouTube link";
  }
  const videoId = videoIdMatch[1];

  if (videoId === undefined) {
    return "Invalid YouTube link";
  }

  const dbUser = await db.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    select: {
      credits: true,
      videos: true,
      id: true,
      OAuthTokens: true,
    },
  });

  if (dbUser.credits < 1) {
    return "You have no credits left";
  }

  // const identifiedMoments = dbUser.videos.find((x) => x.youtube_id === videoId)
  //   ?.identifiedMoments as any;

  // if (identifiedMoments) {
  //   // @ts-ignore
  //   const unusedClipCount = identifiedMoments.filter(
  //     // @ts-ignore
  //     (x) => !x.used,
  //   ).length;

  //   if (unusedClipCount === 0) {
  //     return "All clips already extracted from video";
  //   }
  // }

  const youtube = google.youtube({
    version: "v3",
  });

  const response = await youtube.videos.list({
    part: ["id", "contentDetails"],
    id: [videoId],
    key: env.YOUTUBE_API_KEY,
  });

  const videoExists = response.data.items && response.data.items.length > 0;

  if (!videoExists) {
    return "Video not found";
  }

  function parseDuration(duration: any) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  }

  const durationISO =
    response.data.items?.[0]?.contentDetails?.duration ?? "PT0S";
  const durationSeconds = parseDuration(durationISO);

  const minDuration = 60; // 60 seconds
  const maxDuration = 90 * 60; // 90 minutes in seconds

  if (durationSeconds <= minDuration || durationSeconds > maxDuration) {
    return "Video duration must be between 60 seconds and 90 minutes";
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      credits: {
        decrement: 1,
      },
    },
  });

  const queuedVideo = await db.queuedVideo.create({
    data: {
      userId: dbUser.id,
      status: "Queued",
    },
    select: {
      id: true,
    },
  });

  const sqsClient = new SQS({
    region: env.AWS_REGION,
    credentials: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
  });

  await sqsClient
    .sendMessage({
      QueueUrl: env.SQS_SHORTS_PROCESSOR_QUEUE_URL,
      MessageBody: JSON.stringify({
        userId: dbUser.id,
        videoId: videoId,
        queuedVideoId: queuedVideo.id,
      }),
    })
    .promise();

  revalidatePath("/dashboard/generate");
  return true;
};

export const youtubeOauth = async () => {
  const scopes = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
  ];

  const oauth2Client = new google.auth.OAuth2(
    env.YOUTUBE_CLIENT_ID,
    env.YOUTUBE_CLIENT_SECRET,
    env.YOUTUBE_REDIRECT_URL,
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    redirect_uri: env.YOUTUBE_REDIRECT_URL,
    scope: scopes,
    prompt: "consent",
  });

  redirect(url);
};

export const getUserOauthClient = async () => {
  const user = await userFromSession();

  const dbUser = await db.oAuth.findUnique({
    where: {
      provider_userId: {
        provider: "youtube",
        userId: user.id,
      },
    },
    select: {
      refreshToken: true,
    },
  });

  const refreshToken = dbUser?.refreshToken;
  if (!refreshToken) throw new Error("No refresh token found");

  const oauth2Client = new google.auth.OAuth2(
    env.YOUTUBE_CLIENT_ID,
    env.YOUTUBE_CLIENT_SECRET,
    env.YOUTUBE_REDIRECT_URL,
  );

  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return oauth2Client;
};

export const getChannels = async () => {
  const client = await getUserOauthClient();
  const youtube = google.youtube({
    version: "v3",
    auth: client,
  });

  const response = await youtube.channels.list({
    part: ["id", "snippet"],
    mine: true,
  });

  // Extract the channel names and images
  const channels = response.data.items?.map((channel) => ({
    id: channel.id,
    name: channel.snippet?.title,
    image: channel.snippet?.thumbnails?.default?.url,
  })) as { id: string; name: string; image: string }[];

  const filteredChannels = channels?.filter(
    (channel) =>
      typeof channel.id === "string" &&
      typeof channel.name === "string" &&
      typeof channel.image === "string",
  );

  return filteredChannels;
};

export const getPlaylists = async () => {
  const client = await getUserOauthClient();
  const youtube = google.youtube({
    version: "v3",
    auth: client,
  });

  const response = await youtube.playlists.list({
    part: ["id", "snippet"],
    mine: true,
  });

  // Extract the playlist names and images
  const playlists = response.data.items?.map((playlist) => ({
    id: playlist.id,
    name: playlist.snippet?.title,
    image: playlist.snippet?.thumbnails?.default?.url,
  })) as { id: string; name: string; image: string }[];

  const filteredPlaylists = playlists?.filter(
    (playlist) =>
      typeof playlist.id === "string" &&
      typeof playlist.name === "string" &&
      typeof playlist.image === "string",
  );

  return filteredPlaylists;
};
