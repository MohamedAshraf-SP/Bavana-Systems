import mongoose, { model } from "mongoose";
import { Category } from "./categories.js";



const projectSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    urlName: { type: String },
    description: { type: String, required: true },
    badge: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },//,required: true
    price: {
        type: Number, required: false, default: 0,
        validate: {
            validator: function (price) {
                return (price > 1 && price < 999999)// Ensure at least one variant exists
            },
            message: "\nلا يمكن ان يكون السعر اقل من1 و اكثر من999999 \n",
        }
    },
   
    mainImage: { url: { type: String, required: true }, alt: { type: String } },
    images: [
        { url: { type: String, required: true }, alt: { type: String } }
    ],

    tags: [
        { type: String }
    ],
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    reviews: [
        {
            name: { type: String },
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ],

    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
},
    { timestamps: true });




projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });


export const Project = mongoose.model('Project', projectSchema);


