import { useState, useEffect, useRef } from "react";

// Dropdown component
export type Option = {
  key: string;
  value: string;
};

interface DropdownProps {
  options: Option[];
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  label,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (value: string) => {
    setIsOpen(!isOpen);
    onChange(value);
  };

  const key = options.find((option) => option.value === value)?.key;

  const filteredOptions = options.filter((option) =>
    option.key.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block w-full text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex w-full items-center justify-between rounded-[3px] border border-[#D7D7D7] bg-white px-4 py-2 text-sm font-medium text-[#222A31] hover:bg-gray-50"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {key}
          <svg
            className="-mr-1 ml-2 h-5 w-5 text-[#D7D7D7]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 max-h-60 w-full origin-top-left overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <input
            type="text"
            autoFocus
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-sm text-gray-700 outline-none"
          />
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {filteredOptions.map((option) => (
              <a
                key={option.value}
                href="#"
                className="selected block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault(); // prevent default action
                  handleOptionClick(option.value);
                }}
              >
                {option.key}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
