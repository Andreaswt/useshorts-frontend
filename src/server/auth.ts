import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";

import { env } from "~/env.mjs";
import NotionMagicLinkEmail from "~/lib/resend/NotionMagicLink";
import { stripe } from "~/lib/stripe/stripe";
import { db } from "~/server/db";
import { resend } from "../lib/resend/resend";
import MailerLite from "@mailerlite/mailerlite-nodejs";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      admin: boolean;
      // ...other properties
      // role: UserRole;
    };
  }

  interface User {
    // ...other properties
    // role: UserRole;
    admin: boolean;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    admin: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.admin = token.admin;
        session.user.email = token.email;
      }

      return session;
    },
    jwt: async ({ token, user }) => {
      if (!token.email) {
        return token;
      }

      const dbUser = await db.user.findUnique({
        where: {
          email: token.email,
        },
        select: {
          id: true,
          admin: true,
          email: true,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        admin: dbUser.admin,
        email: dbUser.email,
      };
    },
  },
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  providers: [
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.RESEND_API_KEY,
        },
      },
      from: env.EMAIL_FROM,

      sendVerificationRequest: async ({ identifier, url, provider }) => {
        try {
          const data = await resend.emails.send({
            from: "help@useshorts.app",
            to: [identifier],
            subject: `Login for Shorts!`,
            react: NotionMagicLinkEmail({ loginUrl: url }),
            headers: {
              "X-Entity-Ref-ID": new Date().getTime() + "",
            },
          });

          console.log("sending email:", data);
        } catch (error) {
          console.error(error);
        }
      },
    }),
  ],
  events: {
    createUser: async ({ user }) => {
      const email = user.email?.toLowerCase();

      if (email) {
        await stripe.customers
          .create({
            email: email,
          })
          .then(async (customer) => {
            await db.user.update({
              where: {
                email: email,
              },
              data: {
                email: customer.email!,
                stripeCustomerId: customer.id,
              },
            });

            // Sign user up in MailerLite
            const mailerlite = new MailerLite({
              api_key: env.MAILERLITE_API_KEY,
            });

            await mailerlite.subscribers.createOrUpdate({
              email: customer.email!,
              status: "active",
              groups: [env.MAILERLITE_SIGNUPS_GROUP],
            });
          })
          .catch((error) => {
            console.error("Error creating customer", error);
            return { error: "Error creating user. Try again." };
          });
      }
    },
  },
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60,
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
