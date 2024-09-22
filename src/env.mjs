import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string(),
    CRON_SECRET: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.string().url(),
    AWS_REGION: z.string(),

    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    SHORTS_AWS_BUCKET_NAME: z.string(),
    SQS_SHORTS_CLIPPER_QUEUE_URL: z.string(),
    SQS_SHORTS_PROCESSOR_QUEUE_URL: z.string(),

    STRIPE_SECRET_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    STARTER_MONTHLY_PRICE_ID: z.string(),
    STARTER_YEARLY_PRICE_ID: z.string(),
    GROWTH_MONTHLY_PRICE_ID: z.string(),
    GROWTH_YEARLY_PRICE_ID: z.string(),
    DOUBLE_GROWTH_MONTHLY_PRICE_ID: z.string(),
    DOUBLE_GROWTH_YEARLY_PRICE_ID: z.string(),

    RESEND_API_KEY: z.string(),
    EMAIL_SERVER_USER: z.string(),
    EMAIL_SERVER_HOST: z.string(),
    EMAIL_SERVER_PORT: z.string(),
    EMAIL_FROM: z.string(),

    DISCORD_FEEDBACK_WEBHOOK_URL: z.string(),

    YOUTUBE_CLIENT_ID: z.string(),
    YOUTUBE_CLIENT_SECRET: z.string(),
    YOUTUBE_API_KEY: z.string(),
    YOUTUBE_REDIRECT_URL: z.string(),

    MAILERLITE_API_KEY: z.string(),
    MAILERLITE_SIGNUPS_GROUP: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    CRON_SECRET: process.env.CRON_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    STARTER_MONTHLY_PRICE_ID: process.env.STARTER_MONTHLY_PRICE_ID,
    STARTER_YEARLY_PRICE_ID: process.env.STARTER_YEARLY_PRICE_ID,

    GROWTH_MONTHLY_PRICE_ID: process.env.GROWTH_MONTHLY_PRICE_ID,
    GROWTH_YEARLY_PRICE_ID: process.env.GROWTH_YEARLY_PRICE_ID,

    DOUBLE_GROWTH_MONTHLY_PRICE_ID: process.env.DOUBLE_GROWTH_MONTHLY_PRICE_ID,
    DOUBLE_GROWTH_YEARLY_PRICE_ID: process.env.DOUBLE_GROWTH_YEARLY_PRICE_ID,

    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    SHORTS_AWS_BUCKET_NAME: process.env.SHORTS_AWS_BUCKET_NAME,
    SQS_SHORTS_CLIPPER_QUEUE_URL: process.env.SQS_SHORTS_CLIPPER_QUEUE_URL,
    SQS_SHORTS_PROCESSOR_QUEUE_URL: process.env.SQS_SHORTS_PROCESSOR_QUEUE_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_FROM: process.env.EMAIL_FROM,
    DISCORD_FEEDBACK_WEBHOOK_URL: process.env.DISCORD_FEEDBACK_WEBHOOK_URL,
    YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET,
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    YOUTUBE_REDIRECT_URL: process.env.YOUTUBE_REDIRECT_URL,
    MAILERLITE_API_KEY: process.env.MAILERLITE_API_KEY,
    MAILERLITE_SIGNUPS_GROUP: process.env.MAILERLITE_SIGNUPS_GROUP,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
