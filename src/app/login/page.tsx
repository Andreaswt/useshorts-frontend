"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { WiStars } from "react-icons/wi";
import Spinner from "~/components/client/standard/Spinner";

const LoginComponent = () => {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <section className="flex h-screen items-center justify-center bg-[#FCFCFA]">
      <div className="relative mx-auto w-full max-w-7xl items-center px-5 py-12 md:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-md sm:px-4 md:w-[500px] md:px-0">
          <div className="flex w-full justify-center">
            <img
              src="https://app.useshorts.app/logo.png"
              alt="logo"
              className="mb-8 w-28"
            />
          </div>
          <div className="flex flex-col justify-center gap-8 text-center">
            <h2 className="text-3xl font-semibold text-[#3E3E3E]">Sign in</h2>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              startTransition(async () => {
                await signIn("email", {
                  email: email,
                  redirect: false,
                  callbackUrl: "/dashboard",
                });

                toast.success(
                  `An email has been sent to your email at ${email}. Please check your inbox or spam.`,
                  {
                    duration: 10000,
                  },
                );
              });
            }}
          >
            <div className="mt-10 space-y-6">
              {/* <div className="mx-auto h-1 w-full border-t border-[#e4e4e4]"></div> */}
              <input
                className="block w-full appearance-none rounded-[3px] border border-[#D7D7D7] bg-white px-3 py-3 pr-6 text-[#222A31] outline-none placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Email address"
                type="email"
                autoFocus
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="col-span-full">
                <button
                  disabled={isPending}
                  className="inline-flex w-full items-center justify-center rounded-md border-2 border-[#918CF2] bg-[#918CF2] px-6 py-2.5 text-center text-sm text-white duration-200 hover:border-black hover:bg-transparent hover:text-black focus:outline-none focus-visible:outline-black focus-visible:ring-black"
                  type="submit"
                >
                  {isPending ? <Spinner size="small" /> : "Log in"}
                </button>

                <p className="mt-2 text-sm">
                  By signing in, you agree with our{" "}
                  <a
                    className="font-semibold"
                    href="https://useshorts.app/terms"
                  >
                    terms
                  </a>{" "}
                  and{" "}
                  <a
                    className="font-semibold"
                    href="https://useshorts.app/privacy"
                  >
                    privacy policy
                  </a>
                  .
                </p>
                <div className="mt-6 flex items-center gap-2 rounded-md border bg-gray-100 px-4 py-3 text-sm">
                  <WiStars className="h-6 w-6" />
                  <p>
                    We&apos;ll send you a magic link for a password-free sign
                    in.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginComponent;
