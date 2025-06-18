import { Input as AntdInput } from "antd";

export const Input = (props: any) => {
  return <AntdInput {...props} />;
};

export const Password = (props: any) => {
  return <AntdInput.Password {...props} />;
};

export const Textarea = (props: any) => {
  return <AntdInput.TextArea {...props} />;
};
