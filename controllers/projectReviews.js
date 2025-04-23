
import { Project } from "./../models/projects.js";
/** 
 * @desc   Add a review to a project
 * @route  POST /api/projects/:id/reviews
 */
export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const projectId = req.params.id;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "منتج غير موجود" });

        const newReview = { rating, comment };
        project.reviews.push(newReview);

        // Update the average rating and count
        const totalReviews = project.reviews.length;
        const totalRating = project.reviews.reduce((sum, rev) => sum + rev.rating, 0);
        project.ratings.average = totalRating / totalReviews;
        project.ratings.count = totalReviews;

        await project.save();
        res.status(201).json({ message: "Review added successfully", project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/** 
 * @desc   Get all reviews for a project
 * @route  GET /api/projects/:id/reviews
 */
export const getReviews = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).select("-_id reviews");
        console.log(project);
        if (!project) return res.status(404).json({ message: "منتج غير موجود" });

        res.status(200).json(project.reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/** 
 * @desc   Update a review
 * @route  PUT /api/projects/:projectId/reviews/:reviewId
 */
export const updateReview = async (req, res) => {
    try {
        const { projectId, reviewId } = req.params;
        const { rating, comment } = req.body;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "منتج غير موجود" });

        const review = project.reviews.id(reviewId);
        if (!review) return res.status(404).json({ message: "Review not found" });

        review.rating = rating ?? review.rating;
        review.comment = comment ?? review.comment;

        // Recalculate average rating
        const totalReviews = project.reviews.length;
        const totalRating = project.reviews.reduce((sum, rev) => sum + rev.rating, 0);
        project.ratings.average = totalRating / totalReviews;
        project.ratings.count = totalReviews;

        await project.save();
        res.status(200).json({ message: "Review updated successfully", project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/** 
 * @desc   Delete a review
 * @route  DELETE /api/projects/:projectId/reviews/:reviewId
 */
export const deleteReview = async (req, res) => {
    try {
        const { projectId, reviewId } = req.params;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "منتج غير موجود" });

        project.reviews = project.reviews.filter(review => review._id.toString() !== reviewId);

        // Recalculate average rating
        const totalReviews = project.reviews.length;
        const totalRating = project.reviews.reduce((sum, rev) => sum + rev.rating, 0);
        project.ratings.average = totalReviews ? totalRating / totalReviews : 0;
        project.ratings.count = totalReviews;

        await project.save();
        res.status(200).json({ message: "Review deleted successfully", project });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
