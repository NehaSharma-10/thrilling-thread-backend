import jwt from "jsonwebtoken";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
export const getDataFromToken = (req) => {
  try {
    const token = req.cookies.token || ""; // Access cookie directly
    const cookie = req.cookies;
    console.log("Token : ", token);
    console.log("Cookie: ", cookie);
    if (!token) {
      throw new Error("No token found");
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    return decodedToken.id; // This is the token payload
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
};
