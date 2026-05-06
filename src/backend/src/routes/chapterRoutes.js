const express = require("express");

const {
  createChapter,
  getChapterById,
  getChaptersByNovelId,
} = require("../controllers/chapterController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/novels/:novelId/chapters", authMiddleware, createChapter);
router.get("/novels/:novelId/chapters", getChaptersByNovelId);
router.get("/chapters/:chapterId", getChapterById);

module.exports = router;
