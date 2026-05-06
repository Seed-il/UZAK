import { useNavigate } from "react-router-dom";

function formatDate(value) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString();
}

function NovelCard({ novel }) {
  const navigate = useNavigate();
  const novelId = novel.id || novel._id;
  const authorName = novel.author?.nickname || "Unknown author";

  return (
    <button
      className="novel-card"
      type="button"
      onClick={() => navigate(`/novels/${novelId}`)}
    >
      <span className="novel-card-kicker">Novel</span>
      <span className="novel-card-title">{novel.title}</span>
      <span className="novel-description">
        {novel.description || "No description."}
      </span>
      <span className="novel-meta">
        <span>{authorName}</span>
        <span>{formatDate(novel.created_at)}</span>
      </span>
    </button>
  );
}

export default NovelCard;
