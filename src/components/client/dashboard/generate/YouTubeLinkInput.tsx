"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { generateVideo } from "~/app/actions/youtube/actions";

const YouTubeLinkInput: React.FC = () => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const Schema = Yup.object().shape({
    youtubeLink: Yup.string()
      .matches(
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
        "Invalid YouTube link",
      )
      .required("YouTube link is required"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    Schema.validate({ youtubeLink: value })
      .then(() => {
        generateVideo(value).then((response) => {
          if (typeof response === "string") {
            toast.error(response);
            setLoading(false);
          } else if (response === true) {
            toast.success("Queuing video for generation");
            setLoading(false);
          }
        });
      })
      .catch((err) => {
        toast.error(err.errors[0]);
        setLoading(false);
      });
  };

  return (
    <div className={`relative flex w-fit max-w-full flex-col gap-1 text-left`}>
      <div className="flex flex-col">
        <label className="mb-1 font-[#222A31] text-xs">
          Insert a YouTube podcast link
        </label>
        <div className="relative inline-flex h-10 w-fit max-w-full items-center">
          <input
            disabled={loading}
            type="text"
            className={`text-md h-full w-96 max-w-full appearance-none rounded-l-lg border-b border-l border-t border-[#D7D7D7] px-3 py-1.5 ${
              loading ? "bg-gray-200 text-gray-400" : "bg-white text-[#222A31]"
            } outline-none`}
            name="youtubeLink"
            value={value}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=WV73chlJaoo"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="text-md flex h-full items-center justify-center gap-2 rounded-r-lg bg-[#918CF2] px-3 font-medium text-white"
          >
            {loading ? "Loading..." : "Generate"}
          </button>
        </div>
        <p className="mt-1 text-xs text-[#646363]">
          By pressing &quot;generate&quot; you confirm that the video in the
          link video is owned by you
        </p>
      </div>
    </div>
  );
};

export default YouTubeLinkInput;
