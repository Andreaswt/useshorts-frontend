import MailerLite from "@mailerlite/mailerlite-nodejs";
import { google } from "googleapis";
import { redirect } from "next/navigation";
import { userFromSession } from "~/app/actions/authentication";
import { env } from "~/env.mjs";
import { db } from "~/server/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  console.log("1 code: " + JSON.stringify(code, null, 2));

  if (!code) {
    console.log("!code true");
    console.error("No code found in query params");
    redirect("/dashboard");
  }

  const user = await userFromSession();

  const oauth2Client = new google.auth.OAuth2(
    env.YOUTUBE_CLIENT_ID,
    env.YOUTUBE_CLIENT_SECRET,
    env.YOUTUBE_REDIRECT_URL,
  );

  console.log("Getting token");
  const { tokens } = await oauth2Client.getToken(code);
  console.log("tokens: " + JSON.stringify(tokens, null, 2));
  oauth2Client.setCredentials(tokens);

  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  // Check if the account has any YouTube channels
  const response = await youtube.channels.list({
    mine: true,
    part: ["id", "snippet"],
  });

  const accountHasNoYouTubeChannels =
    !response.data.items || response.data.items.length === 0;

  let selectedChannelId = null;
  let selectedChannelName = null;
  let selectedChannelImage = null;

  // If the account has YouTube channels, select the first one
  if (!accountHasNoYouTubeChannels) {
    selectedChannelId = response.data.items?.[0]?.id;
    selectedChannelName = response.data.items?.[0]?.snippet?.title;
    selectedChannelImage =
      response.data.items?.[0]?.snippet?.thumbnails?.default?.url;

    const channelAlreadyConnected = await db.oAuth.count({
      where: {
        selectedChannelId: selectedChannelId,
        invalid: false,
      },
    });

    if (channelAlreadyConnected > 0) {
      console.error("Channel already connected");
      redirect(
        env.NEXTAUTH_URL +
          `/dashboard?errorMessage=${encodeURIComponent("The selected YouTube account has already been connected to a UseShorts account. Try another one.")}`,
      );
    }
  } else {
    console.error("No channels on account");
    redirect(
      env.NEXTAUTH_URL +
        `/dashboard?errorMessage=${encodeURIComponent("No YouTube channels were found for the selected account. Try another one.")}`,
    );
  }

  if (tokens.refresh_token) {
    console.log(
      "refresh tokens: " + JSON.stringify(tokens.refresh_token, null, 2),
    );
    await db.oAuth.upsert({
      where: {
        provider_userId: {
          provider: "youtube",
          userId: user.id,
        },
      },
      create: {
        provider: "youtube",
        userId: user.id,
        refreshToken: tokens.refresh_token,
        selectedChannelId: selectedChannelId,
        selectedChannelName: selectedChannelName,
        selectedChannelImage: selectedChannelImage,
      },
      update: {
        refreshToken: tokens.refresh_token,
        invalid: false,
        selectedChannelId: selectedChannelId,
        selectedChannelName: selectedChannelName,
        selectedChannelImage: selectedChannelImage,
      },
    });
  }

  redirect("/dashboard");
}
