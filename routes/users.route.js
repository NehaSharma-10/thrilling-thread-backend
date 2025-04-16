import express from "express";
import bodyParser from "body-parser";
import { Users } from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { sendMail } from "../utils/mailer.js";
import jwt from "jsonwebtoken";
// import cookie from "cookie";
import cookieParser from "cookie-parser";
import { getDataFromToken } from "../utils/getDataFromToken.js";
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser()); // Middleware to parse cookies

// get all users
router.get("/", async (req, res) => {
  try {
    const users = await Users.find({});
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching Users:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
// user Sign up
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // validation
    // console.log(req.body);
    const user = await Users.findOne({ email });
    if (user) {
      return res.json({ error: "User Already exists" }, { status: 400 });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new Users({
      username,
      email,
      password: hashPassword,
    });
    const savedUser = await newUser.save();
    // console.log(savedUser);

    await sendMail({ email, emailType: "VERIFY", userId: savedUser._id });
    return res.json({
      message: "User Registered Successfully",
      success: true,
      savedUser,
    });
  } catch (error) {
    res.json({
      error: error.message,
      status: 500,
    });
  }
});

// user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation
    // console.log(req.body);
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }
    console.log("User exists");
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        message: "Check your credentials! Password is wrong",
      });
    }
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    // console.log(`tokenData: ${tokenData}`);

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // console.log(`token : ${token}`);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Logged in Successfully",
        success: true,
        token: token,
      });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// user logout
router.get("/logout", async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.json({
      message: "Logout Successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

// user profile
router.get("/profile", async (req, res) => {
  try {
    // Check if cookies exist
    // console.log("Cookies received on /profile route:", req.cookies);

    const userId = await getDataFromToken(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized. Invalid token." });
    }
    const user = await Users.findOne({ _id: userId }).select("-password");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "User Found!", user });
  } catch (error) {
    console.error("Error in /profile route:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
