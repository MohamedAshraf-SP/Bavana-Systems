import express from "express";
import {
    getProjectById,
    getProjects,
    updateProject,
    deleteProject,
    addProject,
    getCount,

} from "../controllers/projects.js";
import { upload } from "../middlewares/multer.js";
import reviewsRouter from "./projectReviews.js";
import { authMiddleware, roleMiddleware } from "../middlewares/autherization.js";

//import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const projectsRoute = express.Router();

const uploadFields = upload.fields([
    { name: "mainImage", maxCount: 1 }, // Accepts 1 file for mainImage
    { name: "images", maxCount: 10 }, // Accepts up to 5 files for images
]);



projectsRoute.get("/counts", getCount);
projectsRoute.get("/search", (req, res) => { return res.status(200).json({ message: "search" }) });
projectsRoute.get("/:id", getProjectById);
projectsRoute.get("/", getProjects);

projectsRoute.post("/", authMiddleware, roleMiddleware(["admin"]), uploadFields, addProject);
projectsRoute.put("/:id", authMiddleware, roleMiddleware(["admin"]), uploadFields, updateProject);
projectsRoute.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteProject);

projectsRoute.use("/", reviewsRouter);

export default projectsRoute;
