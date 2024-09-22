"use client";

import { youtubeOauth } from "~/app/actions/youtube/actions";

export default function YouTubeOAuth() {
  return (
    <button
      type="button"
      className="flex h-10 w-fit items-center justify-center gap-3 rounded-lg bg-[#232323] px-4 py-2 font-medium text-white"
      id="options-menu"
      aria-haspopup="true"
      aria-expanded="true"
      onClick={async () => await youtubeOauth()}
    >
      Log in with YouTube
      <img src="/yt_logo.png" alt="YouTube Logo" className="h-full" />
    </button>
  );
}
