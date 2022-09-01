export interface DefaultOptionType {
  name: string;
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
  styles?: {
    container?: React.CSSProperties;
    valueContainer?: React.CSSProperties;
    menu?: React.CSSProperties;
    menuList?: React.CSSProperties;
    option?: React.CSSProperties;
    singleValue?: React.CSSProperties;
    input?: React.CSSProperties;
  };
}

export interface SelectPropsExtended extends SelectProps {
  isMulti?: boolean;
}
