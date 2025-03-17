import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

const userSockets = new Map();

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        },
    });

    const userActivities = new Map(); // {userId: activity}

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("user_connected", (userId) => {
            userSockets.set(userId, socket.id);
            userActivities.set(userId, "Idle");

            // broadcast to all connected sockets that this user just logged in
            io.emit("user_connected", userId);

            socket.emit("users_online", Array.from(userSockets.keys()));

            io.emit("activities", Array.from(userActivities.entries()));
        });

        socket.on("register_user", (userId) => {
            userSockets.set(userId, socket.id);
        });

        socket.on("update_activity", ({ userId, activity }) => {
            console.log("activity updated", userId, activity);
            userActivities.set(userId, activity);
            io.emit("activity_updated", { userId, activity });
        });

        socket.on("send_message", async (data) => {
            try {
                const { senderId, receiverId, content } = data;

                const message = await Message.create({
                    senderId,
                    receiverId,
                    content,
                });

                // send to receiver in realtime, if they're online
                const receiverSocketId = userSockets.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", message);
                }

                socket.emit("message_sent", message);
            } catch (error) {
                console.error("Message error:", error);
                socket.emit("message_error", error.message);
            }
        });

        // Handle song synchronization
        socket.on("sync_song", ({ userId, songId, currentTime, isPlaying }) => {
            console.log(`Sync song: userId=${userId}, songId=${songId}, currentTime=${currentTime}, isPlaying=${isPlaying}`);
            socket.broadcast.emit("sync_song", { userId, songId, currentTime, isPlaying });
        });

        socket.on("request_sync", ({ targetUserId, targetSongId, currentTime, isPlaying }) => {
            console.log(`Request sync: targetUserId=${targetUserId}, songId=${targetSongId}, currentTime=${currentTime}, isPlaying=${isPlaying}`);
            const targetSocketId = userSockets.get(targetUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit("sync_request", { requesterId: socket.id, targetSongId, currentTime, isPlaying });
            }
        });

        socket.on("respond_sync", ({ requesterId, accept, songId, currentTime, isPlaying }) => {
            console.log(`Respond sync: requesterId=${requesterId}, accept=${accept}, songId=${songId}, currentTime=${currentTime}, isPlaying=${isPlaying}`);
            if (accept) {
                io.to(requesterId).emit("sync_accepted", { songId, currentTime, isPlaying });
            } else {
                io.to(requesterId).emit("sync_rejected");
            }
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            let disconnectedUserId;
            for (const [userId, socketId] of userSockets.entries()) {
                // find disconnected user
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    userSockets.delete(userId);
                    userActivities.delete(userId);
                    break;
                }
            }
            if (disconnectedUserId) {
                io.emit("user_disconnected", disconnectedUserId);
            }
        });
    });
};
