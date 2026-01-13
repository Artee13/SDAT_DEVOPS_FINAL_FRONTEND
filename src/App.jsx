import { Layout, Typography, Tag, Space } from "antd";
import { useEffect, useState } from "react";
import client from "./api/client";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function App() {
  const [backendStatus, setBackendStatus] = useState("loading");

  useEffect(() => {
    client
      .get("/api/health")
      .then((res) => {
        setBackendStatus(res.data === "OK" ? "ok" : "unknown");
      })
      .catch(() => {
        setBackendStatus("error");
      });
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <Title level={3} style={{ color: "white", margin: 0 }}>
          Airport Arrivals & Departures
        </Title>
      </Header>

      <Content style={{ padding: 24 }}>
        <Title level={4}>Frontend is running ✅</Title>

        <Space>
          <Text>Backend status:</Text>
          {backendStatus === "loading" && <Tag color="blue">Loading...</Tag>}
          {backendStatus === "ok" && <Tag color="green">OK</Tag>}
          {backendStatus === "unknown" && <Tag color="orange">Unexpected</Tag>}
          {backendStatus === "error" && <Tag color="red">ERROR</Tag>}
        </Space>
      </Content>
    </Layout>
  );
}
