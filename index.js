import express from "express";
import { connectDB } from "./dbConfig/db.js";
import productRoutes from "./routes/products.route.js";
import UserRoutes from "./routes/users.route.js";
import VerifyUser from "./routes/verify.email.route.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = 5000;

// ✅ Apply CORS middleware BEFORE routes
app.use(
  cors({
    origin: "https://thrillingthread.vercel.app",
    credentials: true,
  })
);

// ✅ Handle preflight requests
app.options(
  "*",
  cors({
    origin: "https://thrillingthread.vercel.app",
    credentials: true,
  })
);

// ✅ Body parser and cookie middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes should come after all middleware
app.use("/api/products", productRoutes);
app.use("/api/users", UserRoutes);
app.use("/", VerifyUser);

// ✅ Connect DB and Start server
connectDB()
  .then(() => {
    console.log(`Database Connected Successfully`);
  })
  .catch((err) => {
    console.error("Database Connection Error:", err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.DOMAIN}`);
});
