const express = require("express");

const {
  createNovel,
  getNovelById,
  getNovels,
} = require("../controllers/novelController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createNovel);
router.get("/", getNovels);
router.get("/:novelId", getNovelById);

module.exports = router;
