const mongoose = require("mongoose");

const Chapter = require("../models/Chapter");
const Novel = require("../models/Novel");

const sendNovelNotFound = (res) =>
  res.status(404).json({
    success: false,
    message: "Novel not found.",
    error: "NOVEL_NOT_FOUND",
  });

const sendChapterNotFound = (res) =>
  res.status(404).json({
    success: false,
    message: "Chapter not found.",
    error: "CHAPTER_NOT_FOUND",
  });

const sendDuplicateChapterOrder = (res) =>
  res.status(409).json({
    success: false,
    message: "chapter order already exists in this novel.",
    error: "DUPLICATE_CHAPTER_ORDER",
  });

const toChapterCreateResponse = (chapter) => ({
  id: chapter._id.toString(),
  novel_id: chapter.novel_id.toString(),
  author_id: chapter.author_id.toString(),
  title: chapter.title,
  content: chapter.content,
  order: chapter.order,
  created_at: chapter.created_at,
});

const toChapterListResponse = (chapter) => ({
  id: chapter._id.toString(),
  novel_id: chapter.novel_id.toString(),
  title: chapter.title,
  order: chapter.order,
  created_at: chapter.created_at,
});

const toChapterDetailResponse = (chapter) => ({
  id: chapter._id.toString(),
  novel_id: chapter.novel_id.toString(),
  author_id: chapter.author_id.toString(),
  title: chapter.title,
  content: chapter.content,
  order: chapter.order,
  created_at: chapter.created_at,
});

const findNovelById = async (novelId) => {
  if (!mongoose.Types.ObjectId.isValid(novelId)) {
    return null;
  }

  return Novel.findById(novelId);
};

const createChapter = async (req, res) => {
  try {
    const { novelId } = req.params;
    const novel = await findNovelById(novelId);

    if (!novel) {
      return sendNovelNotFound(res);
    }

    if (novel.author_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only the novel author can create chapters.",
        error: "NOT_AUTHOR",
      });
    }

    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    const content = typeof req.body.content === "string" ? req.body.content : "";
    const order = req.body.order;

    if (!title || !content || typeof order !== "number" || Number.isNaN(order)) {
      return res.status(400).json({
        success: false,
        message: "title, content, and order are required.",
        error: "VALIDATION_ERROR",
      });
    }

    const existingChapter = await Chapter.findOne({
      novel_id: novel._id,
      order,
    });

    if (existingChapter) {
      return sendDuplicateChapterOrder(res);
    }

    const chapter = await Chapter.create({
      novel_id: novel._id,
      author_id: req.user.id,
      title,
      content,
      order,
    });

    return res.status(201).json({
      success: true,
      message: "Chapter created successfully.",
      data: {
        chapter: toChapterCreateResponse(chapter),
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return sendDuplicateChapterOrder(res);
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: "INTERNAL_SERVER_ERROR",
    });
  }
};

const getChaptersByNovelId = async (req, res) => {
  try {
    const { novelId } = req.params;
    const novel = await findNovelById(novelId);

    if (!novel) {
      return sendNovelNotFound(res);
    }

    const chapters = await Chapter.find({ novel_id: novel._id }).sort({ order: 1 });

    return res.status(200).json({
      success: true,
      message: "Chapter list fetched successfully.",
      data: {
        chapters: chapters.map(toChapterListResponse),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: "INTERNAL_SERVER_ERROR",
    });
  }
};

const getChapterById = async (req, res) => {
  try {
    const { chapterId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(chapterId)) {
      return sendChapterNotFound(res);
    }

    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return sendChapterNotFound(res);
    }

    return res.status(200).json({
      success: true,
      message: "Chapter detail fetched successfully.",
      data: {
        chapter: toChapterDetailResponse(chapter),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: "INTERNAL_SERVER_ERROR",
    });
  }
};

module.exports = {
  createChapter,
  getChapterById,
  getChaptersByNovelId,
};
