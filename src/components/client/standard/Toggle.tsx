"use client";

interface ToggleProps {
  label?: string;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  value,
  onChange,
  disabled,
}) => {
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  return (
    <>
      <style jsx>{`
        .toggle-checkbox:checked + .toggle-label {
          background-color: #222a31;
        }
        .toggle-checkbox {
          transform: translateX(0px);
          transition: transform 0.2s ease-in;
          background-color: #222a31;
        }
        .toggle-checkbox:checked {
          transform: translateX(32px);
          transition: transform 0.2s ease-in;
          background-color: white;
        }
        .toggle-checkbox:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
      <div className="flex flex-col gap-3">
        {label && (
          <label
            className={`text-xs ${disabled ? "text-gray-400" : "font-[#222A31]"}`}
          >
            {label}
          </label>
        )}
        <label // wrap the input with a label
          className={`relative inline-block h-6 w-14 ${
            disabled ? "cursor-not-allowed" : "select-none"
          } align-middle transition duration-200 ease-in`}
        >
          <input
            checked={value}
            disabled={disabled}
            type="checkbox"
            onChange={handleToggleChange} // attach the onChange event to the input
            className="toggle-checkbox absolute left-0.5 top-0.5 block h-5 w-5 cursor-pointer appearance-none rounded-full"
          />
          <span
            className={`toggle-label block h-6 cursor-pointer overflow-hidden rounded-full border ${disabled ? "border-gray-400" : "border-[#222A31]"}`}
          ></span>
        </label>
      </div>
    </>
  );
};
