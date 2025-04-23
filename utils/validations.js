import { boolean, z } from 'zod';
import mongoose from 'mongoose';
export const UserObj = z.object({
    userName: z.string().min(3),
    password: z.string().min(6),
    firstName: z.string(),
    middleName: z.string(),
    lastName: z.string(),
    nationality: z.string(),
    nationalId: z.string(),
    dateOfBirth: z.string().refine(
        (date) => new Date(date) < new Date(),
        { message: "Date of birth must be in the past" }
    ),
    address: z.object({
        city: z.string(),
        street: z.string(),
        buildingNumber: z.string(),
        floorNumber: z.string(),
        apartmentNumber: z.string(),
    }),
    phone: z.string(),
    mobile: z.string().optional(),
    email: z.string().email(),
    userRole: z.enum(['admin', 'user', 'client']),
    userType: z.enum(['individual', 'company']),
});
//.

export const projectObj = z.object({

    title: z.string().min(3),
    urlName: z.string().optional(),
    description: z.string().min(3),
    badge: z.string().min(3).optional(),
    category: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId"
    }),//,required: true
    price: z.string().refine((val) => val > 0, { message: "price must be more than 0!" }).optional().transform((val) => Number(val)),


    //mainImage: z.array(z.any()).min(1, "mainImage is required"),
    //images: z.array(z.any()).max(5, "upload max 5 images").optional(),
    tags: z.array(z.string()).optional(),

    isFeatured: z.any().default(false).transform((val) => val === boolean(val)),
    isActive: z.any().transform((val) => val === boolean(val)),
    isDeleted: z.any().transform((val) => val === boolean(val)),

}


)



