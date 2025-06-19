"use client";
import { Form } from "antd";
import { getFormItemProps } from "./utils";
import FormItems from "./items";
import React from "react";

export type FormItem = {
  type: string;
  [key: string]: any;
};

export type FormConfig = {};

export type FormPropsType = {
  items: FormItem[];
  config: FormConfig;
};

export default React.forwardRef(({ items, config }: FormPropsType, ref) => {
  const [form] = Form.useForm();

  const FormItem = Form.Item;

  React.useImperativeHandle(ref, () => ({
    form,
  }));

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
});
