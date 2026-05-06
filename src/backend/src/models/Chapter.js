const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    novel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Novel",
      required: true,
    },
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

chapterSchema.index({ novel_id: 1, order: 1 }, { unique: true });

module.exports = mongoose.model("Chapter", chapterSchema);
