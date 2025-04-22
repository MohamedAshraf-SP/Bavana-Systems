import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import User from "../models/user.js"
import { generateRefreshToken, generateAccessToken } from "../utils/jwt.js"
import { UserObj } from "../utils/generators/validations.js"


export const register = async (req, res) => {
    try {
        const userObj = UserObj.parse(req.body);

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ userName }, { email }, { phone }] });


        if (existingUser.userName == userName) return res.status(400).json({ message: 'User name already exists.' });
        if (existingUser.userName == email) return res.status(400).json({ message: 'Email already exists.' });
        if (existingUser.phone == phone) return res.status(400).json({ message: 'Phone already exists.' });
        if (existingUser) return res.status(400).json({ message: 'User already exists.' });

        // Hash password


        const hashedPassword = await bcrypt.hash(password, 10);


        userObj.password = hashedPassword; // Set the hashed password
        userObj.userRole = "client"; // Set default role to user
        // Create user
        const newUser = new User(userObj)

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully; You can login now.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
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
