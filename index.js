import express from "express";
import { connectDB } from "./config/db.js";
import { Products } from "./models/products.model.js";
// import { Products } from "./models/products.model";
const app = express();
const PORT = 5000;
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const products = await Products.find({});
    res.status(400).json({
      success: true,
      message: "Product added successfully",
      data: products,
    });
  } catch (error) {
    console.error(error);
  }
});

app.post("/", async (req, res) => {
  const product = req.body;
  const newProduct = new Products(product);
  console.log(newProduct);

  try {
    await newProduct.save();
    res.status(200).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (err) {
    console.error("Error in entering task", err);
    res.status(500).send({ success: false, message: "Error in Error" });
  }
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening on this ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error in database");
    console.error(err);
  });
