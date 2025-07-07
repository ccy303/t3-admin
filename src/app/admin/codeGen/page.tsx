"use client";
import TableList from "~/app/_components/TableList";
import { Button } from "antd";
import { api } from "~/trpc/react";

export default function UserPage(props: any) {
    const columns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Age", dataIndex: "age", key: "age" },
        { title: "Address", dataIndex: "address", key: "address" },
    ];

    const reloadDBClient = api.code.reloadDBClient.useMutation();

    const asyncData = () => {};

    return (
        <div>
            <Button onClick={() => reloadDBClient.mutate()}>数据库结构同步</Button>
        </div>
    );
}
