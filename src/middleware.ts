export { default } from "next-auth/middleware";

export const config = {
  // All pages except those listed here
  matcher: [
    "/((?!login|signup|signout|api/v1/stripe/webhook|api/oauth/youtube|api/cron/bi-daily|api/cron/daily|api/cron/twice-daily|logo.png|icon.png|yt_logo.png|star.png).*)",
  ],
};
