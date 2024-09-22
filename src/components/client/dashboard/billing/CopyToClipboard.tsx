"use client";

import toast from "react-hot-toast";
import { FaRegClipboard } from "react-icons/fa";

export const CopyToClipboard = ({
  text,
  version,
}: {
  text: string;
  version: "v1" | "v2";
}) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy!");
    }
  };
  if (version === "v1") {
    return (
      <FaRegClipboard
        className="absolute right-3.5 top-3.5 h-4 w-4 cursor-pointer"
        onClick={copyToClipboard}
      />
    );
  } else {
    return (
      <button
        type="button"
        className="flex h-10 w-fit items-center justify-center rounded-lg bg-[#232323] p-0.5 font-medium text-white"
        onClick={copyToClipboard}
      >
        <span className="px-3 py-1.5 text-center text-sm">Copy link</span>
      </button>
    );
  }
};
