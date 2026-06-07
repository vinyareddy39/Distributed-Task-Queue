import axios from "axios";

let baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Auto-correct if the URL is missing the "/api" suffix
if (baseURL && !baseURL.endsWith("/api") && !baseURL.endsWith("/api/")) {
  baseURL = baseURL.replace(/\/$/, "") + "/api";
}

const api = axios.create({
  baseURL,
});

export default api;