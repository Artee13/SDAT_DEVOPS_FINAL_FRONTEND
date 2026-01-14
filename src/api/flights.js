import client from "./client";

export async function fetchFlights(airportId, type) {
  const res = await client.get("/api/flights", {
    params: { airportId, type },
  });
  return res.data;
}

export async function createFlight(payload) {
  const res = await client.post("/api/flights", payload);
  return res.data;
}

export async function deleteFlight(id) {
  await client.delete(`/api/flights/${id}`);
}
