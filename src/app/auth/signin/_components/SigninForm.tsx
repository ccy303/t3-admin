"use client";

import { signIn } from "next-auth/react";

import { useRef } from "react";
import { Button } from "antd";

import Form from "~/app/_components/Form";

export default () => {
  const formRef = useRef<any>(null);
  const items = useRef([
    {
      type: "input",
      label: "",
      name: "username",
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

  const FormConfig = useRef({
    size: "large",
    initialValues: { username: "admin", password: "admin" },
  }).current;

  const singnin = async () => {
    const res = await formRef.current.form.validateFields();
    signIn("credentials", res);
  };

  return (
    <div className="w-[350px]">
      <Form ref={formRef} items={items} config={FormConfig} />
      <Button onClick={singnin}>登录</Button>
    </div>
  );
};
