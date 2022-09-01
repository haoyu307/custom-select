import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
          option.name.toLowerCase().includes(search.toLowerCase()) &&
          !selectedValues.includes(option.value)
      );
    } else if (!Array.isArray(value) && value) {
      const selectedValue = value.value;
      return options.filter(
        (option) =>
          option.name.toLowerCase().includes(search.toLowerCase()) &&
          selectedValue !== option.value
      );
    } else {
      return options.filter((option) =>
        option.name.toLowerCase().includes(search.toLowerCase())
      );
    }
  }, [search, options, value]);

  // * menu close when blurred
  // * focusing to the menu when input & menu both have no focus
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (
          document.activeElement !== menuRef.current &&
          document.activeElement !== searchRef.current
        ) {
          menuRef.current?.focus();
        }
      }, 50);
    }
  }, [isOpen]);

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
        setIsOpen((oldValue) => !oldValue);
      }}
      className="custom-select-bunny container"
      style={styles?.container}
      role="combobox"
    >
      <div className="value-container" style={styles?.valueContainer}>
        {Array.isArray(value) && value.length > 0 ? (
          value.map((item, index) => (
            <OptionItem
              option={item}
              onRemove={(currentValue: string) => {
                onRemove(currentValue, value);
              }}
              styles={styles?.singleValue}
              key={`option-items-selected-${item.value}-${index}`}
            />
          ))
        ) : search && search !== "" ? null : (
          <span className="placeholder">{placeholder}</span>
        )}
        <input
          ref={searchRef}
          disabled={isSearchable ? false : true}
          value={search}
          onChange={(e) => {
            const newValue = e.target.value ?? "";
            setSearch(newValue);
          }}
          onBlur={() => {
            setTimeout(() => {
              if (document.activeElement !== menuRef.current) {
                setIsOpen(false);
              }
            }, 200);
          }}
          autoComplete="off"
          className="input"
          style={styles?.input}
        />
      </div>
      <div className="addon-btns">
        {value && Array.isArray(value) && value.length > 0 ? (
          <CloseIcon
            onClick={() => {
              onChange(undefined);
            }}
            width={14}
            height={14}
            style={{ color: "#000" }}
          />
        ) : null}
        <DownArrowIcon width={20} height={20} style={{ color: "#000" }} />
      </div>
      <div className={`menu ${isOpen ? "" : "hidden"}`} style={styles?.menu}>
        <div
          ref={menuRef}
          onBlur={() => {
            setTimeout(() => {
              if (document.activeElement !== searchRef.current) {
                setIsOpen(false);
              }
            }, 200);
          }}
          className="menu-list"
          style={styles?.menuList}
          tabIndex={0}
        >
          {options.map((option, index: number) => (
            <div
              onClick={() => {
                onOptionSelect(option, value);
                if (menuRef.current) menuRef.current.focus();
              }}
              className={`option ${
                selectedValues.includes(option.value) ? "selected hidden" : ""
              }`}
              style={styles?.option}
              role="option"
              aria-selected={selectedValues.includes(option.value)}
              key={`select-custom-option-item-${index}`}
            >
              {option.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;

const OptionItem = ({
  option,
  onRemove,
  styles,
}: {
  option: DefaultOptionType;
  onRemove: (currentValue: string) => void;
  styles?: React.CSSProperties;
}) => {
  return (
    <div className="single-value" style={styles}>
      <span>{option.name}</span>
      <span
        onClick={(e) => {
          onRemove(option.value);
          e.stopPropagation();
        }}
        className="remove-icon"
      >
        <CloseIcon width={14} height={14} />
      </span>
    </div>
  );
};
