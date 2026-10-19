import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import newsRouter from "./router/newsRouter.js";
dotenv.config();

const PORT = process.env.PORT || process.env.BACKEND_PORT
const app = express();
app.use(cors());
app.use(express.json());

connectDB();
app.get("/", (req, res) => {
  return res
    .status(200)
    .send("<h>Welcome to Restful API for News Management App</h>");
});
app.use("/api/news", newsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on: http://localhost:${PORT}`);
});