"use client";
import TableList, { type TableListConfig } from "~/app/_components/TableList";
import { api } from "~/trpc/react";

export default function UserTable(props: any) {
  const config: TableListConfig = {
    tableProps: { size: "middle" },
    module: "user",
    modalWidth: 1000,
    formFields: {
      labelCol: { span: 3 },
      items: [
        [
          {
            label: "用户名",
            type: "input",
            name: "user_name",
            required: true,
            labelCol: { span: 6 },
            table: true,
            search: { operator: "equals" },
          },
          {
            label: "昵称",
            type: "input",
            name: "nick_name",
            required: true,
            labelCol: { span: 6 },
            table: true,
            search: true,
          },
        ],
        { label: "手机号", type: "input", name: "phone_number", required: true, table: true, search: { span: 10 } },
        { label: "邮箱", type: "input", name: "email1", required: true, table: true, search: true },
      ],
    },
    // actions: [
    //   "edit",
    //   "view",
    //   "delete",
    //   {
    //     type: "other",
    //     text: "其他按钮",
    //   },
    // ],
    actions: (row) => {
      return [
        "edit",
        "view",
        "delete",
        {
          type: "other",
          text: "其他按钮",
        },
      ];
    },
    tools: () => {
      return ["add", "delete", "export"];
    },
  };

  return (
    <div>
      <TableList config={config} />
    </div>
  );
}
