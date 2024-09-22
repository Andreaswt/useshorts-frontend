"use client";

import { IoMdCheckmark } from "react-icons/io";
import {
  redirectToBillingPortal,
  redirectToCheckoutSession,
} from "~/app/actions/subscription/actions";

export const PricingCard = ({
  plan,
  price,
  benefits,
  term,
  alreadySubscribed,
}: {
  plan:
    | "starter-monthly"
    | "growth-monthly"
    | "double-growth-monthly"
    | "starter-yearly"
    | "growth-yearly"
    | "double-growth-yearly";
  price: string;
  benefits: string[];
  term: "yearly" | "monthly";
  alreadySubscribed: boolean;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex h-[325px] w-72 flex-col items-start justify-center gap-1.5 rounded-xl border border-[#DFDFDF] bg-white px-5 py-5 text-start">
        <div className="flex h-full w-full flex-col justify-between">
          <div className="h-fit">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg font-medium tracking-wide text-[#3E3E3E]">
                {(plan === "starter-monthly" || plan === "starter-yearly") &&
                  "Starter"}
                {(plan === "growth-monthly" || plan === "growth-yearly") &&
                  "Growth"}
                {(plan === "double-growth-monthly" ||
                  plan === "double-growth-yearly") &&
                  "Double Growth"}
              </h3>
              {plan.includes("yearly") && (
                <span className="ml-2 rounded-full bg-[#918CF2] px-2 py-0.5 text-xs font-medium text-white">
                  30% OFF
                </span>
              )}
            </div>
            <div className="mb-5 flex items-end gap-1">
              <h3 className="text-3xl font-medium tracking-wide text-[#3E3E3E]">
                ${price}
              </h3>
              <h3 className="text-md font-medium tracking-wide text-[#898989]">
                {term === "monthly" ? "/mo" : "/mo, billed yearly"}
              </h3>
            </div>
            {benefits.map((benefit, index) => (
              <div key={index} className="mb-2 flex items-center gap-2">
                <IoMdCheckmark className="min-h-6 min-w-6 text-[#3E3E3E]" />
                <h3 className="text-sm font-medium tracking-wide text-[#3E3E3E]">
                  {benefit}
                </h3>
              </div>
            ))}
          </div>
          {alreadySubscribed ? (
            <button
              className="mt-4 flex h-fit w-full items-center justify-center rounded-lg bg-[#232323] py-3 font-medium text-white"
              onClick={() => redirectToBillingPortal()}
            >
              Switch plan
            </button>
          ) : (
            <button
              className="mt-4 flex h-fit w-full items-center justify-center rounded-lg bg-[#232323] py-3 font-medium text-white"
              onClick={() => redirectToCheckoutSession(plan)}
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
