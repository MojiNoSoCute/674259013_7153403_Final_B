import { Op } from "sequelize";
import News from "../model/newsModel.js";

const ALLOWED_CATEGORIES = ["การศึกษา", "เทคโนโลยี", "สังคม"];

const createNews = async (req, res, next) => {
  try {
    const { title, reporter, category, publishedDate, description, status } =
      req.body;
    if (
      !title ||
      !reporter ||
      !category ||
      !description ||
      status === undefined
    ) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: "หมวดหมู่ต้องเป็น 'การศึกษา', 'เทคโนโลยี' หรือ 'สังคม' เท่านั้น",
      });
    }

    const newNews = await News.create({
      title,
      reporter,
      category,
      publishedDate: publishedDate || new Date(),
      description,
      status,
    });
    return res.status(201).json(newNews);
  } catch (error) {
    return next(error);
  }
};

const getAllNews = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const where = {};

    // รองรับ case-insensitive search ทั้งบน PostgreSQL (iLike) และ Dialect อื่น (like)
    const isPostgres = News.sequelize?.getDialect?.() === "postgres";
    const searchOp = isPostgres ? Op.iLike : Op.like;

    // ค้นหาจากชื่อหรือหัวข้อด้วยคำค้นบางส่วน
    if (search && search.trim() !== "") {
      where.title = { [searchOp]: `%${search.trim()}%` };
    }

    // กรองหมวดหมู่ (ถ้าไม่ได้เลือก 'ทั้งหมด')
    if (category && category.trim() !== "" && category !== "ทั้งหมด") {
      where.category = category.trim();
    }

    const allNews = await News.findAll({
      where,
      order: [["id", "DESC"]],
    });
    return res.status(200).json(allNews);
  } catch (error) {
    return next(error);
  }
};

const getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "News id is required" });
    }
    const IdNews = await News.findByPk(id);
    if (!IdNews) {
      return res.status(404).json({ message: "News not found" });
    }
    return res.status(200).json(IdNews);
  } catch (error) {
    return next(error);
  }
};

const getNewsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    const newsList = await News.findAll({
      where: { category },
      order: [["id", "DESC"]],
    });
    if (!newsList || newsList.length === 0) {
      return res.status(404).json({ message: "No news found in this category" });
    }
    return res.status(200).json(newsList);
  } catch (error) {
    return next(error);
  }
};

const updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "News id is required" });
    }
    const { title, reporter, category, publishedDate, description, status } =
      req.body;
    if (
      !title ||
      !reporter ||
      !category ||
      !description ||
      status === undefined
    ) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    if (!ALLOWED_CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: "หมวดหมู่ต้องเป็น 'การศึกษา', 'เทคโนโลยี' หรือ 'สังคม' เท่านั้น",
      });
    }

    const IdNews = await News.findByPk(id);
    if (!IdNews) {
      return res.status(404).json({ message: "News not found" });
    }
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (reporter !== undefined) updates.reporter = reporter;
    if (category !== undefined) updates.category = category;
    if (publishedDate !== undefined) updates.publishedDate = publishedDate;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;

    await IdNews.update(updates);
    return res.status(200).json(IdNews);
  } catch (error) {
    return next(error);
  }
};

const deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "News id is required" });
    }

    const IdNews = await News.findByPk(id);
    if (!IdNews) {
      return res.status(404).json({ message: "News not found" });
    }

    await IdNews.destroy();
    return res.status(200).json({
      message: "News is deleted successfully",
      deleteNews: IdNews,
    });
  } catch (error) {
    return next(error);
  }
};

export {
  createNews,
  getAllNews,
  getNewsById,
  getNewsByCategory,
  updateNews,
  deleteNews,
};
