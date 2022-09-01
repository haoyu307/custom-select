import { useCallback, useEffect, useRef, useState } from "react";

import { ReactComponent as DownArrowIcon } from "./assets/arrowdown.svg";
import { ReactComponent as CloseIcon } from "./assets/close.svg";

import { DefaultOptionType, SelectProps } from "./type";

const SingleSelect = ({
  options,
  value,
  placeholder,
  isSearchable,
  onChange,
  styles,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [renderOptions, setRenderOptions] = useState<DefaultOptionType[]>([]);

  // * ref of the elements
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // * initialize
  useEffect(() => {
    setRenderOptions(options);
  }, [options]);

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
    (newItem: DefaultOptionType) => {
      if (searchRef.current) {
        searchRef.current.value = "";
      }
      setRenderOptions(options);
      onChange(newItem);
    },
    [onChange, options]
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
      <input
        ref={searchRef}
        disabled={isSearchable ? false : true}
        onChange={(e) => {
          const newValue = (e.target.value ?? "").toLowerCase();
          setRenderOptions(
            options.filter((option) =>
              option.name.toLowerCase().includes(newValue)
            )
          );
          setIsOpen(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            if (document.activeElement !== menuRef.current) {
              setIsOpen((oldState) => false);
            }
          }, 200);
        }}
        placeholder={
          Array.isArray(value)
            ? value[0].name
            : value
            ? value.name
            : placeholder
        }
        autoComplete="off"
        className={`input ${value ? "" : "placeholder"}`}
        style={styles?.input}
      />
      <div className="addon-btns">
        {value ? (
          <CloseIcon
            onClick={(e) => {
              onChange(undefined);
              e.stopPropagation();
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
          {renderOptions.map((option, index: number) => (
            <div
              onClick={() => {
                onOptionSelect(option);
                if (menuRef.current) menuRef.current.focus();
              }}
              className={`option ${
                (Array.isArray(value) ? value[0] : value)?.value ===
                option.value
                  ? "selected"
                  : ""
              }`}
              style={styles?.option}
              role="option"
              aria-selected={
                (Array.isArray(value) ? value[0] : value)?.value ===
                option.value
              }
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

export default SingleSelect;
