import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://independent-mindfulness-production.up.railway.app/api",
  withCredentials: true,
});
