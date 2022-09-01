import { useMemo, useState } from "react";

import SelectCustom from "./select";

import "./App.css";
import { DefaultOptionType } from "./select/type";

function App() {
  const [selected, setSelected] = useState<number[]>([]);
  const [singleSelected, setSingleSelected] = useState<number>();

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
    <div className="App">
      <div style={{ display: "flex", flexDirection: "row" }}>
        <SelectCustom
          options={mockupData}
          value={singleValue}
          placeholder="Please select"
          isMulti={false}
          onChange={onSingleChange}
          styles={{
            container: {
              marginLeft: "5px",
              marginRight: "5px",
            },
          }}
        />
        <SelectCustom
          options={mockupData}
          value={selected.map((id) => mockupData[id])}
          placeholder="please select"
          isMulti={true}
          isSearchable={false}
          onChange={onMultiChange}
        />
      </div>
    </div>
  );
}

export default App;

const mockupData = [
  { name: "telegram", value: "0" },
  { name: "test", value: "1" },
  { name: "seeeeeeki", value: "2" },
];
