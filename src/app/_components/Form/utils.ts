import { type FormItem } from "./index";
export const getFormItemProps = (config: FormItem) => {
  const { props, type, ...rest } = config;
  return { ...rest };
};
