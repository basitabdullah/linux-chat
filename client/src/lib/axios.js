import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://linux-chat.up.railway.app/api",
  withCredentials: true,
});
