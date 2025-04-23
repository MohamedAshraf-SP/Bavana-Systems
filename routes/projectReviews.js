import express from "express";
import { addReview, getReviews, updateReview, deleteReview } from "../controllers/projectReviews.js";
import { authMiddleware, roleMiddleware } from "../middlewares/autherization.js";

const reviewsRouter = express.Router();

reviewsRouter.post("/:id/reviews", addReview);
reviewsRouter.get("/:id/reviews", getReviews);
reviewsRouter.put("/:projectId/reviews/:reviewId",authMiddleware, roleMiddleware(["admin"]), updateReview);
reviewsRouter.delete("/:projectId/reviews/:reviewId",authMiddleware, roleMiddleware(["admin"]), deleteReview);

export default reviewsRouter;
