import type { TableColumnProps } from "antd";
import type { TableListFields, Action } from "~/app/_components/TableList/index";
export const getTableColumn = (fields: TableListFields[]): TableColumnProps[] => {
  return fields
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

export const getTableActions = (
  defaultActions: { [key: string]: Action },
  configActions: Action[],
): Action[] => {
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
