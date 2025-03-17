import User from "../models/user.model.js";
//import { Message } from "../models/message.model.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const currentUserId = req.auth.userId;
        const users = await User.find({ clerkId: { $ne: currentUserId } });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const myId = req.auth.userId;
        const { userId } = req.params;
        // Your existing code...
    } catch (error) {
        next(error);
    }
};

export const getCurrentSong = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId).populate("currentSongId");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ songId: user.currentSongId ? user.currentSongId._id : null });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
