import client from "./client";

export async function fetchAirlines() {
  const res = await client.get("/api/airlines");
  return res.data;
}
