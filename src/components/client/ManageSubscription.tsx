"use client";

import { redirectToBillingPortal } from "~/app/actions/subscription/actions";

export default function ManageSubscription() {
  return (
    <button
      className="flex h-10 w-fit items-center justify-center rounded-lg bg-[#232323] px-4 py-3 font-medium text-white"
      onClick={() => redirectToBillingPortal()}
    >
      Manage subscription
    </button>
  );
}
