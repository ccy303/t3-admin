import TableList from "~/app/_components/TableList";
import { Button } from "antd";
import { api } from "~/trpc/react";
// import { useState } from "react";

export default function UserPage(props: any) {
    // const session = await auth();

    // const [pageNum, setPageNum] = useState(1);

    // console.log(111111111111, api.user.getUsers);
    console.log(111111111111, api.user);

    // console.log("session", session);

    return (
        <div>
            123
            {/* <Button onClick={() => setPageNum(pageNum + 1)}>点击</Button> */}
        </div>
    );
}
