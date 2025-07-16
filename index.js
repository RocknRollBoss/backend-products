import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";
const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/api/auth", userRoutes);
app.use("/api/products", productRoutes);

function start() {
  try {
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server work");
    });
  } catch (error) {
    console.log("Server error");
  }
}

start();
