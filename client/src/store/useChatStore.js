import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
	chats: [],
	users: [],
	selectedUser: null,
	isUsersLoading: false,
	isChatsLoading: false,

	getUsers: async () => {
		set({ isUsersLoading: true });
		try {
			const response = await axiosInstance.get("/chat/users");
			set({ users: response.data });
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isUsersLoading: false });
		}
	},

	getChats: async (userId) => {
		set({ isChatsLoading: true });
		try {
			const response = await axiosInstance.get(`/chat/${userId}`);
			set({ chats: response.data });
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isChatsLoading: false });
		}
	},

	sendChat: async (chatData) => {
		const { selectedUser, chats } = get();
		try {
			const response = await axiosInstance.post(`/chat/send/${selectedUser._id}`, chatData);
			set({ chats: [...chats, response.data] });
		} catch (error) {
			toast.error(error.response.data.message);
		}
	},

	subscribeToChats: (userId) => {
		const { selectedUser } = get();
		if(!selectedUser) return;

		const socket = useAuthStore.getState().socket;

		socket.on("newChat", (newChat) => {
			const isChatSentFromSelectedUser = newChat.senderId === selectedUser._id;
			if(!isChatSentFromSelectedUser) return;
			set({ chats: [...get().chats, newChat] });
		});
	},

	unsubscribeFromChats: (userId) => {
		const socket = useAuthStore.getState().socket;
		socket.off("newChat");
	},

	setSelectedUser: (selectedUser) => {
		set({ selectedUser });
	},
}));