"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import Select, { ActionMeta, SingleValue } from "react-select";
import { updatePublicOrPrivate } from "~/app/actions/posting";
import { useOptionsStore } from "~/stores/optionsStore";

interface Option {
  value: string;
  label: string;
}

export default function PublicOrPrivate({
  defaultValue,
}: {
  defaultValue: string;
}) {
  const options: Option[] = [
    { value: "public", label: "Public" },
    { value: "private", label: "Private / Unlisted" },
  ];

  const { publicOrPrivate, setPublicOrPrivate } = useOptionsStore();

  useEffect(() => {
    if (publicOrPrivate === null) {
      setPublicOrPrivate(
        options.find((option) => option.value === defaultValue)!,
      );
    }
  }, []);

  const handleChange = (
    selectedOption: SingleValue<Option>,
    actionMeta: ActionMeta<Option>,
  ) => {
    const selectedOptionValue = selectedOption!;
    setPublicOrPrivate(selectedOptionValue);

    updatePublicOrPrivate(
      selectedOptionValue.value === "private" ? true : false,
    )
      .then(() => {
        toast.success(
          "Posting as " + selectedOptionValue.value + " from now on",
        );
      })
      .catch(() => {
        toast.error("Failed to update posting privacy");
      });
  };

  return (
    <div className="flex w-fit flex-col gap-1">
      <label
        htmlFor="privacySelect"
        className="block text-sm font-medium text-gray-700"
      >
        Post video as
      </label>
      <Select
        id="privacySelect"
        name="privacySelect"
        className="mt-1 w-full text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        options={options}
        value={publicOrPrivate}
        onChange={handleChange}
      />
    </div>
  );
}
