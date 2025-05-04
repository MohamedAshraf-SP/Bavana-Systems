import jwt from "jsonwebtoken"


export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.userRole, name: user.userName },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_VALIDITY_PERIOD }
    ) 
}


export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        });
};

export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};