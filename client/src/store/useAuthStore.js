import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
	authUser: null,
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	isCheckingAuth: true,
	onlineUsers: [],
	socket: null,

	checkAuth: async () => {
		try {
			const response = await axiosInstance.get("/auth/check");
			set({ authUser: response.data });
			get().connectSocket();
		} catch (error) {
			console.error("Error in checkAuth:", error);
			set({ authUser: null });
		} finally {
			set({ isCheckingAuth: false });
		}
	},

	signup: async (data) => {
		set({ isSigningUp: true });
		try {
			const response = await axiosInstance.post("/auth/signup", data);
			console.log("Auth store: Signup response:", response);

			if (!response || !response.data) {
				throw new Error("No response data received from server");
			}

			set({ authUser: response.data });
			toast.success("Account created successfully");
			get().connectSocket();
			return response.data;
		} catch (error) {
			console.error("Auth store: Signup error:", error);
			console.error("Auth store: Error response:", error.response);

			const errorMessage = error.response?.data?.message || error.message || "Failed to create account";

			toast.error(errorMessage);
			throw new Error(errorMessage);
		} finally {
			set({ isSigningUp: false });
		}
	},

	login: async (data) => {
		set({ isLoggingIn: true });
		try {
			const res = await axiosInstance.post("/auth/login", data);
			set({ authUser: res.data });
			toast.success("Logged in successfully");

			get().connectSocket();
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isLoggingIn: false });
		}
	},

	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({ authUser: null });
			toast.success("Logged out successfully");
			get().disconnectSocket();
		} catch (error) {
			console.error("Error in logout:", error);
			toast.error(error.response?.data?.message || "Failed to logout");
		}
	},

	updateProfile: async (data) => {
		set({ isUpdatingProfile: true });
		try {
			const res = await axiosInstance.put("/auth/update-profile", data);
			set({ authUser: res.data });
			toast.success("Profile updated successfully");
		} catch (error) {
			console.log("error in update profile:", error);
			toast.error(error.response.data.message);
		} finally {
			set({ isUpdatingProfile: false });
		}
	},

	connectSocket: () => {
		const { authUser } = get();
		if (!authUser || get().socket?.connected) return;

		const socket = io(BASE_URL, {
			query: {
				userId: authUser._id,
			},
		});
		socket.connect();

		set({ socket });

		socket.on("getOnlineUsers", (userIds) => {
			set({ onlineUsers: userIds });
		});
	},

	disconnectSocket: () => {
		if(get().socket?.connected) get().socket.disconnect();
	},
}));