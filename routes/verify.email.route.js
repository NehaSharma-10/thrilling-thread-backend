import express from "express";
import bodyParser from "body-parser";
import { Users } from "../models/users.model.js";

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

// verify user email
router.post("/verifyemail", async (req, res) => {
  try {
    const { token } = await req.body;
    // console.log(token);
    const user = await Users.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        error: "Invalid Token",
      });
    }
    // console.log(user);
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();
    return res
      .status(200)
      .json({ message: "Email Verified Successfully", success: true });
  } catch (error) {
    res.json({ error: error.message, status: 500 });
  }
});

export default router;
