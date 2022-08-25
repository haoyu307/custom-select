import { useCallback, useMemo, useRef, useState } from "react";

import { ReactComponent as DownArrowIcon } from "./assets/arrowdown.svg";
import { ReactComponent as CloseIcon } from "./assets/close.svg";
import { DefaultOptionType, SelectProps } from "./type";

const MultiSelect = ({
  options,
  value,
  placeholder,
  isSearchable,
  onChange,
  styles,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  // * ref of the parts
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // * render data
  const selectedValues = useMemo(() => {
    if (Array.isArray(value)) {
      return value.map((item) => item.value);
    } else if (value) {
      return [value.value];
    } else {
      return [];
    }
  }, [value]);
  const renderOptions = useMemo(() => {
    setIsOpen(true);

    if (Array.isArray(value)) {
      const selectedValues = value.map((item) => item.value);
      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(search.toLowerCase()) &&
          !selectedValues.includes(option.value)
      );
    } else if (!Array.isArray(value) && value) {
      const selectedValue = value.value;
      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(search.toLowerCase()) &&
          selectedValue !== option.value
      );
    } else {
      return options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      );
    }
  }, [search, options, value]);

  // * event handlers
  const onOptionSelect = useCallback(
    (
      newItem: DefaultOptionType,
      currentValue: DefaultOptionType | DefaultOptionType[] | undefined
    ) => {
      onChange(
        Array.isArray(currentValue) ? [...currentValue, newItem] : [newItem]
      );
      setSearch("");
    },
    [onChange]
  );
  const onRemove = useCallback(
    (itemValueToRemove: string, currentValues: DefaultOptionType[]) => {
      onChange(
        currentValues.filter((item) => item.value !== itemValueToRemove)
      );
    },
    [onChange]
  );

  return (
    <div
      onClick={() => {
        if (!isOpen) {
          setIsOpen(true);
          // setTimeout(() => {
          //   if (menuRef.current) menuRef.current.focus();
          // }, 100);
        }
      }}
      className="custom-select-bunny container"
      style={styles}
    >
      <div className="valueContainer">
        {Array.isArray(value) && value.length > 0 ? (
          value.map((item, index) => (
            <OptionItem
              option={item}
              onRemove={(currentValue: string) => {
                onRemove(currentValue, value);
              }}
              key={`option-items-selected-${item.value}-${index}`}
            />
          ))
        ) : search && search !== "" ? null : (
          <span className="placeholder">Select...</span>
        )}
        <input
          ref={searchRef}
          value={search}
          onChange={(e) => {
            const newValue = e.target.value ?? "";
            setSearch(newValue);
          }}
          onBlur={() => {
            if (document.activeElement === menuRef.current) {
            } else {
              // setIsOpen((oldState) => false);
            }
          }}
          autoComplete="off"
          className="input"
        />
      </div>
      <DownArrowIcon width={20} height={20} style={{ color: "#000" }} />
      {isOpen && (
        <div className="menu">
          <div
            ref={menuRef}
            onBlur={() => {
              if (document.activeElement === searchRef.current) {
              } else {
                setIsOpen((oldState) => false);
              }
            }}
            className="menuList"
            tabIndex={0}
          >
            {renderOptions.map((option, index: number) => (
              <div
                onClick={() => {
                  onOptionSelect(option, value);
                  if (menuRef.current) menuRef.current.focus();
                }}
                className={`option ${
                  selectedValues.includes(option.value) ? "selected" : ""
                }`}
                key={`select-custom-option-item-${index}`}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;

const OptionItem = ({
  option,
  onRemove,
}: {
  option: DefaultOptionType;
  onRemove: (currentValue: string) => void;
}) => {
  return (
    <div className="singleValue">
      <span>{option.label}</span>
      <span
        onClick={(e) => {
          onRemove(option.value);
          e.stopPropagation();
        }}
        className="removeIcon"
      >
        <CloseIcon width={14} height={14} />
      </span>
    </div>
  );
};
