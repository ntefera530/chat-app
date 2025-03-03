import jwt from "jsonwebtoken";

///generates a web token that lasts 7 days to id users
export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //miliseconds
        httpOnly: true, //prevents XSS attacks cross-site scripting attacks
        sameSite: "strict", // CRF attacks cross site requests forgery attacks
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
};