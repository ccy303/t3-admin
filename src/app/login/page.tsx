import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import Form from "~/app/_components/Form";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  const click = () => {
    console.log(111111);
  };

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <Form
          items={[
            {
              type: "input",
              label: "",
              name: "name",
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
            {
              type: "textarea",
              label: "",
              name: "textarea",
              required: true,
              props: { placeholder: "请输入密码" },
            },
          ]}
          config={{ size: "large" }}
        />
      </main>
    </HydrateClient>
  );
}
