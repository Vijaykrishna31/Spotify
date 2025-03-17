import {Song} from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const syncSong = (io, socket) => {
    socket.on('sync_song', ({ userId, songId, currentTime, isPlaying }) => {
        socket.broadcast.emit('sync_song', { userId, songId, currentTime, isPlaying });
    });
};

export const getFeaturedSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            { $sample: { size: 6 } },
            { $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
        ]);
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const getMadeForYouSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            { $sample: { size: 4 } },
            { $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
        ]);
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const getTrendingSongs = async (req, res, next) => {
    try {
        const songs = await Song.aggregate([
            { $sample: { size: 4 } },
            { $project: { _id: 1, title: 1, artist: 1, imageUrl: 1, audioUrl: 1 } },
        ]);
        res.json(songs);
    } catch (error) {
        next(error);
    }
};

export const getSongById = async (req, res, next) => {
    try {
        const song = await Song.findById(req.params.songId);
        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }
        res.status(200).json(song);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
