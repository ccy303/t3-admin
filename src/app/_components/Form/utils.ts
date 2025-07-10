import { type FormItem } from "./index";
export const getFormItemProps = (config: FormItem, isReadOnly?: boolean) => {
  const { props, type, span, offset, ...rest } = config;

  if (isReadOnly) {
    const { required, rules, ...other } = rest;
    return { ...other };
  }

  return { ...rest };
};
