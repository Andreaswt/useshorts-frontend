import type { NextRequest } from "next/server";
import { env } from "~/env.mjs";
import { queueUserIdsToProcessing } from "~/lib/sqs/helper";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  console.log("Cron job started 1x/day");
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log("Cronjob unauthorized 1x/day");
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  console.log("Cron job is authorized 1x/day");

  const users = await db.user.findMany({
    where: {
      credits: {
        gt: 0,
      },

      // Connected to YouTube
      OAuthTokens: {
        some: {
          provider: "youtube",
          invalid: false,
          postingFrequency: "1x",
        },
      },

      // Is not paused
      isRunning: true,
    },
  });

  console.log("Found " + users.length + " users to process 1x/day");

  await queueUserIdsToProcessing(users.map((user) => user.id));

  console.log("Cron job finished 1x/day");

  return Response.json({ success: true });
}
