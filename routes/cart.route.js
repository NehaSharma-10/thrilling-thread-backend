import { Router } from "express";
import { Users } from "../models/users.model.js";
import { Products } from "../models/products.model.js";
import { getDataFromToken } from "../utils/getDataFromToken.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const router = Router();
router.use(cookieParser());
router.get("/", (req, res) => {
  res.send("get cart get id");
});

router.post("/carts", async (req, res) => {
  try {
    const { productId } = req.body;
    const token = await req.cookies.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    // const user = getDataFromToken(decodedToken);
    console.log(decodedToken);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Token missing." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
