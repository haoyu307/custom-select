export interface DefaultOptionType {
  label: string;
  value: string;
}

export interface SelectProps {
  options: DefaultOptionType[];
  value: DefaultOptionType | DefaultOptionType[] | undefined;
  placeholder: string;
  isMulti?: boolean;
  isSearchable?: boolean;
  onChange: (
    newValue: DefaultOptionType | DefaultOptionType[] | undefined
  ) => void;
  styles?: React.CSSProperties;
}

export interface SelectPropsExtended extends SelectProps {
  isMulti?: boolean;
}
