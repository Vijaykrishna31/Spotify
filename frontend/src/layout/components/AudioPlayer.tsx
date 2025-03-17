import { usePlayerStore } from "@/stores/usePlayerStore";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useRef } from "react";
import axios from "axios";

const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSongRef = useRef<string | null>(null);

    const { currentSong, isPlaying, playNext, currentTime, syncTime, setPlayingState, setCurrentSong } = usePlayerStore();
    const { socket } = useChatStore();

    // handle play/pause logic
    useEffect(() => {
        if (isPlaying) audioRef.current?.play();
        else audioRef.current?.pause();
    }, [isPlaying]);

    // handle song ends
    useEffect(() => {
        const audio = audioRef.current;

        const handleEnded = () => {
            playNext();
        };

        audio?.addEventListener("ended", handleEnded);

        return () => audio?.removeEventListener("ended", handleEnded);
    }, [playNext]);

    // handle sync request
    useEffect(() => {
        if (socket) {
            const handleSyncRequest = ({ requesterId, songId, currentTime, isPlaying }: { requesterId: string; songId: string; currentTime: number; isPlaying: boolean }) => {
                console.log(`Sync request: requesterId=${requesterId}, songId=${songId}, currentTime=${currentTime}, isPlaying=${isPlaying}`);
                socket.emit("respond_sync", {
                    requesterId,
                    accept: true,
                    songId,
                    currentTime,
                    isPlaying,
                });
            };

            socket.on("sync_request", handleSyncRequest);

            // Cleanup on component unmount
            return () => {
                socket.off("sync_request", handleSyncRequest);
            };
        }
    }, [socket, currentSong, currentTime, isPlaying]);

    // handle sync accepted
    useEffect(() => {
        if (socket) {
            const handleSyncAccepted = async ({ songId, currentTime, isPlaying }: { songId: string, currentTime: number, isPlaying: boolean }) => {
                console.log(`Sync accepted: songId=${songId}, currentTime=${currentTime}, isPlaying=${isPlaying}`);
                const song = await fetchSongById(songId);
                if (song) {
                    console.log("Fetched song:", song);
                    setCurrentSong(song);
                    syncTime(currentTime);
                    setPlayingState(isPlaying);
                }
            };

            socket.on("sync_accepted", handleSyncAccepted);

            return () => {
                socket.off("sync_accepted", handleSyncAccepted);
            };
        }
    }, [socket, syncTime, setPlayingState, setCurrentSong]);

    // handle play/pause state change
    useEffect(() => {
        if (socket) {
            const handlePlayPause = (state: boolean) => {
                setPlayingState(state);
            };

            socket.on("play_pause", handlePlayPause);

            return () => {
                socket.off("play_pause", handlePlayPause);
            };
        }
    }, [socket, setPlayingState]);

    // handle song change
    useEffect(() => {
        if (socket) {
            const handleChangeSong = async (songId: string) => {
                const song = await fetchSongById(songId);
                if (song) {
                    setCurrentSong(song);
                }
            };

            socket.on("change_song", handleChangeSong);

            return () => {
                socket.off("change_song", handleChangeSong);
            };
        }
    }, [socket, setCurrentSong]);

    // handle song changes
    useEffect(() => {
        if (!audioRef.current || !currentSong) return;

        const audio = audioRef.current;

        // check if this is actually a new song
        const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
        if (isSongChange) {
            audio.src = currentSong?.audioUrl;
            // reset the playback position
            audio.currentTime = 0;

            prevSongRef.current = currentSong?.audioUrl;

            if (isPlaying) audio.play();
        }
    }, [currentSong, isPlaying]);

    return (
        <div>
            <audio ref={audioRef} />
            {currentSong && (
                <div className="current-song">
                    <p>{currentSong.title} by {currentSong.artist}</p>
                </div>
            )}
            {!currentSong && <p>No song is currently playing.</p>}
        </div>
    );
};

export default AudioPlayer;

// Function to fetch song details by ID
const fetchSongById = async (songId: string) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/songs/${songId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (response.data && typeof response.data === 'object') {
            console.log("Fetched song details:", response.data);
            return response.data;
        } else {
            console.error("Invalid response format:", response.data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching song details:", error);
        return null;
    }
};