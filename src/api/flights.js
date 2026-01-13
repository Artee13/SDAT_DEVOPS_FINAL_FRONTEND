import client from "./client";

export async function fetchFlights(airportId, type) {
  const res = await client.get("/api/flights", {
    params: { airportId, type },
  });
  return res.data;
}
