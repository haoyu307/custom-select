import { useCallback, useEffect, useRef, useState } from "react";
import { DefaultOptionType, SelectProps } from "./type";

import { ReactComponent as DownArrowIcon } from "./assets/arrowdown.svg";

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
      style={styles}
    >
      <input
        ref={searchRef}
        disabled={isSearchable ? false : true}
        onChange={(e) => {
          const newValue = (e.target.value ?? "").toLowerCase();
          setRenderOptions(
            options.filter((option) =>
              option.label.toLowerCase().includes(newValue)
            )
          );
          setIsOpen(true);
        }}
        placeholder={
          Array.isArray(value) ? value[0].label : value ? value.label : ""
        }
        autoComplete="off"
        className="input"
      />
      <DownArrowIcon width={20} height={20} style={{ color: "#000" }} />
      {isOpen && (
        <div className="menu">
          <div
            ref={menuRef}
            onBlur={() => {}}
            className="menuList"
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

export default SingleSelect;
