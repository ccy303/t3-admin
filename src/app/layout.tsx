import "~/styles/globals.css";

import { type Metadata } from "next";

import { Geist } from "next/font/google";
import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import "@ant-design/v5-patch-for-react-19";
import zhCN from "antd/locale/zh_CN";
// import "dayjs/locale/zh-cn";

import { ConfigProvider } from "antd";

export const metadata: Metadata = {
    title: env.NEXT_PUBLIC_SYSTEM_TITLE,
    description: "",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={`${geist.variable}`}>
            <body>
                <TRPCReactProvider>
                    <NuqsAdapter>
                        <AntdRegistry>
                            <ConfigProvider componentSize="middle" locale={zhCN}>
                                {children}
                            </ConfigProvider>
                        </AntdRegistry>
                    </NuqsAdapter>
                </TRPCReactProvider>
            </body>
        </html>
    );
}
