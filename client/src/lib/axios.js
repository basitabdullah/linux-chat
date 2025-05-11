import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://linux-chat-production.up.railway.app",
  withCredentials: true,
});
