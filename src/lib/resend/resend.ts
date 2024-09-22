import { Resend } from "resend";
import { env } from "~/env.mjs";

declare const global: Global & { resend?: Resend };

export let resend: Resend;

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    resend = new Resend(env.RESEND_API_KEY);
  } else {
    if (!global.resend) {
      global.resend = new Resend(env.RESEND_API_KEY);
    }
    resend = global.resend;
  }
}
