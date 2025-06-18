import React from "react";
import { Input, Password, Textarea } from "./items/input";

type FormItem = {
  [key: string]: {
    name: string;
    component: (props: any) => React.ReactElement;
  };
};

export default {
  input: { name: "文本输入框", component: Input },
  password: { name: "密码输入框", component: Password },
  textarea: { name: "多行文本输入框", component: Textarea },
} as FormItem;
