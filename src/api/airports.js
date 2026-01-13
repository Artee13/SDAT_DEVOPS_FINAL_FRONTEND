import client from "./client";

export async function fetchAirports() {
  const res = await client.get("/api/airports");
  return res.data;
}
