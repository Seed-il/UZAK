import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import { getChapter } from "../api/chapterApi";

function ChapterReadPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadChapter = async () => {
      try {
        const response = await getChapter(chapterId);
        const chapterData = response.data?.data?.chapter || null;

        if (isMounted) {
          setChapter(chapterData);
          setErrorMessage("");
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message || "Failed to load chapter.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadChapter();

    return () => {
      isMounted = false;
    };
  }, [chapterId]);

  const formatDate = (value) => {
    if (!value) {
      return "Unknown date";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString();
  };

  const novelId = chapter?.novel_id || chapter?.novelId;

  return (
    <section className="page-layout chapter-read-page">
      {isLoading && <Loading message="회차를 불러오는 중입니다..." />}

      {!isLoading && errorMessage && <ErrorMessage message={errorMessage} />}

      {!isLoading && !errorMessage && !chapter && (
        <EmptyState
          title="회차를 찾을 수 없습니다"
          message="회차가 삭제되었거나 잘못된 주소일 수 있습니다."
        />
      )}

      {!isLoading && !errorMessage && chapter && (
        <article className="chapter-reader">
          <p className="eyebrow">Chapter</p>
          <h1>{chapter.title}</h1>
          <div className="novel-meta chapter-reader-meta">
            <span>Created {formatDate(chapter.created_at)}</span>
          </div>

          <div className="chapter-content">{chapter.content}</div>

          {novelId && (
            <button
              className="primary-button"
              type="button"
              onClick={() => navigate(`/novels/${novelId}`)}
            >
              Back to Novel
            </button>
          )}
        </article>
      )}
    </section>
  );
}

export default ChapterReadPage;
