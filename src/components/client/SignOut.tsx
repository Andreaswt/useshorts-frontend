"use client";

import { signOut } from "next-auth/react";

import { IoLogOutOutline } from "react-icons/io5";

export default function SignOut() {
  return (
    <>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="h-8 w-8"
      >
        <IoLogOutOutline className="h-6 w-6" />
      </button>
      {/* <button onClick={() => test()} className="h-8 w-8">
        <IoLogOutOutline className="h-6 w-6" />
      </button> */}
    </>
  );
}
