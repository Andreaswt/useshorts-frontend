"use server";

import { env } from "~/env.mjs";
import { userFromSession } from "./authentication";

export const sendDiscordFeedback = async (
  message: string,
  sentiment: "positive" | "negative",
  extraInfo?: string,
) => {
  const user = await userFromSession();

  try {
    await fetch(env.DISCORD_FEEDBACK_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `Sentiment: ${sentiment}\nMessage: ${message}\nUser: ${user?.email}\n${extraInfo ? `Extra info: ${extraInfo}` : ""}
        `,
      }),
    });
  } catch (err: any) {
    console.error("Error sending feedback to discord:", err.message);
  }
};
