"use client";
import { Form } from "antd";
import type { FormProps, FormItemProps } from "antd";
import { getFormItemProps } from "./utils";
import FormItems from "./items";
import React from "react";

export type FormItem = {
  type: string;
  props?: any; // 输入组件props
} & FormItemProps;

export type FormPropsType = {
  items: FormItem[] | FormItem[][];
  config: FormProps;
};

export default React.forwardRef(({ items, config }: FormPropsType, ref) => {
  const FormItem = Form.Item;

  return (
    <Form {...config} preserve={false} className="w-full">
      {items.map((item, idx) => {
        if (Array.isArray(item)) {
          return <></>;
        }

        const Component = FormItems[item.type]?.component;
        return (
          <FormItem key={idx} {...getFormItemProps(item)}>
            {Component && (
              <Component placeholder={`请输入${item.label}`} allowClear {...item.props} />
            )}
          </FormItem>
        );
      })}
    </Form>
  );
});
