import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Music, Users } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

const FriendsActivity = () => {
    const { users, fetchUsers, onlineUsers, userActivities, socket } = useChatStore();
    const { currentTime, isPlaying, syncTime, setPlayingState, setCurrentSong } = usePlayerStore();
    const { user } = useUser();
    const [syncedUsers, setSyncedUsers] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (user) fetchUsers();
    }, [fetchUsers, user]);

    const fetchSongIdByUserId = async (userId: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/user/${userId}/current-song`, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            console.log(`API response for user ${userId}:`, response.data);
            if (response.data && response.data.songId) {
                const songId = response.data.songId;
                console.log(`Fetched song ID for user ${userId}: ${songId}`);
                return songId;
            } else {
                console.error(`Unexpected response format for user ${userId}:`, response.data);
                return null;
            }
        } catch (error) {
            console.error("Error fetching song ID:", error);
            return null;
        }
    };

    const handleSyncRequest = async (targetUserId: string) => {
        if (socket) {
            console.log(`Handling sync request for user ${targetUserId}`);
            const songId = await fetchSongIdByUserId(targetUserId);
            if (songId) {
                console.log(`Sync request: songId=${songId} userId=${targetUserId}`);
                socket.emit("request_sync", {
                    targetUserId,
                    songId,
                    currentTime,
                    isPlaying,
                });
            } else {
                console.log(`No song ID found for user ${targetUserId}`);
            }
        } else {
            console.log("Socket is not connected");
        }
    };

    useEffect(() => {
        if (socket) {
            const handleSyncAccepted = async ({ songId, currentTime, isPlaying }: { songId: string, currentTime: number, isPlaying: boolean }) => {
                console.log(`Sync accepted: songId=${songId}`);
                const song = await fetchSongById(songId);
                if (song) {
                    setCurrentSong(song);
                    syncTime(currentTime);
                    setPlayingState(isPlaying);
                    setSyncedUsers((prev) => new Set(prev).add(socket.id));
                }
            };

            socket.on("sync_accepted", handleSyncAccepted);

            // Cleanup on component unmount
            return () => {
                socket.off("sync_accepted", handleSyncAccepted);
            };
        }
    }, [socket, syncTime, setPlayingState, setCurrentSong]);

    return (
        <div className='h-full bg-zinc-900 rounded-lg flex flex-col'>
            <div className='p-4 flex justify-between items-center border-b border-zinc-800'>
                <div className='flex items-center gap-2'>
                    <Users className='size-5 shrink-0' />
                    <h2 className='font-semibold'>What they're listening to</h2>
                </div>
            </div>

            {!user && <LoginPrompt />}

            <ScrollArea className='flex-1'>
                <div className='p-4 space-y-4'>
                    {users.map((user) => {
                        const activity = userActivities.get(user.clerkId);
                        const isPlaying = activity && activity !== "Idle";
                        const isSynced = syncedUsers.has(user.clerkId);

                        return (
                            <div
                                key={user._id}
                                className='cursor-pointer hover:bg-zinc-800/50 p-3 rounded-md transition-colors group'
                            >
                                <div className='flex items-start gap-3'>
                                    <div className='relative'>
                                        <Avatar className='size-10 border border-zinc-800'>
                                            <AvatarImage src={user.imageUrl} alt={user.fullName} />
                                            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div
                                            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 
                                                ${onlineUsers.has(user.clerkId) ? "bg-green-500" : "bg-zinc-500"}
                                                `}
                                            aria-hidden='true'
                                        />
                                    </div>

                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-center gap-2'>
                                            <span className='font-medium text-sm text-white'>{user.fullName}</span>
                                            {isPlaying && <Music className='size-3.5 text-emerald-400 shrink-0' />}
                                        </div>

                                        {isPlaying ? (
                                            <div className='mt-1'>
                                                <div className='mt-1 text-sm text-white font-medium truncate'>
                                                    {activity.replace("Playing ", "").split(" by ")[0]}
                                                </div>
                                                <div className='text-xs text-zinc-400 truncate'>
                                                    {activity.split(" by ")[1]}
                                                </div>
                                                <button
                                                    className={`mt-2 px-3 py-1 text-sm font-medium text-white rounded-md transition-transform transform hover:scale-105 ${
                                                        isSynced ? "bg-gray-500" : "bg-emerald-500 hover:bg-emerald-600"
                                                    }`}
                                                    onClick={() => handleSyncRequest(user.clerkId)}
                                                    disabled={isSynced}
                                                >
                                                    {isSynced ? "Synced" : "Sync"}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className='mt-1 text-xs text-zinc-400'>Idle</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};

export default FriendsActivity;

const LoginPrompt = () => (
    <div className='h-full flex flex-col items-center justify-center p-6 text-center space-y-4'>
        <div className='relative'>
            <div
                className='absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg
       opacity-75 animate-pulse'
                aria-hidden='true'
            />
            <div className='relative bg-zinc-900 rounded-full p-4'>
                <HeadphonesIcon className='size-8 text-emerald-400' />
            </div>
        </div>

        <div className='space-y-2 max-w-[250px]'>
            <h3 className='text-lg font-semibold text-white'>See What Friends Are Playing</h3>
            <p className='text-sm text-zinc-400'>Login to discover what music your friends are enjoying right now</p>
        </div>
    </div>
);

// Function to fetch song details by ID
const fetchSongById = async (songId: string) => {
    try {
        const response = await axios.get(`/api/songs/${songId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching song details:", error);
        return null;
    }
};