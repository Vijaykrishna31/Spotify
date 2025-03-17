import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        clerkId: {
            type: String,
            required: true,
            unique: true,
        },
        currentSongId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song",
            default: null,
        },
    },
    { timestamps: true } //  createdAt, updatedAt
);

const User = mongoose.model("User", userSchema);
export default User;
