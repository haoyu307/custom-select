import MultiSelect from "./MultiSelect";
import SingleSelect from "./SingleSelect";
import { SelectPropsExtended } from "./type";

import "./Styles.css";

const SelectCustom = (props: SelectPropsExtended) =>
  props.isMulti ? <MultiSelect {...props} /> : <SingleSelect {...props} />;

export default SelectCustom;
