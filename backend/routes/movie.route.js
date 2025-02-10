import express from "express";
import {
	getMovieDetails,
	getMoviesByCategory,
	getMovieTrailer,
	getSimilarMovies,
	getTrendingMovie,
	getNowPlayingMovies,
	getRecommendationMovies ,
	addToFavorites
} from "../controllers/movie.controller.js";
import { protectRoute } from "../middleware/protectRoute.js"; // التأكد من أن المستخدم مسجل الدخول

const router = express.Router();

router.get("/trending", getTrendingMovie);
router.get("/nowplaying", getNowPlayingMovies);
router.get("/:id/trailer", getMovieTrailer);
router.get("/:id/details", getMovieDetails);
router.get("/:id/similar", getSimilarMovies);
router.get("/:id/recommendations", getRecommendationMovies);
router.get("/:category", getMoviesByCategory);
router.post("/favorite", protectRoute, addToFavorites);


export default router;
