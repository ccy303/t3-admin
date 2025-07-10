"use client";
import "@ant-design/v5-patch-for-react-19";
import type { TableProps, TableColumnProps, FormProps, FormInstance, FormItemProps } from "antd";
import type { FormItem } from "../Form";

import { useQueryState, parseAsInteger, parseAsJson } from "nuqs";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";

import { RiArrowDownSLine, RiEditLine, RiDeleteBinLine, RiEyeLine } from "@remixicon/react";
import { Table, message, Space, Dropdown, Button, Form as antdForm } from "antd";

import Modal, { confirm } from "~/app/_components/Modal";
import Form from "~/app/_components/Form";
import SearchForm from "./SearchForm";

import { api } from "~/trpc/react";

import { getTableColumn, getTableActions, getTableFormItems, getTableSearchForm } from "~/utils/tableList";

import { z } from "zod";

export type Search = {
  span?: number;
  type?: string;
  props?: any; // 输入组件props
  operator?: "equals" | "like";
} & FormItemProps;

export type TableListField = {
  table?: boolean | TableColumnProps;
  search?: boolean | Search;
} & FormItem;

export type TableListformFields = {
  items: Array<TableListField | TableListField[]>;
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
  formFields: TableListformFields;
  actions?: Action[] | ((row: any) => Action[]);
  tools?: any;
  module: string;
  modalWidth?: number;
};

export type TableListProps = {
  config: TableListConfig;
};

export default React.forwardRef(({ config }: Readonly<TableListProps>, ref) => {
  const { tableProps, module, actions, modalWidth } = config;
  const [messageApi, contextHolder] = message.useMessage();
  const [pageNum, setPageNum] = useQueryState("pageNum", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10));
  const [query, setQuery] = useQueryState("query", parseAsJson(z.record(z.unknown()).parse));

  const [data, setData] = useState<any>({});
  const [targetAction, setTargetAction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const modal = useRef<any>(null);

  const columns = getTableColumn(config.formFields.items);

  const apiUtils = api.useUtils();

  // -------------fetch list begin-------------
  const getData = (query: any) => {
    setLoading(true);
    (apiUtils as any)[module].list
      .fetch(query)
      .then((res: any) => {
        setData(res);
      })
      .catch((err: any) => {
        messageApi.error("出错了");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getData({ pageNum, pageSize, ...query });
  }, []);
  // -------------fetch list end-------------

  // -------------modal form begin-------------
  const { items, ...formConfig } = config.formFields;
  const modalFormItems = getTableFormItems(items);
  const form: FormInstance = formConfig.form ?? antdForm.useForm()[0];
  // -------------modal form end-------------

  // -------------search form begin-------------
  const searchFormItems = useMemo(() => getTableSearchForm(config.formFields.items), [config.formFields.items]);
  // -------------search form end-------------

  // -------------actions begin-------------
  const defaultActions = useRef({
    edit: {
      type: "edit",
      text: "编辑",
      color: "cyan",
      icon: <RiEditLine size={14} />,
      async handle(row: any) {
        setModalTitle("编辑");
        setTargetAction("edit");
        const { id } = row;
        const data = await (apiUtils as any)[module].query.fetch({ id });
        modal.current.open(() => {
          setTimeout(() => {
            form.setFieldsValue(data);
          });
        });
      },
    },
    view: {
      type: "view",
      text: "查看",
      color: "primary",
      icon: <RiEyeLine size={14} />,
      async handle(row: any) {
        setModalTitle("查看");
        setTargetAction("view");
        const { id } = row;
        const data = await (apiUtils as any)?.[module]?.query.fetch({ id });
        modal.current.open(() => {
          setTimeout(() => {
            form.setFieldsValue(data);
          });
        });
      },
    },
    delete: {
      type: "delete",
      text: "删除",
      color: "red",
      icon: <RiDeleteBinLine size={14} />,
      handle(row: any) {
        console.log(row);
        console.log(confirm);
        confirm({
          title: "确认删除?",
          onOk: async () => {
            messageApi.success("删除成功");
          },
        });
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

        _actions = getTableActions(defaultActions, typeof actions === "function" ? actions(row) : actions);

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
    if (targetAction == "view") return;
    const data = await form.validateFields();
    console.log(data);
  };

  const handleSearch = useCallback((query: any) => {
    setPageNum(1);
    setQuery(query);
    getData({ pageNum: 1, pageSize, ...query });
  }, []);

  const handleReset = useCallback(() => {
    setPageNum(1);
    setQuery(null);
    getData({ pageNum: 1, pageSize });
  }, []);

  return (
    <>
      {contextHolder}
      <SearchForm items={searchFormItems as Search[]} onSearch={handleSearch} onReset={handleReset} />
      <Table
        rowKey="id"
        loading={loading}
        size="middle"
        dataSource={data?.rows}
        pagination={{
          current: pageNum,
          pageSize: pageSize,
          size: "default",
          showQuickJumper: true,
          total: data?.total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
          onChange(pageNum, pageSize) {
            setPageNum(pageNum);
            setPageSize(pageSize);
            getData({ pageNum, pageSize, ...(query || {}) });
          },
        }}
        {...tableProps}
        columns={columns}
        scroll={{ x: "max-content" }}
      />
      <Modal width={modalWidth} title={modalTitle} ref={modal} onOk={handleSubmit}>
        <Form items={modalFormItems} config={{ readOnly: targetAction == "view", ...formConfig, form }} />
      </Modal>
    </>
  );
});
