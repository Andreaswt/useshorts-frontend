"use client";

import { useState } from "react";
import Link from "next/link";
import { IoClose } from "react-icons/io5";

function FreeLimitReachedOverlay() {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleOutsideClick = (event: any) => {
    if (event.target.id === "overlay-background") {
      setIsVisible(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      id="overlay-background"
      className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="relative mx-4 flex flex-col items-center rounded-lg bg-white p-6 shadow-lg md:mx-0">
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 text-lg text-gray-400 hover:text-gray-600"
        >
          <IoClose className="h-6 w-6" />
        </button>
        <h2 className="mb-4 text-xl font-bold text-[#3E3E3E]">
          Free Limit Reached
        </h2>
        <p className="text-md mb-4 text-center text-[#8C8C8C]">
          Free users only get a 3 credits. Please upgrade to get more.
        </p>
        <div className="flex gap-4">
          <button onClick={handleClose} className="text-sm font-medium">
            Close
          </button>
          <Link
            href="/dashboard/billing"
            className="flex h-8 items-center justify-center gap-2 rounded-lg bg-[#918CF2] px-3 py-1 text-sm font-medium text-white"
          >
            Upgrade
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FreeLimitReachedOverlay;
