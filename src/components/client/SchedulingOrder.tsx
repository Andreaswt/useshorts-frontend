"use client";

import { SchedulingOrder as SchedulingOrderType } from "@prisma/client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Select, { ActionMeta, SingleValue } from "react-select";
import { updateSchedulingOrder } from "~/app/actions/posting";
import { useOptionsStore } from "~/stores/optionsStore";

interface Option {
  value: string;
  label: string;
}

export default function SchedulingOrder({
  defaultValue,
}: {
  defaultValue: SchedulingOrderType;
}) {
  const options: Option[] = [
    { value: "CHRONOLOGICAL", label: "Clip newest first" },
    { value: "SHUFFLE", label: "Clip in random order" },
  ];

  const { schedulingOrder, setSchedulingOrder } = useOptionsStore();

  useEffect(() => {
    if (schedulingOrder === null) {
      setSchedulingOrder(
        options.find((option) => option.value === defaultValue)!,
      );
    }
  }, []);

  const handleChange = (
    selectedOption: SingleValue<Option>,
    actionMeta: ActionMeta<Option>,
  ) => {
    const selectedOptionValue = selectedOption!;
    setSchedulingOrder(selectedOptionValue);

    const updateValue =
      selectedOptionValue.value === "CHRONOLOGICAL"
        ? SchedulingOrderType.CHRONOLOGICAL
        : SchedulingOrderType.SHUFFLE;

    updateSchedulingOrder(updateValue)
      .then(() => {
        toast.success(selectedOptionValue.label + " selected successfully");
      })
      .catch(() => {
        toast.error("Failed to update scheduling order");
      });
  };

  return (
    <div className="flex w-fit flex-col gap-1">
      <label
        htmlFor="schedulingOrderSelect"
        className="block text-sm font-medium text-gray-700"
      >
        Video selection order
      </label>
      <Select
        id="schedulingOrderSelect"
        name="schedulingOrderSelect"
        className="mt-1 w-full text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        options={options}
        value={schedulingOrder}
        onChange={handleChange}
      />
    </div>
  );
}
