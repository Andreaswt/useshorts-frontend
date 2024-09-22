"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineCreditCard, AiOutlineHome } from "react-icons/ai";

export const SidebarLinks = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-row gap-8 sm:flex-col sm:gap-4">
      <Link
        href="/dashboard"
        className={`rounded-[3px] ${pathname === "/dashboard" && "bg-[#D9D9D9]"} h-fit w-fit bg-opacity-50 p-3`}
      >
        <AiOutlineHome className="h-6 w-6 text-[#3E3E3E]"></AiOutlineHome>
      </Link>
    </div>
  );
};
