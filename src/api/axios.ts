import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("taskflow_auth");
  if (raw) {
    try {
      const session = JSON.parse(raw);
      if (session?.state?.token) {
        config.headers.Authorization = `Bearer ${session.state.token}`;
      }
    } catch {
      // noop
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("taskflow_auth");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
