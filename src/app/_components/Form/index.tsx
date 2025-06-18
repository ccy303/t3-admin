"use client";
import { Form, Button } from "antd";

import { getFormItemProps } from "./utils";

import FormItems from "./items";

export type FormItem = {
  type: string;
  [key: string]: any;
};

export type FormConfig = {};

export type FormPropsType = {
  items: FormItem[];
  config: FormConfig;
};

export default ({ items, config }: FormPropsType) => {
  const [form] = Form.useForm();

  const FormItem = Form.Item;

  return (
    <Form form={form} {...config} className="w-full">
      {items.map((item, idx) => {
        const Component = FormItems[item.type]?.component;

        return (
          <FormItem key={idx} {...getFormItemProps(item)}>
            {Component && <Component {...item.props} />}
          </FormItem>
        );
      })}
    </Form>
  );
};
