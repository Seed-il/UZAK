const mongoose = require("mongoose");

const Novel = require("../models/Novel");

const toAuthorResponse = (author) => {
  if (!author || !author._id) {
    return null;
  }

  return {
    id: author._id.toString(),
    nickname: author.nickname,
  };
};

const toNovelCreateResponse = (novel) => ({
  id: novel._id.toString(),
  title: novel.title,
  description: novel.description,
  author_id: novel.author_id.toString(),
  is_published: novel.is_published,
  created_at: novel.created_at,
});

const toNovelListResponse = (novel) => ({
  id: novel._id.toString(),
  title: novel.title,
  description: novel.description,
  author: toAuthorResponse(novel.author_id),
  is_published: novel.is_published,
  created_at: novel.created_at,
});

const toNovelDetailResponse = (novel) => ({
  id: novel._id.toString(),
  title: novel.title,
  description: novel.description,
  author: toAuthorResponse(novel.author_id),
  is_published: novel.is_published,
  created_at: novel.created_at,
});

const sendNovelNotFound = (res) =>
  res.status(404).json({
    success: false,
    message: "Novel not found.",
    error: "NOVEL_NOT_FOUND",
  });

const createNovel = async (req, res) => {
  try {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    const description =
      typeof req.body.description === "string" ? req.body.description.trim() : undefined;
    const isPublished =
      typeof req.body.is_published === "boolean" ? req.body.is_published : false;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "title is required.",
        error: "VALIDATION_ERROR",
      });
    }

    const novel = await Novel.create({
      title,
      description,
      author_id: req.user.id,
      is_published: isPublished,
    });

    return res.status(201).json({
      success: true,
      message: "Novel created successfully.",
      data: {
        novel: toNovelCreateResponse(novel),
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

const getNovels = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(Number.parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    const [novels, total] = await Promise.all([
      Novel.find({ is_published: true })
        .populate("author_id", "nickname")
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit),
      Novel.countDocuments({ is_published: true }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Novel list fetched successfully.",
      data: {
        novels: novels.map(toNovelListResponse),
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
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

const getNovelById = async (req, res) => {
  try {
    const { novelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(novelId)) {
      return sendNovelNotFound(res);
    }

    const novel = await Novel.findById(novelId).populate("author_id", "nickname");

    if (!novel) {
      return sendNovelNotFound(res);
    }

    return res.status(200).json({
      success: true,
      message: "Novel detail fetched successfully.",
      data: {
        novel: toNovelDetailResponse(novel),
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
  createNovel,
  getNovelById,
  getNovels,
};
