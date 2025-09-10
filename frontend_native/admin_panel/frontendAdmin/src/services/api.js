const BASE_URL = "http://localhost:4000/api/v1/requests";

export const fetchRequests = async (page = 1, limit = 5) => {
  const res = await fetch(`${BASE_URL}/get?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
};

export const fetchSortedRequests = async (order = "asc", page = 1, limit = 5) => {
  const res = await fetch(`${BASE_URL}/sorted?order=${order}&page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch sorted requests");
  return res.json();
};

export const searchRequests = async (query, page = 1, limit = 5) => {
  const res = await fetch(`${BASE_URL}/search?title=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to search requests");
  return res.json();
};

export const deleteRequest = async (id) => {
  const res = await fetch(`${BASE_URL}/del/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete request");
  return res.json();
};
