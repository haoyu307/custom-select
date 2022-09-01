import { useMemo, useState } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import SingleSelect from "./SingleSelect";
import { DefaultOptionType } from "./type";

it("should display the correct number of options", () => {
  render(<SingleSelectTest />);

  expect(screen.getAllByRole("option").length).toBe(mockupData.length);
});

it("should allow user to change option", () => {
  render(<SingleSelectTest />);

  userEvent.click(screen.getByRole("combobox"));
  userEvent.click(
    screen.getByRole("option", {
      name: "test",
    })
  );
  const testElement = screen.getByRole("option", {
    name: "test",
  });
  expect(testElement.classList).toContain("selected");
});

/**
 * * test render element
 * @returns
 */
const SingleSelectTest = () => {
  const [singleSelected, setSingleSelected] = useState<number>();
  const onSingleChange = (
    newValue: DefaultOptionType | DefaultOptionType[] | undefined
  ) => {
    if (newValue !== undefined && !Array.isArray(newValue)) {
      setSingleSelected(parseInt(newValue.value));
    } else {
      setSingleSelected(undefined);
    }
  };
  const singleValue = useMemo(() => {
    if (singleSelected !== undefined) {
      const filtered = mockupData.filter(
        (option) => singleSelected === parseInt(option.value)
      );
      return filtered.length > 0 ? filtered[0] : undefined;
    } else {
      return undefined;
    }
  }, [singleSelected]);

  return (
    <SingleSelect
      options={mockupData}
      value={singleValue}
      placeholder="placeholder"
      isSearchable={false}
      onChange={onSingleChange}
    />
  );
};

const mockupData = [
  { name: "random", value: "0" },
  { name: "test", value: "1" },
  { name: "checking", value: "2" },
];
