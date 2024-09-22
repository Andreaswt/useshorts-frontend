import React, { useEffect, useState } from "react";
import * as Yup from "yup";

interface NumberInputProps {
  value?: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: string;
  label: string;
  disabled?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  label,
  unit,
  disabled,
}) => {
  const [error, setError] = useState("");

  const Schema = Yup.object().shape({
    number: Yup.number()
      .typeError("must be number")
      .min(min)
      .max(max)
      .required("required"),
  });

  useEffect(() => {
    Schema.validate({ number: value })
      .then(() => {
        setError("");
        onChange(Number(value));
      })
      .catch((err) => {
        setError(err.errors[0]);
      });
  }, [value]);

  return (
    <div className={`relative flex w-fit flex-col gap-1 text-left`}>
      <label className="font-[#222A31] text-xs">{label}</label>
      <div className="relative inline-flex w-fit items-center">
        <input
          disabled={disabled}
          type="number"
          className={`text-md ${unit ? "w-24 px-3 pr-6" : "w-12 px-1"} appearance-none rounded-[3px] border border-[#D7D7D7] py-1.5 ${disabled ? "bg-gray-200 text-gray-400" : "bg-white text-[#222A31]"} outline-none`}
          name="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {unit ? (
          <span className="absolute right-2 top-0 flex h-full items-center justify-center font-light text-[#B5B5B5]">
            {unit}
          </span>
        ) : null}
      </div>
      {error && (
        <p className="absolute top-full mt-1 w-[150%] rounded-sm bg-white p-1 text-xs text-black">
          {error}
        </p>
      )}
      <button type="button"></button>
    </div>
  );
};

export default NumberInput;
