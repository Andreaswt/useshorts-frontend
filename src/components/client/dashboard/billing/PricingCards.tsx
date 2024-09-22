"use client";

import React, { useState } from "react";
import { PricingCard } from "../PricingCard";

export default function PricingCards({
  alreadySubscribed,
}: {
  alreadySubscribed: boolean;
}) {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingCycle(e.target.checked ? "yearly" : "monthly");
  };

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex items-center justify-center">
        <span className="mr-2 text-sm text-gray-500">Billed Monthly</span>
        {/* Custom Toggle */}
        <div className="relative inline-block w-10 select-none align-middle transition duration-200 ease-in">
          <input
            type="checkbox"
            name="billingCycleToggle"
            id="billingCycleToggle"
            className="toggle-checkbox absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 bg-white"
            checked={billingCycle === "yearly"}
            onChange={handleChange}
            style={{ right: billingCycle === "yearly" ? "0px" : "auto" }}
          />
          <label
            htmlFor="billingCycleToggle"
            className={`toggle-label block h-6 cursor-pointer overflow-hidden rounded-full ${
              billingCycle === "yearly" ? "bg-[#918CF2]" : "bg-gray-300"
            }`}
          ></label>
        </div>
        <div className="flex flex-col sm:flex-row">
          <span className="ml-2 text-sm text-gray-500">Billed Yearly</span>
          <span className="ml-2 rounded-full bg-[#918CF2] px-2 py-0.5 text-center text-xs font-medium text-white">
            30% OFF
          </span>
        </div>
      </div>
      <div className="flex w-full flex-wrap justify-center gap-2">
        {billingCycle === "monthly" ? (
          <>
            <PricingCard
              plan="starter-monthly"
              price="19"
              benefits={[
                "Automatic clipping & posting",
                "Credits for a post every second day",
                "16 credits per month",
              ]}
              term="monthly"
              alreadySubscribed={alreadySubscribed}
            />
            <PricingCard
              plan="growth-monthly"
              price="29"
              benefits={[
                "Everything in Starter",
                "Credits for one post per day",
                "31 credits per month",
              ]}
              term="monthly"
              alreadySubscribed={alreadySubscribed}
            />
            <PricingCard
              plan="double-growth-monthly"
              price="49"
              benefits={[
                "Everything in Growth",
                "Credits for two posts per day",
                "62 credits per month",
              ]}
              term="monthly"
              alreadySubscribed={alreadySubscribed}
            />
          </>
        ) : (
          <>
            <PricingCard
              plan="starter-yearly"
              price="13.3"
              benefits={[
                "Automatic clipping & posting",
                "Credits for a post every second day",
                "16 credits per month",
              ]}
              term="yearly"
              alreadySubscribed={alreadySubscribed}
            />
            <PricingCard
              plan="growth-yearly"
              price="20.3"
              benefits={[
                "Everything in Starter",
                "Credits for one post per day",
                "31 credits per month",
              ]}
              term="yearly"
              alreadySubscribed={alreadySubscribed}
            />
            <PricingCard
              plan="double-growth-yearly"
              price="34.3"
              benefits={[
                "Everything in Growth",
                "Credits for two posts per day",
                "62 credits per month",
              ]}
              term="yearly"
              alreadySubscribed={alreadySubscribed}
            />
          </>
        )}
      </div>
      <div className="mt-6 flex w-full flex-col items-center gap-2">
        <span className="mr-2 text-center text-sm text-gray-500">
          &apos;I saw a tangible impact on subscribers and views since day
          one&apos;
        </span>
        <div className="flex items-center gap-1">
          <img src="/star.png" alt="logo" className="h-5 w-5" />
          <img src="/star.png" alt="logo" className="h-5 w-5" />
          <img src="/star.png" alt="logo" className="h-5 w-5" />
          <img src="/star.png" alt="logo" className="h-5 w-5" />
          <img src="/star.png" alt="logo" className="h-5 w-5" />
        </div>
        <span className="mr-2 text-center text-xs text-gray-500">
          -Daniel Holler, Modern Web Development
        </span>
      </div>
    </div>
  );
}
