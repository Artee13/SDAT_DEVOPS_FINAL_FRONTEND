import { Layout, Typography, Tag, Space, Select, Tabs, Table } from "antd";
import { useEffect, useState } from "react";
import client from "./api/client";
import { fetchAirports } from "./api/airports";
import { fetchFlights } from "./api/flights";
import dayjs from "dayjs";


const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function App() {
  const [backendStatus, setBackendStatus] = useState("loading");
  const [airports, setAirports] = useState([]);
  const [selectedAirportId, setSelectedAirportId] = useState(null);
  const [activeTab, setActiveTab] = useState("ARRIVAL");
  const [flights, setFlights] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(false);


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

  useEffect(() => {
    fetchAirports()
      .then((data) => {
        setAirports(data);
        if (data.length > 0) setSelectedAirportId(data[0].id);
      })
      .catch(() => {
        setAirports([]);
      });
  }, []);

  useEffect(() => {
    if (!selectedAirportId) return;

    setLoadingFlights(true);
    fetchFlights(selectedAirportId, activeTab)
      .then((data) => setFlights(data))
      .catch(() => setFlights([]))
      .finally(() => setLoadingFlights(false));
  }, [selectedAirportId, activeTab]);

  const columns = [
    { title: "Flight", dataIndex: "flightNumber", key: "flightNumber" },
    { title: "Airline", dataIndex: "airlineName", key: "airlineName" },
    { title: "From", dataIndex: "origin", key: "origin" },
    { title: "To", dataIndex: "destination", key: "destination" },
    { title: "Gate", dataIndex: "gateName", key: "gateName" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Time",
      dataIndex: "scheduledTime",
      key: "scheduledTime",
      render: (value) => (value ? dayjs(value).format("HH:mm") : "-"),
    },

  ];


  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <Title level={3} style={{ color: "white", margin: 0 }}>
          Airport Arrivals & Departures
        </Title>
      </Header>

      <Content style={{ padding: 24 }}>
        <Title level={4}>Frontend</Title>

        <Space>
          <Text>Backend status:</Text>
          {backendStatus === "loading" && <Tag color="blue">Loading...</Tag>}
          {backendStatus === "ok" && <Tag color="green">OK</Tag>}
          {backendStatus === "unknown" && <Tag color="orange">Unexpected</Tag>}
          {backendStatus === "error" && <Tag color="red">ERROR</Tag>}
        </Space>
        <div style={{ marginTop: 16, maxWidth: 320 }}>.
          <div style={{ marginBottom: 8 }}>Select airport:</div>
          <Select
            style={{ width: "100%" }}
            value={selectedAirportId}
            onChange={setSelectedAirportId}
            options={airports.map((a) => ({
              label: `${a.code} - ${a.city}`,
              value: a.id,
            }))}
          />
        </div>
        <div style={{ marginTop: 24 }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: "ARRIVAL", label: "Arrivals" },
              { key: "DEPARTURE", label: "Departures" },
            ]}
          />

          <Table
            rowKey="id"
            columns={columns}
            dataSource={flights}
            loading={loadingFlights}
            pagination={false}
          />
        </div>


      </Content>
    </Layout>
  );
}
