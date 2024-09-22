"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getChannels } from "~/app/actions/youtube/actions";
import { SingleValue, ActionMeta } from "react-select";
import toast from "react-hot-toast";
import { updateSelectedChannel } from "~/app/actions/posting";
import { useOptionsStore } from "~/stores/optionsStore";

interface ChannelOption {
  value: string;
  label: string;
  image: string;
}

export default function SelectChannel({
  defaultOption,
}: {
  defaultOption: ChannelOption | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ChannelOption[]>(
    defaultOption ? [defaultOption] : [],
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const { postToYouTubeChannel, setPostToYouTubeChannel } = useOptionsStore();

  useEffect(() => {
    if (postToYouTubeChannel === null) {
      setPostToYouTubeChannel(defaultOption);
    }
  }, []);

  const loadChannels = async () => {
    if (isFirstLoad) {
      setIsLoading(true);
      const channels = await getChannels();
      setIsLoading(false);
      setOptions(
        channels.map((channel) => ({
          value: channel.id,
          label: channel.name,
          image: channel.image,
        })),
      );
      setIsFirstLoad(false);
    }
  };

  const formatOptionLabel = (option: ChannelOption) => (
    <div className="flex items-center">
      <img
        src={option.image}
        alt={option.label}
        className="mr-2 h-6 w-6 rounded-full"
      />
      <span>{option.label}</span>
    </div>
  );

  const handleChange = (
    selectedOption: SingleValue<ChannelOption>,
    actionMeta: ActionMeta<ChannelOption>,
  ) => {
    if (selectedOption) {
      const selectedOptionValue = selectedOption!;
      setPostToYouTubeChannel(selectedOption);

      updateSelectedChannel(
        selectedOptionValue.value,
        selectedOptionValue.label,
        selectedOptionValue.image,
      )
        .then(() => {
          toast.success("Channel selected successfully");
        })
        .catch(() => {
          toast.error("Failed to select channel");
        });
    } else {
      setPostToYouTubeChannel(null);
    }
  };

  return (
    <div className="flex w-fit flex-col gap-1">
      <label
        htmlFor="channelSelect"
        className="block text-sm font-medium text-gray-700"
      >
        Post to YouTube Channel
      </label>
      <Select
        id="channelSelect"
        name="channelSelect"
        className="mt-1 w-full text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        isLoading={isLoading}
        isSearchable
        options={options}
        value={postToYouTubeChannel}
        onMenuOpen={loadChannels}
        formatOptionLabel={formatOptionLabel}
        onChange={handleChange}
      />
    </div>
  );
}
