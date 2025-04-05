import express from "express";
import bodyParser from "body-parser";
import { Products } from "../models/products.model.js";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
dotenv.config();

const router = express.Router();

router.use(cors({ origin: "*" }));
router.use(express.json());
router.use(bodyParser.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const ext = file.mimetype.split("/")[1];
    return {
      folder: "products",
      format: ["png", "jpeg", "jpg", "webp"].includes(ext) ? ext : "png",
      public_id: file.originalname.split(".")[0],
    };
  },
});

const upload = multer({ storage });

// Fetch all products
router.get("/", async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// Submit a new product with images
router.post("/submit", upload.array("productImages", 5), async (req, res) => {
  try {
    const product = req.body;
    if (!Array.isArray(req.body.productSizes)) {
      req.body.productSizes = req.body.productSizes
        ? [req.body.productSizes]
        : [];
    }

    const imageUrls = req.files.map((file) => file.path);
    const newProduct = new Products({
      ...product,
      productImages: imageUrls,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (err) {
    console.error("Error in adding product:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
