import { Analytics } from "@vercel/analytics/react";
import NextAuthProvider from "~/components/providers/NextAuthProvider";
import "~/styles/globals.css";
import ToastProvider from "../components/providers/ToastProvider";
import { FaExclamationTriangle } from "react-icons/fa";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="https://app.useshorts.app/icon.png"
          sizes="any"
        />
      </head>
      <body>
        <Analytics />
        <NextAuthProvider>
          <ToastProvider>
            {/* <div className="relative border-b border-gray-300/50 bg-[#d64737]">
              <div className="mx-auto flex max-w-screen-xl items-center justify-center space-x-4 p-4">
                <>
                  <span className="text-sm text-white">
                    UseShorts is currently unavailable due to an ongoing
                    incident. No videos are clipped.
                  </span>
                </>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-2 shadow-[0_4px_3px_-3px_rgba(0,0,0,0.1)]"></div>
            </div> */}
            {children}
          </ToastProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
