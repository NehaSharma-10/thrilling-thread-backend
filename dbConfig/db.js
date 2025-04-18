import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log("Already connected to the database.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "thrilling-thread",
    });

    mongoose.connection.once("connection", () => {
      console.log("DB Connected Successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("DB Connection error:", err);
      process.exit(1);
    });

    isConnected = true; // Mark as connected
  } catch (error) {
    console.error("Something went wrong in connecting database:", error);
  }
};
