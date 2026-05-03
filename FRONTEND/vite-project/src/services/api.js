import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token && token !== "undefined" && token !== "null") {
    req.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Sending token:", token);
  } else {
    console.log("❌ No valid token found");
  }

  return req;
});

// Handle 401 errors globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.error("❌ 401 Unauthorized - Token invalid or expired");
      localStorage.removeItem("token");
      // Let individual components handle redirects
    }
    return Promise.reject(err);
  }
);

export default API;