import client from "./client";

export async function fetchGates() {
  const res = await client.get("/api/gates");
  return res.data;
}
