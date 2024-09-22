"use client";

import React from "react";

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  lines: number;
  label?: string;
  disabled?: boolean;
  disableMultiLine?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  lines,
  label,
  disabled,
  disableMultiLine,
}) => {
  return (
    <div className="relative inline-block w-full text-left">
      {label ? (
        <label className="mb-1.5 font-[#222A31] text-xs">{label}</label>
      ) : null}
      <textarea
        disabled={disabled}
        value={value}
        onKeyDown={(e) => {
          if (e.key === "Enter" && disableMultiLine) {
            e.preventDefault();
          }
        }}
        onChange={(e) => onChange(e.target.value)}
        className={`text-md w-full resize-none appearance-none rounded-[3px] border border-[#D7D7D7] px-2 py-1.5 outline-none ${disabled ? "bg-gray-200 text-gray-400" : "bg-white text-[#222A31]"}`}
        rows={lines}
        aria-label={label}
      />
    </div>
  );
};

export default TextArea;
