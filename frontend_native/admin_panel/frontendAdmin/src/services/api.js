import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1/requests",
});

// Create a new request (with image upload)
export const createRequest = async (formData) => {
  return await API.post("/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Get all requests
export const getRequests = async () => {
  return await API.get("/get");
};

// Get sorted requests (A-Z or Z-A handled in backend)
export const getSortedRequests = async () => {
  return await API.get("/sorted");
};

// Search requests by title
export const searchRequests = async (title) => {
  return await API.get(`/search?title=${title}`);
};

// Delete a request by ID
export const deleteRequest = async (id) => {
  return await API.delete(`/del/${id}`);
};
