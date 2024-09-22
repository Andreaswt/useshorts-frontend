"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";
import { getChannels } from "~/app/actions/youtube/actions";
import { SingleValue, ActionMeta } from "react-select";
import toast from "react-hot-toast";
import {
  updatePostingFrequency,
  updateSelectedChannel,
} from "~/app/actions/posting";
import { useOptionsStore } from "~/stores/optionsStore";

interface PostingFrequencyOption {
  value: string;
  label: string;
}

export default function PostingFrequency({
  defaultValue,
}: {
  defaultValue: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const options = [
    {
      value: "0.5x",
      label: "Every second day",
    },
    {
      value: "1x",
      label: "Every day",
    },
    {
      value: "2x",
      label: "Twice a day",
    },
  ];

  const { postingFrequency, setPostingFrequency } = useOptionsStore();

  useEffect(() => {
    if (postingFrequency === null) {
      setPostingFrequency(
        options.find((option) => option.value === defaultValue)!,
      );
    }
  }, []);

  const handleChange = (
    selectedOption: SingleValue<PostingFrequencyOption>,
    actionMeta: ActionMeta<PostingFrequencyOption>,
  ) => {
    if (selectedOption) {
      const selectedOptionValue = selectedOption!;
      setPostingFrequency(selectedOption);

      updatePostingFrequency(selectedOptionValue.value)
        .then(() => {
          toast.success("Posting frequency selected successfully");
        })
        .catch(() => {
          toast.error("Failed to select posting frequency");
        });
    }
  };

  return (
    <div className="flex w-fit flex-col gap-1">
      <label
        htmlFor="channelSelect"
        className="block text-sm font-medium text-gray-700"
      >
        Autoposting frequency
      </label>
      <Select
        id="channelSelect"
        name="channelSelect"
        className="mt-1 w-full text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        isLoading={isLoading}
        options={options}
        value={postingFrequency}
        onChange={handleChange}
      />
    </div>
  );
}
