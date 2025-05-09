import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;
		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.log("Error in getUsersForSidebar:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const getChats = async (req, res) => {
	try {
		const {id: userToChatId} = req.params;
		const myId = req.user._id;

		const chats = await Chat.find({
			$or: [
				{ senderId: myId, receiverId: userToChatId },
				{ senderId: userToChatId, receiverId: myId },
			],
		});

		res.status(200).json(chats);
	} catch (error) {
		console.log("Error in getChats controller:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const sendChats = async (req, res) => {
	try {
		const { text, image } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let imageUrl;
		if(image) {
			const uploadResponse = await cloudinary.uploader.upload(image);
			imageUrl = uploadResponse.secure_url;
		}

		const newChat = new Chat({
			senderId,
			receiverId,
			text,
			image: imageUrl,
		});

		await newChat.save();

		const receiverSocketId = getReceiverSocketId(receiverId);
		if(receiverSocketId) {
			io.to(receiverSocketId).emit('newChat', newChat);
		}

		res.status(201).json(newChat);
	} catch (error) {
		console.log("Error in sendChat controller:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}