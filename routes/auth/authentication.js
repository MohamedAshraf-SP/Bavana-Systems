import express from "express";
import {
    login,
    refreshToken,
    logout,
    register,
    forgetPassword,
    resetPassword

} from "../../controllers/auth.js";


export const authRoute = express.Router();

authRoute.post("/login", login);
authRoute.post("/register", register);
authRoute.post("/forget-password", forgetPassword);
authRoute.post("/reset-password", resetPassword);
authRoute.post("/register", register);
authRoute.post("/refreshToken", refreshToken);
authRoute.get("/logout", logout);
