"use client";

import { IoPauseOutline, IoPlayOutline } from "react-icons/io5";
import { pauseStartPosting } from "~/app/actions/posting";

export default function PauseStartPosting({
  isRunning,
}: {
  isRunning: boolean;
}) {
  return (
    <button onClick={() => pauseStartPosting()}>
      {isRunning ? (
        <IoPauseOutline className="h-8 w-8" />
      ) : (
        <IoPlayOutline className="h-8 w-8" />
      )}
    </button>
  );
}
