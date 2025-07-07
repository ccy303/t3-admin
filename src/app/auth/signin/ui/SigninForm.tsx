"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

import { useRef, useState } from "react";
import { Button, message, Form as amtdForm } from "antd";

import type { FormProps } from "antd";
import type { FormItem } from "~/app/_components/Form";

import Form from "~/app/_components/Form";

export default () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const items = useRef<FormItem[]>([
    {
      type: "input",
      label: "",
      name: "user_name",
      required: true,
      props: { placeholder: "请输入账号" },
    },
    {
      type: "password",
      label: "",
      name: "password",
      required: true,
      props: { placeholder: "请输入密码" },
    },
  ]).current;

  const [form] = amtdForm.useForm();
  const FormConfig = useRef<FormProps>({
    form: form,
    size: "large",
    initialValues: { user_name: "admin", password: "admin" },
  }).current;

  const singnin = async () => {
    setLoading(true);
    const data = await form.validateFields();
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
      <Form items={items} config={FormConfig} />
      <Button loading={loading} className="w-full" type="primary" size="large" onClick={singnin}>
        登录
      </Button>
    </div>
  );
};
