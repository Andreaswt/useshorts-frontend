"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { FaExternalLinkAlt } from "react-icons/fa";
import { WiStars } from "react-icons/wi";
import Spinner from "../../standard/Spinner";
import { trackSignupClicks } from "~/app/actions/signup/cookies";

const SignupComponent = ({
  referralCode,
  affiliateId,
  urlEmail,
}: {
  referralCode: string | null;
  affiliateId: string | null;
  urlEmail: string | null;
}) => {
  "use client";
  const [email, setEmail] = useState(urlEmail ?? "");
  const [isPending, startTransition] = useTransition();
  const [cookieAffiliateId, setCookieAffiliateId] = useState<
    string | undefined
  >();

  useEffect(() => {
    const run = async () => {
      setCookieAffiliateId(await trackSignupClicks(affiliateId));
    };
    run();
  }, []);

  let url = "/dashboard";
  if (referralCode !== null) {
    url += `?ref=${referralCode}`;
  }
  if (cookieAffiliateId) {
    url += `${referralCode !== null ? "&" : "?"}aid=${cookieAffiliateId}`;
  }

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
          <div className="flex flex-col justify-center gap-4 text-center">
            <h2 className="text-3xl font-semibold text-[#3E3E3E]">
              Get 3 free clips
            </h2>
            <p className="text-md text-[#3E3E3E]">
              {referralCode === null
                ? "See your first clip shortly after signing up."
                : "+ 7 clips if you subscribe for using a referral code"}
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              startTransition(async () => {
                await signIn("email", {
                  email: email,
                  redirect: false,
                  callbackUrl: url,
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
                  {isPending ? <Spinner size="small" /> : "Sign Up"}
                </button>

                <p className="mt-2 text-sm">
                  By signing up, you agree with our{" "}
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
                <div className="mt-12 flex w-full flex-col items-center gap-2">
                  <span className="mr-2 text-center text-sm text-gray-500">
                    &apos;I saw a tangible impact on subscribers and views since
                    day one&apos;
                  </span>
                  <div className="flex items-center gap-1">
                    <img src="/star.png" alt="logo" className="h-5 w-5" />
                    <img src="/star.png" alt="logo" className="h-5 w-5" />
                    <img src="/star.png" alt="logo" className="h-5 w-5" />
                    <img src="/star.png" alt="logo" className="h-5 w-5" />
                    <img src="/star.png" alt="logo" className="h-5 w-5" />
                  </div>
                  <a
                    target="_blank"
                    href="https://www.youtube.com/@ModernWebDevelopmentYT/shorts"
                    className="flex items-center gap-2 text-center text-xs text-gray-500"
                  >
                    -Daniel Holler, Modern Web Development
                    <FaExternalLinkAlt className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupComponent;
