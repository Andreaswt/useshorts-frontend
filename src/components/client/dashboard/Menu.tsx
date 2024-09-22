"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import SignOut from "../SignOut";
import { Affiliate } from "@prisma/client";

export default function Menu({ affiliate }: { affiliate: Affiliate | null }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
        <Link href="/dashboard" className="flex-shrink-0">
          <img
            src="https://app.useshorts.app/logo.png"
            alt="logo"
            className="w-20"
          />
        </Link>
        {/* Desktop Menu */}
        <div className="hidden flex-1 justify-center space-x-10 md:flex">
          <Link
            href="/dashboard/generate"
            className="block rounded py-2 pl-3 pr-4 font-medium text-gray-600 hover:bg-gray-100 hover:text-[#918CF2] md:p-0 md:hover:bg-transparent md:hover:text-[#918CF2]"
          >
            Generate single clip
          </Link>
          <Link
            href="/dashboard"
            className="block rounded py-2 pl-3 pr-4 font-medium text-gray-600 hover:bg-gray-100 hover:text-[#918CF2] md:p-0 md:hover:bg-transparent md:hover:text-[#918CF2]"
          >
            Autoposting
          </Link>
          <Link
            href="/dashboard/billing"
            className="block rounded py-2 pl-3 pr-4 font-medium text-gray-600 hover:bg-gray-100 hover:text-[#918CF2] md:p-0 md:hover:bg-transparent md:hover:text-[#918CF2]"
          >
            Billing
          </Link>
          <Link
            href="/dashboard/refer"
            className="block rounded py-2 pl-3 pr-4 font-medium text-gray-600 hover:bg-gray-100 hover:text-[#918CF2] md:p-0 md:hover:bg-transparent md:hover:text-[#918CF2]"
          >
            Get free credits
          </Link>
          {affiliate !== null && (
            <Link
              href="/dashboard/affiliate"
              className="block rounded py-2 pl-3 pr-4 font-medium text-gray-600 hover:bg-gray-100 hover:text-[#918CF2] md:p-0 md:hover:bg-transparent md:hover:text-[#918CF2]"
            >
              Affiliate
            </Link>
          )}
        </div>
        {/* Desktop SignOut */}
        <div className="hidden md:block">
          <SignOut />
        </div>
        {/* Mobile Hamburger Icon */}
        <button className="block md:hidden" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden">
          <Link
            href="/dashboard/generate"
            className="block py-2 pl-3 pr-4 font-medium text-gray-600 hover:bg-gray-100 hover:text-[#918CF2]"
            onClick={toggleMenu}
          >
            Generate single clip
          </Link>
          <Link
            href="/dashboard"
            className="block py-2 pl-3 pr-4 font-medium text-gray-600 hover:bg-gray-100 hover:text-[#918CF2]"
            onClick={toggleMenu}
          >
            Autoposting
          </Link>
          <Link
            href="/dashboard/billing"
            className="block py-2 pl-3 pr-4 font-medium text-gray-600 hover:bg-gray-100 hover:text-[#918CF2]"
            onClick={toggleMenu}
          >
            Billing
          </Link>
          <Link
            href="/dashboard/refer"
            className="block py-2 pl-3 pr-4 font-medium text-gray-600 hover:bg-gray-100 hover:text-[#918CF2]"
            onClick={toggleMenu}
          >
            Get free credits
          </Link>
          {affiliate !== null && (
            <Link
              href="/dashboard/affiliate"
              className="block py-2 pl-3 pr-4 font-medium text-gray-600 hover:bg-gray-100 hover:text-[#918CF2]"
            >
              Affiliate
            </Link>
          )}
          <div className="py-2 pl-3 pr-4">
            <SignOut />
          </div>
        </div>
      )}
    </>
  );
}
