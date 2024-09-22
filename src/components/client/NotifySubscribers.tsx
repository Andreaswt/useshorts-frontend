"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateNotifySubscribers } from "~/app/actions/posting";
import { useOptionsStore } from "~/stores/optionsStore";

export default function NotifySubscribers({
  defaultValue,
}: {
  defaultValue: boolean;
}) {
  const { notifySubscribers, setNotifySubscribers } = useOptionsStore();

  useEffect(() => {
    if (notifySubscribers === null) {
      setNotifySubscribers(defaultValue);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState = e.target.checked;

    setNotifySubscribers(newState);

    updateNotifySubscribers(newState)
      .then(() => {
        toast.success(
          newState
            ? "Subscribers will be notified"
            : "Subscribers will not be notified",
        );
      })
      .catch(() => {
        toast.error("Failed to update subscriber notification settings");
      });
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="notifyToggle"
        className="block text-sm font-medium text-gray-700"
      >
        Notify subscribers
      </label>
      {/* Toggle switch with dynamic styling based on isEnabled state */}
      <div className="relative inline-block w-10 select-none align-middle transition duration-200 ease-in">
        {notifySubscribers !== null && (
          <>
            <input
              type="checkbox"
              name="notifyToggle"
              id="notifyToggle"
              className="toggle-checkbox absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 bg-white"
              checked={notifySubscribers}
              onChange={handleChange}
              style={{ right: notifySubscribers ? "0px" : "auto" }}
            />
            <label
              htmlFor="notifyToggle"
              className={`toggle-label block h-6 cursor-pointer overflow-hidden rounded-full ${
                notifySubscribers ? "bg-[#918CF2]" : "bg-gray-300"
              }`}
            ></label>
          </>
        )}
      </div>
    </div>
  );
}
