import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { config } from "dotenv";

config();

const seedDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);

		// Clear existing data
		await Album.deleteMany({});
		await Song.deleteMany({});

		// First, create all songs
		const createdSongs = await Song.insertMany([
			{
				title: "Kandukonden Kandukonden",
				artist: "ARR",
				imageUrl: "/cover-images/kandukonden.jpg",
				audioUrl: "/songs/Kandukonden Kandukonden.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 317, // 0:39
			},
			{
				title: "Enge Enathu Kavithai",
				artist: "ARR",
				imageUrl: "/cover-images/kandukonden.jpg",
				audioUrl: "/songs/Enge Enathu Kavithai.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 316, // 0:36
			},
			{
				title: "Kannamoochi Yenada",
				artist: "ARR",
				imageUrl: "/cover-images/kandukonden.jpg",
				audioUrl: "/songs/Kannamoochi Yenada.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 311, // 0:36
			},
			{
				title: "Konjum Mainakkale",
				artist: "ARR",
				imageUrl: "/cover-images/kandukonden.jpg",
				audioUrl: "/songs/Konjum Mainakale.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 280, // 0:39
			},
			{
				title: "Santhana Thendralai",
				artist: "ARR",
				imageUrl: "/cover-images/kandukonden.jpg",
				audioUrl: "/songs/Santhana Thendralai.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 359, // 0:24
			},
			{
				title: "sutrum vizhi Sudare",
				artist: "ARR",
				imageUrl: "/cover-images/kandukonden.jpg",
				audioUrl: "/songs/Sutrum Vizhi Sudarthan.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 138, // 0:28
			},
			{
				title: "Elo Machi Machi",
				artist: "Udit Narayanan",
				imageUrl: "/cover-images/anbe-sivam.jpg",
				audioUrl: "/songs/Elo Machi Machi.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 274, // 0:39
			},
			{
				title: "Mouname Paaraiyai Pesi Kondom",
				artist: "SPB",
				imageUrl: "/cover-images/anbe-sivam.jpg",
				audioUrl: "/songs/Mouname Paarvaiyai Pesi Kondom.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 276, // 0:30
			},
			{
				title: "Naatakoru Seithi",
				artist: "Kamal Hassan",
				imageUrl: "/cover-images/anbe-sivam.jpg",
				audioUrl: "/songs/Naatakoru Seithi.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 487, // 0:46
			},
			{
				title: "Poo Vaasam Purapadum Penne",
				artist: "Vijay Prakash",
				imageUrl: "/cover-images/anbe-sivam.jpg",
				audioUrl: "/songs/Poo Vaasam Purapadum Penne2.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 267, // 0:41
			},
			{
				title: "Vazhve Thavam",
				artist: "Kamal Hassan",
				imageUrl: "/cover-images/anbe-sivam.jpg",
				audioUrl: "/songs/Vazhve Thavam.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 258, // 0:27
			},
			{
				title: "Chinna Chinna Vanna Kuyil",
				artist: "Ilayaraja",
				imageUrl: "/cover-images/mouna-ragam.jpg",
				audioUrl: "/songs/Chinna Chinna Vanna Kuyil.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 264, // 0:24
			},
			{
				title: "Mandram Vandha Thendralukku",
				artist: "Ilayaraja",
				imageUrl: "/cover-images/mouna-ragam.jpg",
				audioUrl: "/songs/Mandram Vandha Thendralukku.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 286, // 0:39
			},
			{
				title: "Nilave Vaa Sellathe Vaa",
				artist: "Ilayaraja",
				imageUrl: "/cover-images/mouna-ragam.jpg",
				audioUrl: "/songs/Nilave Vaa Sellathe Vaa.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 276, // 0:17
			},
			{
				title: "Oho Megam Vandhadho",
				artist: "Ilayaraja",
				imageUrl: "/cover-images/mouna-ragam.jpg",
				audioUrl: "/songs/Oho Megam Vanthatho.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 265, // 0:17
			},
			{
				title: "Pani Vizhum Iravu",
				artist: "Ilayaraja",
				imageUrl: "/cover-images/mouna-ragam.jpg",
				audioUrl: "/songs/Pani Vizhum Iravu.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 272, // 0:17
			},
			{
				title: "Athan Varuvaaga",
				artist: "Karthik Raja",
				imageUrl: "/cover-images/dum dum.jpg",
				audioUrl: "/songs/Athan Varuvaaga.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 325, // 0:17
			},
			{
				title: "Athiri Pathiri",
				artist: "Karthik Raja",
				imageUrl: "/cover-images/dum dum.jpg",
				audioUrl: "/songs/Athiri Pathiri.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 301, // 0:17
			},
			{
				title: "Krishna Krishna",
				artist: "Karthik Raja",
				imageUrl: "/cover-images/dum dum.jpg",
				audioUrl: "/songs/Krishna Krishna.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 309, // 0:17
			},
			{
				title: "Ragasiamai",
				artist: "Karthik Raja",
				imageUrl: "/cover-images/dum dum.jpg",
				audioUrl: "/songs/Ragasiamai.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 304, // 0:17
			},
			{
				title: "Thesingu Raja",
				artist: "Karthik Raja",
				imageUrl: "/cover-images/dum dum.jpg",
				audioUrl: "/songs/Thesingu Raja..mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 299, // 0:17
			},
			{
				title: "Un Perai Sonnale",
				artist: "Karthik Raja",
				imageUrl: "/cover-images/dum dum.jpg",
				audioUrl: "/songs/Un Perai Sonnale.mp3",
				plays: Math.floor(Math.random() * 5000),
				duration: 358, // 0:17
			},
			

		]);

		// Create albums with references to song IDs
		const albums = [
			{
				title: "Kandukonden Kandukonden",
				artist: "ARR",
				imageUrl: "/cover-images/kandukonden.jpg",
				releaseYear: 2000,
				songs: createdSongs.slice(0, 6).map((song) => song._id),
			},
			{
				title: "Anbe Sivam",
				artist: "Various Artists",
				imageUrl: "/cover-images/anbe-sivam.jpg",
				releaseYear: 2003,
				songs: createdSongs.slice(6, 11).map((song) => song._id),
			},
			{
				title: "Mouna Ragam",
				artist: "Ilayaraja",
				imageUrl: "/cover-images/mouna-ragam.jpg",
				releaseYear: 1986,
				songs: createdSongs.slice(11, 16).map((song) => song._id),
			},
			{
				title: "Dum Dum Dum",
				artist: "Karthik Raja",
				imageUrl: "/cover-images/dum dum.jpg",
				releaseYear: 2001,
				songs: createdSongs.slice(16,23).map((song) => song._id),
			},
		];

		// Insert all albums
		const createdAlbums = await Album.insertMany(albums);

		// Update songs with their album references
		for (let i = 0; i < createdAlbums.length; i++) {
			const album = createdAlbums[i];
			const albumSongs = albums[i].songs;

			await Song.updateMany({ _id: { $in: albumSongs } }, { albumId: album._id });
		}

		console.log("Database seeded successfully!");
	} catch (error) {
		console.error("Error seeding database:", error);
	} finally {
		mongoose.connection.close();
	}
};

seedDatabase();
