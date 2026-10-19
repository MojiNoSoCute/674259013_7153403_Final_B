import { Router } from "express";
import { createNews ,getAllNews, getNewsById, getNewsByCategory, updateNews, deleteNews } from "../controller/newsController.js";

const newsRouter = Router();

newsRouter.post("/", createNews);
newsRouter.get("/", getAllNews);
newsRouter.get("/:id", getNewsById);
newsRouter.get("/category/:category", getNewsByCategory);
newsRouter.put("/:id", updateNews);
newsRouter.delete("/:id", deleteNews);

export default newsRouter;
