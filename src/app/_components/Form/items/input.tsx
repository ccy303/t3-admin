import { Input as AntdInput } from "antd";

export const Input = (props: any) => {
  const { readOnly, value } = props;
  return <>{readOnly ? <span>{value || "-"}</span> : <AntdInput {...props} />} </>;
};

export const Password = (props: any) => {
  const { readOnly, value } = props;
  return <>{readOnly ? <span>{value || "-"}</span> : <AntdInput.Password {...props} />} </>;
};

export const Textarea = (props: any) => {
  const { readOnly, value } = props;
  return <>{readOnly ? <span>{value || "-"}</span> : <AntdInput.TextArea {...props} />} </>;
};
