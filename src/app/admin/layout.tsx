import Layout, { Header, Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Layout className="h-screen">
      <Header>Header</Header>
      <Layout>
        <Sider>Sider</Sider>
        <Content className="overflow-auto">{children}</Content>
      </Layout>
    </Layout>
  );
}
