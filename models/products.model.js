import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  productCategory: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  productImages: {
    type: [String],
    required: true,
  },
  productDescription: {
    type: String,
    required: true,
  },
  productSizes: {
    type: [String], // Array of size strings
    required: true,
  },
  productInStock: {
    type: Boolean,
    default: true,
  },
  stockQuantity: {
    type: Number,
    default: 0, // Default to 0 if not provided
  },
});

export const Products = mongoose.model("Products", ProductSchema);
