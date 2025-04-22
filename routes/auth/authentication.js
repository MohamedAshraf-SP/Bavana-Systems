import express from "express";
import {
    login,
    refreshToken,
    logout,
    register

} from "../../controllers/auth.js";
import { register } from "module";

export const authRoute = express.Router();

authRoute.post("/login", login);
authRoute.post("/register", register);
authRoute.post("/refreshToken", refreshToken);
authRoute.get("/logout", logout);
