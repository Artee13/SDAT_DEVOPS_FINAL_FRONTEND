import { useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    Modal,
    Select,
    Table,
    Typography,
    message,
    Popconfirm,
} from "antd";

import { fetchFlights, createFlight, deleteFlight } from "../api/flights";
import { fetchAirports } from "../api/airports";
import { fetchAirlines } from "../api/airlines";
import { fetchGates } from "../api/gates";

const { Title } = Typography;

export default function AdminFlights() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);

    const [airports, setAirports] = useState([]);
    const [airlines, setAirlines] = useState([]);
    const [gates, setGates] = useState([]);

    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form] = Form.useForm();

    async function loadFlights() {
        setLoading(true);
        try {
            const data = await fetchFlights(null, null); // all flights
            setFlights(data);
        } catch {
            setFlights([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadFlights();
    }, []);

    // load dropdown data once
    useEffect(() => {
        fetchAirports().then(setAirports).catch(() => setAirports([]));
        fetchAirlines().then(setAirlines).catch(() => setAirlines([]));
        fetchGates().then(setGates).catch(() => setGates([]));
    }, []);

    const columns = [
        { title: "ID", dataIndex: "id", key: "id", width: 70 },
        { title: "Flight", dataIndex: "flightNumber", key: "flightNumber" },
        { title: "Type", dataIndex: "type", key: "type" },
        { title: "Status", dataIndex: "status", key: "status" },
        { title: "Airport", dataIndex: "airportCode", key: "airportCode" },
        { title: "Airline", dataIndex: "airlineName", key: "airlineName" },
        { title: "Gate", dataIndex: "gateName", key: "gateName" },
        { title: "Time", dataIndex: "scheduledTime", key: "scheduledTime" },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Popconfirm
                    title="Delete this flight?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => onDelete(record.id)}
                >
                    <Button danger size="small">Delete</Button>
                </Popconfirm>
            ),
        },

    ];

    async function onCreate(values) {
        setSaving(true);
        try {
            // backend expects ISO format like "2026-01-11T18:30"
            const payload = {
                flightNumber: values.flightNumber,
                type: values.type,
                status: values.status,
                scheduledTime: values.scheduledTime,
                estimatedTime: values.estimatedTime || null,
                origin: values.origin,
                destination: values.destination,
                airportId: values.airportId,
                airlineId: values.airlineId,
                gateId: values.gateId,
            };

            await createFlight(payload);
            message.success("Flight created");
            setOpen(false);
            form.resetFields();
            await loadFlights();
        } catch (err) {
            message.error("Failed to create flight");
        } finally {
            setSaving(false);
        }
    }

    async function onDelete(id) {
        try {
            await deleteFlight(id);
            message.success("Flight deleted");
            await loadFlights();
        } catch {
            message.error("Failed to delete flight");
        }
    }


    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Title level={3} style={{ margin: 0 }}>Admin — Flights</Title>
                <Button type="primary" onClick={() => setOpen(true)}>
                    New Flight
                </Button>
            </div>

            <div style={{ marginTop: 16 }}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={flights}
                    loading={loading}
                    pagination={false}
                />
            </div>

            <Modal
                title="Create Flight"
                open={open}
                onCancel={() => setOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={saving}
                okText="Create"
            >
                <Form form={form} layout="vertical" onFinish={onCreate}>
                    <Form.Item name="flightNumber" label="Flight Number" rules={[{ required: true }]}>
                        <Input placeholder="AC101" />
                    </Form.Item>

                    <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { value: "ARRIVAL", label: "ARRIVAL" },
                                { value: "DEPARTURE", label: "DEPARTURE" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { value: "ON_TIME", label: "ON_TIME" },
                                { value: "DELAYED", label: "DELAYED" },
                                { value: "BOARDING", label: "BOARDING" },
                                { value: "CANCELLED", label: "CANCELLED" },
                                { value: "LANDED", label: "LANDED" },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        name="scheduledTime"
                        label="Scheduled Time (ISO)"
                        rules={[{ required: true }]}
                    >
                        <Input placeholder="2026-01-11T18:30" />
                    </Form.Item>

                    <Form.Item name="estimatedTime" label="Estimated Time (ISO, optional)">
                        <Input placeholder="2026-01-11T19:00" />
                    </Form.Item>

                    <Form.Item name="origin" label="Origin" rules={[{ required: true }]}>
                        <Input placeholder="Toronto" />
                    </Form.Item>

                    <Form.Item name="destination" label="Destination" rules={[{ required: true }]}>
                        <Input placeholder="St. John's" />
                    </Form.Item>

                    <Form.Item name="airportId" label="Airport" rules={[{ required: true }]}>
                        <Select
                            options={airports.map((a) => ({
                                value: a.id,
                                label: `${a.code} - ${a.city}`,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item name="airlineId" label="Airline" rules={[{ required: true }]}>
                        <Select
                            options={airlines.map((a) => ({
                                value: a.id,
                                label: `${a.code} - ${a.name}`,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item name="gateId" label="Gate" rules={[{ required: true }]}>
                        <Select
                            options={gates.map((g) => ({
                                value: g.id,
                                label: `${g.name} (${g.terminal || "-"})`,
                            }))}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
