import { z } from 'zod';
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
