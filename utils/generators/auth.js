import user from "../../models/user.js";

import crypto from "crypto"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()








export const checkIfEmailExist = async (email) => {
    const existingUser = await user.findOne({ userName: email });

    return existingUser ? true : false;
}


//passwords

export const generateRandomPassword = (length = 12) => {
    return crypto.randomBytes(length)
        .toString("base64") // Convert to a readable format
        .slice(0, length)   // Limit to the desired length
        .replace(/[^a-zA-Z0-9]/g, ""); // Remove special characters if needed
};


export const hashPassword = async (password, saltRounds = 5) => {
    // Number of hashing rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};




// console.log(generateRandomPassword());
