"use client";

interface ProgressBarProps {
  progress: number; // Progress percentage
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="relative h-2 w-full rounded-[3px] border border-[#D7D7D7] bg-white py-4">
      <div
        style={{ width: `${progress}%`, transition: "width 0.2s" }}
        className="absolute left-0 top-0 h-full bg-[#D7D7D7]"
      ></div>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 transform font-light text-[#B5B5B5]">
        {progress.toFixed(0)}%
      </span>
    </div>
  );
};

export default ProgressBar;
