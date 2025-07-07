"use client";
import type { TableProps, TableColumnProps, FormProps, FormInstance } from "antd";
import type { FormItem } from "../Form";

import { useQueryState, parseAsInteger } from "nuqs";
import React, { useEffect, useState, useRef } from "react";

import { RiArrowDownSLine, RiEditLine, RiDeleteBinLine, RiEyeLine } from "@remixicon/react";
import { Table, message, Space, Dropdown, Button, Form as antdForm } from "antd";

import Modal from "~/app/_components/Modal";
import Form from "~/app/_components/Form";

import { api } from "~/trpc/react";

import { getTableColumn, getTableActions } from "~/utils/tableList";

export type TableListField = {
  table?: boolean | TableColumnProps;
} & FormItem;

export type TableListFieldsForm = {
  fields: (TableListField[] | TableListField[])[];
} & FormProps;

export type Action =
  | {
      type: string;
      text: string;
      color?: string;
      icon?: React.ReactElement;
      handle?: (row: any) => void;
      [key: string]: any;
    }
  | string;

export type TableListConfig = {
  tableProps?: TableProps;
  fieldsForm: TableListFieldsForm;
  actions?: Action[] | ((row: any) => Action[]);
  tools?: any;
  module: string;
  modalWidth?: number;
};

export type TableListProps = {
  config: TableListConfig;
};

const asdasd: (TableListField | TableListField[])[] = [
  [
    { label: "用户名", type: "input", name: "user_name", required: true, table: true },
    { label: "用户名", type: "input", name: "user_name", required: true, table: true },
  ],
  { label: "用户名", type: "input", name: "user_name", required: true, table: true },
  { label: "昵称", type: "input", name: "nick_name", required: true, table: true },
  { label: "手机号", type: "input", name: "phone_number", required: true, table: true },
  { label: "邮箱", type: "input", name: "email", required: true, table: true },
];

const asd: TableListConfig = {
  module: "1",
  fieldsForm: {
    fields: [
      [
        { label: "用户名", type: "input", name: "user_name", required: true, table: true },
        { label: "用户名", type: "input", name: "user_name", required: true, table: true },
      ],
      { label: "用户名", type: "input", name: "user_name", required: true, table: true },
      { label: "昵称", type: "input", name: "nick_name", required: true, table: true },
      { label: "手机号", type: "input", name: "phone_number", required: true, table: true },
      { label: "邮箱", type: "input", name: "email", required: true, table: true },
    ],
  },
};

export default React.forwardRef(({ config }: Readonly<TableListProps>, ref) => {
  const { tableProps, module, actions, modalWidth } = config;

  const [messageApi, contextHolder] = message.useMessage();
  const [pageNum, setPageNum] = useQueryState("pageNum", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10));

  const modal = useRef<any>(null);

  const columns = getTableColumn(config.fieldsForm.fields);

  const apiUtils = api.useUtils();

  // -------------fetch list begin-------------
  const { status, data } = (api as any)[module].list.useQuery({ pageNum, pageSize });
  useEffect(() => {
    status === "error" && messageApi.error("出错了");
  }, [status]);
  // -------------fetch list end-------------

  // -------------modal begin-------------
  const [modalTitle, setModalTitle] = useState("");
  // -------------modal end-------------

  // -------------modal form begin-------------
  const { fields, ...formConfig } = config.fieldsForm;
  const modalFormItems = fields.map((it) => {
    const { table, required, ...other } = it;
    if (required) {
      other.rules && Array.isArray(other.rules)
        ? other.rules.push({
            required: true,
            message: `${it.label}不能为空`,
          })
        : (other.rules = [{ required: true, message: `${it.label}不能为空` }]);
    }
    return other;
  });
  // -------------modal form end-------------

  // -------------FormInstance-------------
  const form: FormInstance = formConfig.form ?? antdForm.useForm()[0];

  // -------------actions begin-------------
  const defaultActions = useRef({
    edit: {
      type: "edit",
      text: "编辑",
      color: "cyan",
      icon: <RiEditLine size={14} />,
      async handle(row: any) {
        setModalTitle("编辑");
        const { id } = row;
        modal.current.open();
        const data = await apiUtils.user.query.fetch({ id });
        setTimeout(() => {
          form.setFieldsValue(data);
        });
      },
    },
    view: {
      type: "view",
      text: "查看",
      color: "primary",
      icon: <RiEyeLine size={14} />,
      handle(row: any) {
        console.log(row);
      },
    },
    delete: {
      type: "delete",
      text: "删除",
      color: "red",
      icon: <RiDeleteBinLine size={14} />,
      handle(row: any) {
        console.log(row);
      },
    },
  }).current;
  if (actions) {
    columns.push({
      title: "操作",
      width: 250,
      align: "center" as any,
      fixed: "right" as any,
      render: (row) => {
        let _actions: Action[] = [];

        if (typeof actions === "function") {
          _actions = getTableActions(defaultActions, actions(row));
        } else {
          _actions = getTableActions(defaultActions, actions);
        }

        // getTableActions(defaultActions, configActions);
        if (_actions.length <= 3) {
          return (
            <Space>
              {(_actions as Array<any>).map((action: any) => {
                const { text, type, handle, ...other } = action;
                return (
                  <Button size="small" variant="solid" onClick={() => handle?.(row)} {...other}>
                    {text}
                  </Button>
                );
              })}
            </Space>
          );
        }
        return (
          <Space>
            {(_actions as Array<any>).slice(0, 2).map((action: any) => {
              const { text, type, handle, ...other } = action;
              return (
                <Button size="small" variant="solid" onClick={() => handle?.(row)} {...other}>
                  {action.text}
                </Button>
              );
            })}
            <Dropdown
              menu={{
                items: (_actions as Array<any>).slice(2).map((action: any, idx: any) => {
                  const { text, type, handle, ...other } = action;
                  return {
                    key: idx,
                    label: (
                      <Button size="small" variant="solid" onClick={() => handle?.(row)} {...other}>
                        {action.text}
                      </Button>
                    ),
                  };
                }),
              }}
            >
              <Button
                size="small"
                icon={<RiArrowDownSLine size={14} className="mt-[3px]" />}
                iconPosition="end"
                variant="dashed"
              >
                更多
              </Button>
            </Dropdown>
          </Space>
        );
      },
    });
  }
  // -------------actions end-------------

  /**
   * modal form submit handler
   */
  const handleSubmit = async () => {
    const data = await form.validateFields();
    console.log(data);
  };

  return (
    <>
      {contextHolder}
      <Table
        key="id"
        loading={status === "pending"}
        size="middle"
        dataSource={data?.rows}
        pagination={{
          defaultCurrent: pageNum,
          defaultPageSize: pageSize,
          size: "default",
          showQuickJumper: true,
          total: data?.total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
          onChange(page, pageSize) {
            setPageNum(page);
            setPageSize(pageSize);
          },
        }}
        {...tableProps}
        columns={columns}
      />
      <Modal width={modalWidth} title={modalTitle} ref={modal} onOk={handleSubmit}>
        <Form items={modalFormItems} config={{ ...formConfig, form }} />
      </Modal>
    </>
  );
});
