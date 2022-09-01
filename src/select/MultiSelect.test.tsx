import { useState } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import MultiSelect from "./MultiSelect";

import { DefaultOptionType } from "./type";

it("should display the correct number of options", () => {
  render(<MultiSelectTest />);

  expect(screen.getAllByRole("option").length).toBe(mockupData.length);
});

it("should allow user to select multiple options", () => {
  render(<MultiSelectTest />);

  userEvent.click(screen.getByRole("combobox"));
  userEvent.click(
    screen.getByRole("option", {
      name: "judo",
    })
  );
  userEvent.click(
    screen.getByRole("option", {
      name: "test",
    })
  );
  const testElement1 = screen.getByRole("option", {
    name: "judo",
  });
  const testElement2 = screen.getByRole("option", {
    name: "test",
  });

  expect(testElement1.classList).toContain("selected");
  expect(testElement2.classList).toContain("selected");
});

/**
 * * test render element
 * @returns
 */
const MultiSelectTest = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const onMultiChange = (
    newValue: DefaultOptionType | DefaultOptionType[] | undefined
  ) => {
    if (Array.isArray(newValue)) {
      setSelected(
        newValue.map((item: DefaultOptionType) => parseInt(item.value))
      );
    } else if (newValue) {
      setSelected([parseInt(newValue.value)]);
    } else {
      setSelected([]);
    }
  };

  return (
    <MultiSelect
      options={mockupData}
      value={selected.map((id) => mockupData[id])}
      placeholder="please select"
      isSearchable={false}
      onChange={onMultiChange}
    />
  );
};

const mockupData = [
  { name: "telegram", value: "0" },
  { name: "test", value: "1" },
  { name: "aeeeeeekido", value: "2" },
  { name: "judo", value: "3" },
];
