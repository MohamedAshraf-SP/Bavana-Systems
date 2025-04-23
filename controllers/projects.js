import { Project } from "./../models/projects.js";
import { generateBarcode } from "../utils/generators.js";
import { Category } from "../models/categories.js";
import { deleteFileWithPath } from "../utils/helpers/deleteFile.js";
import { getCountOfSchema } from "../services/general.js";
import mongoose from "mongoose";
import { escapeRegex } from "../utils/regex.js";
import { projectObj } from "../utils/validations.js";
import { errorHandler } from "../middlewares/errorHandling.js";


export const addProject = async (req, res,next) => {
    try {
        projectObj.parse(req.body);
        const Cat = await Category.findById(req.body.category)
        // console.log(req.files);
        if (!Cat) {
            return res.status(400).json({ error: "برجاء اختيار تصنيف صحيح" });
        }

        console.log(req.files.mainImage);
        console.log(req.files.images);


        if (!req.files) return res.status(400).json({ error: "error" });
        if (!req.files?.mainImage) return res.status(400).json({ error: "main image is required" });
        if (!req.files?.images) return res.status(400).json({ error: "at least one image is reqired" });


        const images = req.files ? req.files.images.map(image => {
            const normalizedImage = Object.assign({}, image);
            return { url: normalizedImage.path, alt: req.body.name || "project picture" }
        }) : [];



        const projectData = {
            ...req.body,
            mainImage: { url: req.files.mainImage[0].path, alt: req.body.name || "project picture" },
            images,

        };


        const project = new Project(projectData);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        next(error)
    }
}


export const search = async (req, res) => {
    try {
        const { name, categoryId } = req.query;


        let filter = {}
        if (categoryId) filter.category = new mongoose.Types.ObjectId(req.query.categoryId)

        if (name) {
            filter.$or = [
                { name: { $regex: escapeRegex(name), $options: 'i' } },

            ];
        }

        // console.log(filter);

        const projects = await Project.aggregate([
            {
                $match: filter
            },
        ]);

        res.status(200).json({ projects });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }

}

export const getProjects = async (req, res) => {
    try {
        let { category, minPrice, maxPrice, isFeatured, sort, sortType, page, limit } = req.query;
        let query = { isDeleted: false };
        //  console.log(minPrice);

        if (category) query.category = category;
        if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
        if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
        if (isFeatured) query.isFeatured = isFeatured === "true";

        page = Number(page) || 1;
        limit = Number(limit) || 10;
        let skip = (page - 1) * limit;
        //  console.log(limit);

        const sortQuery = sort ? { [sort]: (sortType ? Number(sortType) : 1), updatedAt: -1 } : { updatedAt: -1 };
        //console.log(sortQuery);
        const projects = await Project.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);
        const count = await Project.countDocuments(query)

        if (skip == 0) skip = 1
        const totalPages = Math.ceil(count / limit)

        res.status(200).json({
            "currentPage": page,
            "ProjectsCount": count,
            "totalPages": totalPages,
            "Projects": projects
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getProjectById = async (req, res) => {
    try {
        // console.log(req.params.id);
        const project = await Project.findById(req.params.id)//.populate("category");
        //console.log(project);

        if (!project || project.isDeleted) return res.status(404).json({ message: "Project not found" });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateProject = async (req, res) => {

    try {
        const project = await Project.findById(req.params.id)
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }



        if (req.body?.removedImagesPaths) {
            // Remove images from the project
            project.images = project.images.filter(image => !req.body.removedImagesPaths.includes(image.url));


            // Delete images from storage (optional)
            req.body.removedImagesPaths.forEach(imagePath => {
                // console.log(deleteFileWithPath(imagePath))
            });
        }

        project.images = req.files?.images ? [...project.images, ...req.files.images.map(image => {
            return { url: image.path, alt: req.body.name || "project picture" }
        })] : [...project.images]

        if (req.files?.mainImage) {
            deleteFileWithPath(project.mainImage.url)
            project.mainImage = req.files.mainImage ?
                { url: req.files.mainImage[0].path, alt: req.body.name || "project picture" } : project.mainImage
        }

        Object.assign(project, req.body)
        await project.save();

        res.json(project);
    } catch (error) {
        // console.log(error);
        res.status(400).json({ error: error.message });
    }

};


export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.json({ message: "Project deleted", project });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCount = async (req, res) => {
    try {
        const counts = {
            acitveProjects: await Project.countDocuments({ isActive: true }),
            unactiveProjects: await Project.countDocuments({ isActive: false })
        }

        res.status(200).json({ counts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};











// **** Hard Delete a Project (Permanently Remove)*****
// export const deleteProject = async (req, res) => {
//     try {
//         const project = await Project.findByIdAndDelete(req.params.id);
//         if (!project) return res.status(404).json({ message: "Project not found" });
//         res.json({ message: "Project permanently deleted" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
