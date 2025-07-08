"use client";
import { Form, Row, Col } from "antd";
import type { FormProps as AntdFormProps, FormItemProps } from "antd";
import { getFormItemProps } from "./utils";
import FormItems from "./items";
import React from "react";

export type FormItem = {
  type: string;
  props?: any; // 输入组件props
} & FormItemProps;

export type FormProps = {
  readOnly?: boolean;
} & AntdFormProps;

export type FormPropsType = {
  items: Array<FormItem | FormItem[]>;
  config: FormProps;
};

export default React.forwardRef(({ items, config }: FormPropsType, ref) => {
  const FormItem = Form.Item;

  const { readOnly, ...formConfig } = config;

  const formItemRender = (list: Array<FormItem | FormItem[]>, isCol = false): any => {
    return list.map((item: FormItem | FormItem[], idx) => {
      if (Array.isArray(item)) {
        return <Row>{formItemRender(item, true)}</Row>;
      }

      const Component = FormItems[item.type]?.component;

      const Item = (
        <FormItem key={idx} {...getFormItemProps(item, readOnly)}>
          {Component && (
            <Component
              placeholder={`请输入${item.label}`}
              allowClear
              readOnly={readOnly}
              {...item.props}
            />
          )}
        </FormItem>
      );

      if (isCol) {
        return <Col span={Math.floor(24 / list.length)}>{Item}</Col>;
      }

      return Item;
    });
  };

  return (
    <Form {...formConfig} preserve={false} className="w-full">
      {formItemRender(items)}
    </Form>
  );
});
