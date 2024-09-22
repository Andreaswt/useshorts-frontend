"use server";

import { ReactNode } from "react";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";
import Menu from "~/components/client/dashboard/Menu";
import { userFromSession } from "../actions/authentication";
import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { isUserActive } from "~/lib/stripe/helpers";

export default async function Layout({ children }: { children: ReactNode }) {
  const sessionUser = await userFromSession();

  const user = await db.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    select: {
      status: true,
      priceId: true,
      paymentStatus: true,
      credits: true,
      affiliate: true,
    },
  });

  if (!user) {
    console.error("User not found on page /dashboard in layout file");
    redirect("/signout");
  }

  const isActive =
    user.status && user.paymentStatus
      ? isUserActive(user.status, user.paymentStatus)
      : false;

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFCFA]">
      <header className="w-full">
        {!isActive && (
          <div className="relative border-b border-gray-300/50 bg-[#FCFCFA]">
            <div className="mx-auto flex max-w-screen-xl items-center justify-center space-x-4 p-4">
              <FaExclamationTriangle className="text-[#918CF2]" size={24} />

              <>
                <span className="text-sm">
                  {`You have ${user.credits} credits left. Upgrade to get more.`}
                </span>
                <Link
                  href="/dashboard/billing"
                  className="flex h-8 items-center justify-center gap-2 rounded-lg bg-[#918CF2] px-3 py-1 text-sm font-medium text-white"
                >
                  Upgrade
                </Link>
              </>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-2 shadow-[0_4px_3px_-3px_rgba(0,0,0,0.1)]"></div>
          </div>
        )}
        <nav className="w-full border-b border-gray-300/50 bg-[#FCFCFA]">
          <Menu affiliate={user.affiliate} />
        </nav>
      </header>
      <main className="mx-auto flex h-full w-full max-w-screen-xl flex-grow justify-center p-4 pt-2">
        {children}
      </main>
    </div>
  );
}
