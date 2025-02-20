import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
  name: {
    type: String,
  },
  category: {
    type: String,
  },
  price: {
    type: String,
  },
  images: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
  },
  sizes: {
    type: Array,
  },

  inStock: {
    type: Boolean,
  },
  StockQuantity: {
    type: Number,
  },
});

export const Products = mongoose.model("Products", ProductSchema);
