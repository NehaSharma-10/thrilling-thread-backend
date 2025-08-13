import { Router } from "express";
import { Users } from "../models/users.model.js";
import { Products } from "../models/products.model.js";
import { getDataFromToken } from "../utils/getDataFromToken.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
const router = Router();
router.use(cookieParser());

router.get("/", (req, res) => {
  res.send("Get cart get id");
});

router.post("/carts", async (req, res) => {
  try {
    const { productId } = req.body;
    // console.log("product ID: ", productId);
    const userId = getDataFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // validating Product
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(401).json({ error: "Product Not Found!" });
    }
    console.log(product);

    // validating product
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(401).json({ error: "User Not Found!" });
    }
    // console.log(user);

    // product already in cart
    const { cart } = user;
    const alreadyInCart = cart.includes(productId);
    console.log(alreadyInCart);
    if (alreadyInCart) {
      alreadyInCart.quantity += 1;
    } else {
      user.cart.push({ product: product, quantity: 1 });
    }
    await user.save();
    res.status(200).json({ message: "Product added to cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/cart/:id", async (req, res) => {
  const { id } = req.body;
   

});
export default router;
