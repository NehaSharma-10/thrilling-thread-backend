import express from "express";
import { connectDB } from "./config/db.js";
import { Products } from "./models/products.model.js";
import cors from "cors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products", // Cloudinary folder name
    format: async () => "png", // or 'jpeg', 'jpg'
    public_id: (req, file) => file.originalname.split(".")[0], // Filename without extension
  },
});

const upload = multer({ storage });

app.get("/", async (req, res) => {
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

app.post("/", upload.array("productImages", 5), async (req, res) => {
  try {
    const product = req.body;
    if (!Array.isArray(req.body.productSizes)) {
      req.body.productSizes = req.body.productSizes
        ? [req.body.productSizes]
        : [];
    }

    // Extract Cloudinary URLs from uploaded files
    const imageUrls = req.files.map((file) => file.path);

    const newProduct = new Products({
      ...product,
      productImages: imageUrls,
    });

    console.log("New Product:", newProduct);
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

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database Connection Error:", err);
  });
