import { fetchFromTMDB } from "../services/tmdb.service.js";
import axios from "axios";
import { User } from "../models/user.model.js";

export async function getTrendingMovie(req, res) {
	try {
		const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/movie/day?language=en-US");
		const limited = data.results.slice(0, 5);
		res.json({ success: true, content: limited });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getNowPlayingMovies(req, res) {
	try {
		const data = await fetchFromTMDB("https://api.themoviedb.org/3/movie/now_playing");
		res.json({ success: true, content: data.results });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMovieTrailer(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
		res.json({ success: true, trailer: data.results[0] });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}

		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMovieDetails(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
		res.status(200).json({ success: true, content: data });
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}

		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getSimilarMovies(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getRecommendationMovies(req, res) {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/recommendations?language=en-US&page=1`);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}

export async function getMoviesByCategory(req, res) {
	const { category } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);
		res.status(200).json({ success: true, content: data.results });
	} catch (error) {
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
}


export async function addToFavorites(req, res) {
    const { mediaId, mediaType, favorite } = req.body;

    if (!mediaId || !mediaType || typeof favorite === "undefined") {
        return res.status(400).json({
            success: false,
            message: "Media ID, Media Type, and favorite status are required",
        });
    }

    try {
        // تحقق من أن المستخدم مسجل دخولًا ولديه accountId
        if (!req.user || !req.user.accountId) {
            return res.status(401).json({ success: false, message: "Unauthorized - No accountId found" });
        }

        const url = `https://api.themoviedb.org/3/account/${req.user.accountId}/favorite`;

        const options = {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
            },
            data: JSON.stringify({
                media_type: mediaType,
                media_id: mediaId,
                favorite: favorite,
            }),
        };

        const response = await axios(url, options);

        res.status(200).json({
            success: true,
            message: `Item ${favorite ? "added to" : "removed from"} favorites`,
            data: response.data,
        });

    } catch (error) {
        console.error("Error in addToFavorites:", error.response ? error.response.data : error.message);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error",
            error: error.response ? error.response.data : error.message 
        });
    }
}


export async function getFavorites(req, res) {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            favorites: user.favorites,
        });
    } catch (error) {
        console.error("Error in getFavorites:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
