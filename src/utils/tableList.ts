import type { TableColumnProps } from "antd";
import type { TableListField, Action, Search } from "~/app/_components/TableList/index";
import type { FormItem } from "~/app/_components/Form";
import { z } from "zod";

export const getTableColumn = (items: Array<TableListField | TableListField[]>): TableColumnProps[] => {
  const flatData = items.flat(Infinity) as TableListField[];
  return flatData
    .filter((it) => it.table)
    .map((it) => {
      let output: TableColumnProps = { title: it.label, dataIndex: it.name };
      if (Object.prototype.toString.call(it.table) == "[object Object]") {
        output = { ...output, ...(it.table as TableColumnProps) };
      }
      if (!output.render) {
        output.render = (text, record) => {
          return text || "-";
        };
      }
      return output;
    });
};

export const getTableActions = (defaultActions: { [key: string]: Action }, configActions: Action[]): Action[] => {
  const output: Action[] = [];
  for (let i = 0, item; (item = configActions[i++]); ) {
    if (typeof item == "string" && ["edit", "view", "delete"].includes(item)) {
      output.push(defaultActions[item] as Action);
    } else {
      output.push(item);
    }
  }

  return output;
};

export const getTableFormItems = (items: Array<TableListField | TableListField[]>): Array<FormItem | FormItem[]> => {
  return items.map((it: TableListField | TableListField[]) => {
    if (Array.isArray(it)) {
      let res: FormItem[] = [];
      res = getTableFormItems(it) as FormItem[];
      return res;
    }
    const { table, search, ...rest } = it;
    return rest;
  });
};

export const getTableSearchForm = (items: Array<TableListField | TableListField[]>) => {
  const flatData = items.flat(Infinity) as TableListField[];

  const formItem = flatData
    .filter((it) => it.search)
    .map((it) => {
      const { table, search, labelCol, required, rules, ...rest } = it;

      if (Object.prototype.toString.call(search) == "[object Object]") {
        return { ...rest, span: 4, labelCol: { span: 6 }, ...(search as Search) };
      }
      // getValueFromEvent
      return { ...rest, span: 4, labelCol: { span: 6 } };
    });

  return formItem;
};

export const formatSearchQuery = () => {};
