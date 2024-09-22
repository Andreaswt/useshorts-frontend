"use client";

import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import NotifySubscribers from "../NotifySubscribers";
import PublicOrPrivate from "../PublicOrPrivate";
import SelectChannel from "../SelectChannel";
import SelectPlaylist from "../SelectPlaylist";
import YouTubeOAuth from "../YouTubeOAuth";
import PostingFrequency from "../PostingFrequency";

export const YouTubeOptions = ({
  youTubeConnected,
  invalidYouTubeRefreshToken,
  selectedChannelId,
  selectedChannelName,
  selectedChannelImage,
  selectedPlaylistId,
  selectedPlaylistName,
  selectedPlaylistImage,
  postAsPrivate,
  notifySubscribers,
  postingFrequency,
}: {
  youTubeConnected: boolean;
  invalidYouTubeRefreshToken: boolean;
  selectedChannelId: string;
  selectedChannelName: string;
  selectedChannelImage: string;
  selectedPlaylistId: string;
  selectedPlaylistName: string;
  selectedPlaylistImage: string;
  postAsPrivate: boolean;
  notifySubscribers: boolean;
  postingFrequency: string;
}) => {
  const searchParams = useSearchParams();

  const showOauth = !youTubeConnected || invalidYouTubeRefreshToken;

  if (!youTubeConnected && searchParams.get("errorMessage") === null) {
    toast("Connect your YouTube account to post to YouTube");
  }

  if (invalidYouTubeRefreshToken && searchParams.get("errorMessage") === null) {
    toast.error("Your YouTube account needs to be reconnected");
  }

  return (
    <>
      <PostingFrequency defaultValue={postingFrequency} />
      <SelectChannel
        defaultOption={
          selectedChannelId ?? selectedChannelName ?? selectedChannelImage
            ? {
                value: selectedChannelId,
                label: selectedChannelName,
                image: selectedChannelImage,
              }
            : null
        }
      />
      <SelectPlaylist
        defaultOption={
          selectedPlaylistId ?? selectedPlaylistName ?? selectedPlaylistImage
            ? {
                value: selectedPlaylistId,
                label: selectedPlaylistName,
                image: selectedPlaylistImage,
              }
            : null
        }
      />
      <PublicOrPrivate defaultValue={postAsPrivate ? "private" : "public"} />
      <NotifySubscribers defaultValue={notifySubscribers} />
    </>
  );
};
