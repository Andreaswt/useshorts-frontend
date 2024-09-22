"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import {
  PiThumbsDown,
  PiThumbsDownFill,
  PiThumbsUp,
  PiThumbsUpFill,
} from "react-icons/pi";
import { sendDiscordFeedback } from "~/app/actions/feedback";
import TextArea from "./standard/TextArea";

export const Feedback = ({ extraInfo }: { extraInfo?: string }) => {
  const [feedback, setFeedback] = useState("");
  const [sentiment, setSentiment] = useState<"positive" | "negative">(
    "positive",
  );
  const [showDialogue, setShowDialogue] = useState(false);

  const openDialogue = (sentiment: "positive" | "negative") => {
    setSentiment(sentiment);
    setShowDialogue(true);
  };

  const closeDialogue = (newSentiment?: "positive" | "negative") => {
    if (!newSentiment) {
      setShowDialogue(false);
    } else if (sentiment !== newSentiment) {
      setSentiment(newSentiment);
    } else if (newSentiment === sentiment) {
      setShowDialogue(false);
    }
  };

  const submitFeedback = () => {
    const run = async () => {
      sendDiscordFeedback(feedback, sentiment, extraInfo);
      toast.success("Thank you for your feedback!");
      closeDialogue();
      setFeedback("");
    };

    run();
  };

  return (
    <div className="fixed bottom-2 right-2 z-50">
      {showDialogue && (
        <div className="relative flex w-52 flex-col gap-2 rounded-[3px] border bg-[#FCFCFA] p-3">
          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-500">Send feedback</p>
          </div>
          <AiOutlineClose
            onClick={() => closeDialogue()}
            className="absolute right-2.5 top-2.5 h-6 w-6 cursor-pointer text-gray-500"
          ></AiOutlineClose>
          <TextArea
            value={feedback}
            onChange={(text) => setFeedback(text)}
            lines={5}
          />
          <button
            className="flex items-center justify-center rounded-[3px] bg-[#161717] py-2 text-sm text-white"
            onClick={() => submitFeedback()}
          >
            Send
          </button>
        </div>
      )}

      <div className="relative flex flex-col items-end gap-2">
        <p className="text-medium text-sm text-gray-500">Feedback</p>
        <div className="flex gap-2 text-gray-500">
          {showDialogue && sentiment === "positive" ? (
            <PiThumbsUpFill
              onClick={() => closeDialogue("positive")}
              className="h-6 w-6 cursor-pointer"
            ></PiThumbsUpFill>
          ) : (
            <PiThumbsUp
              onClick={() => openDialogue("positive")}
              className="h-6 w-6 cursor-pointer"
            ></PiThumbsUp>
          )}

          {showDialogue && sentiment === "negative" ? (
            <PiThumbsDownFill
              onClick={() => closeDialogue("negative")}
              className="h-6 w-6 cursor-pointer"
            ></PiThumbsDownFill>
          ) : (
            <PiThumbsDown
              onClick={() => openDialogue("negative")}
              className="h-6 w-6 cursor-pointer"
            ></PiThumbsDown>
          )}
        </div>
      </div>
    </div>
  );
};
