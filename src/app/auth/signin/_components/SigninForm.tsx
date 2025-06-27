"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

import { useRef, useState } from "react";
import { Button, message } from "antd";

import Form from "~/app/_components/Form";

export default () => {
    const formRef = useRef<any>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);

    const items = useRef([
        { type: "input", label: "", name: "username", required: true, props: { placeholder: "请输入账号" } },
        { type: "password", label: "", name: "password", required: true, props: { placeholder: "请输入密码" } },
    ]).current;

    const FormConfig = useRef({
        size: "large",
        initialValues: { username: "admin", password: "admin" },
    }).current;

    const singnin = async () => {
        setLoading(true);
        const data = await formRef.current.form.validateFields();
        const res = await signIn("credentials", {
            ...data,
            redirect: false,
            redirectTo: searchParams.get("callbackUrl") || "/",
        });
        setLoading(false);
        if (res?.error) {
            return messageApi.error("用户名或密码错误");
        }

        router.replace(res?.url as string);
    };

    return (
        <div className="w-[350px]">
            {contextHolder}
            <Form ref={formRef} items={items} config={FormConfig} />
            <Button loading={loading} className="w-full" type="primary" size="large" onClick={singnin}>
                登录
            </Button>
        </div>
    );
};
