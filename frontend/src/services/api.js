import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔥 ADD TOKEN AUTOMATICALLY
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  req.headers = req.headers || {};

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
    req.headers.authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
