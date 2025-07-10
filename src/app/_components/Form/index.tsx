"use client";
import { Form, Row, Col } from "antd";
import type { FormProps as AntdFormProps, FormItemProps } from "antd";
import { getFormItemProps } from "./utils";
import FormItems from "./items";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export type FormItem = {
  type: string;
  props?: any; // 输入组件props
  span?: number;
  offset?: number;
  render?: () => React.ReactNode;
} & FormItemProps;

export type FormProps = {
  readOnly?: boolean;
} & AntdFormProps;

export type FormPropsType = {
  items: Array<FormItem | FormItem[]>;
  config: FormProps;
  children?: React.ReactNode;
};

export default React.forwardRef(({ items, config, children }: FormPropsType, ref: any) => {
  const FormItem = Form.Item;

  const { readOnly, ...formConfig } = config;

  const formItemRender = (list: Array<FormItem | FormItem[]>, isCol = false): any => {
    return list.map((item: FormItem | FormItem[], idx) => {
      if (Array.isArray(item)) {
        return (
          <Row className="w-full" gutter={[10, 10]} key={`row-${uuidv4()}`}>
            {formItemRender(item, true)}
          </Row>
        );
      }

      let Item;
      if (item.type === "render") {
        Item = item.render?.();
      } else {
        const Component = FormItems[item.type]?.component;
        Item = (
          <FormItem key={idx} {...getFormItemProps(item, readOnly)}>
            {Component && (
              <Component placeholder={`请输入${item.label}`} allowClear readOnly={readOnly} {...item.props} />
            )}
          </FormItem>
        );
      }

      if (isCol) {
        return (
          <Col key={`row-${uuidv4()}`} offset={item.offset ?? 0} span={item.span ?? Math.floor(24 / list.length)}>
            {Item}
          </Col>
        );
      }

      return Item;
    });
  };

  return (
    <Form {...formConfig} preserve={false} className={`w-full ${formConfig.className}`} ref={ref}>
      {formItemRender(items)}
      {children}
    </Form>
  );
});
