import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/user.js"
import { generateRefreshToken, generateAccessToken } from "../utils/jwt.js"
import { UserObj } from "../utils/validations.js"
import { generateRandomPassword, hashPassword } from "../utils/generators/auth.js"


export const register = async (req, res, next) => {
    try {
        req.body.userRole = "client";
        const userObj = UserObj.parse(req.body);

        userObj.password = await bcrypt.hash(userObj.password, 10);
        const newUser = new User(userObj)

        await newUser.save();


        res.status(201).json({ message: 'User registered successfully; You can login now.' });

    } catch (err) {
        next(err)
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid email or password!!" });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: false,
            secure: false, // Use true in production for HTTPS
            sameSite: "Strict",
        });

        res.json({ accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const forgetPassword = async (req, res) => {
    try {
        // Check if the email exists in the database

        //if (yes)
        // 
        //  create reset token and save it to the database with an expiration time
        //  send email with the reset link

        res.status(200).json({ message: "Email  sent successfully!" });
    } catch (e) {
        return res.status(400).json({ message: "Error !!" });
    }
};
export const resetPassword = async (req, res) => {
    try {
        //get the token from the request
        //get the new password from the request body
        // Check if the reset token is valid and not expired
        // If valid, hash the new password and update it in the database
        // Invalidate the reset token after use
        // Send a success response

        res.status(200).json({ message: "Password reset successfully!" });
    } catch (e) {
        return res.status(400).json({ message: "Error resetting the password!!" });
    }
};


export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!refreshToken) return res.status(403).json({ message: "Refresh token required!!" });

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found!' });


        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken({ id: user.id });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: false,
            secure: false,
            sameSite: "Strict",
        });

        res.json({ newAccessToken });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

export const logout = async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: false,
        secure: false,
        sameSite: "Lax" // If SameSite=None was used initially, you need it here too
    });
    res.json({ message: "Logged out successfully" });

}
