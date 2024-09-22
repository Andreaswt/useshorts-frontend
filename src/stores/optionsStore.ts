import { create } from "zustand";

interface OptionStore {
  postToYouTubeChannel: {
    value: string;
    label: string;
    image: string;
  } | null;
  setPostToYouTubeChannel: (
    postToYouTubeChannel: {
      value: string;
      label: string;
      image: string;
    } | null,
  ) => void;

  postFromPlaylist: {
    value: string;
    label: string;
    image: string;
  } | null;
  setPostFromPlaylist: (
    postFromPlaylist: {
      value: string;
      label: string;
      image: string;
    } | null,
  ) => void;

  publicOrPrivate: {
    value: string;
    label: string;
  } | null;
  setPublicOrPrivate: (
    publicOrPrivate: {
      value: string;
      label: string;
    } | null,
  ) => void;

  schedulingOrder: { value: string; label: string } | null;
  setSchedulingOrder: (schedulingOrder: {
    value: string;
    label: string;
  }) => void;

  notifySubscribers: boolean | null;
  setNotifySubscribers: (notifySubscribers: boolean) => void;

  postingFrequency: {
    value: string;
    label: string;
  } | null;
  setPostingFrequency: (postingFrequency: {
    value: string;
    label: string;
  }) => void;
}

export const useOptionsStore = create<OptionStore>((set) => ({
  postToYouTubeChannel: null,
  setPostToYouTubeChannel: (postToYouTubeChannel) =>
    set({ postToYouTubeChannel }),

  postFromPlaylist: null,
  setPostFromPlaylist: (postFromPlaylist) => set({ postFromPlaylist }),

  publicOrPrivate: null,
  setPublicOrPrivate: (publicOrPrivate) => set({ publicOrPrivate }),

  schedulingOrder: null,
  setSchedulingOrder: (schedulingOrder) => set({ schedulingOrder }),

  notifySubscribers: null,
  setNotifySubscribers: (notifySubscribers) => set({ notifySubscribers }),

  postingFrequency: null,
  setPostingFrequency: (postingFrequency) => set({ postingFrequency }),
}));
