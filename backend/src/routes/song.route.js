import express from "express";
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs, getSongById } from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, requireAdmin, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/:songId", getSongById); // Ensure this route is correct

export default router;
