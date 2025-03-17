import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, getMessages, getCurrentSong } from "../controller/user.controller.js";
import User from "../models/user.model.js";
const router = Router();

router.get("/", protectRoute, getAllUsers);
router.get("/messages/:userId", protectRoute, getMessages);

router.get('/user/:userId/current-song', getCurrentSong);

router.put('/user/:userId/current-song', async (req, res) => {
    try {
        const { userId } = req.params;
        const { songId } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { currentSongId: songId },
            { new: true }
        ).populate("currentSongId");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ songId: user.currentSongId ? user.currentSongId._id : null });
    } catch (error) {
        console.error("Error updating user or song details:", error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
