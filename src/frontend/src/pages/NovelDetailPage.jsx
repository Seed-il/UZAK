import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import { getChapters } from "../api/chapterApi";
import { getNovel } from "../api/novelApi";

function NovelDetailPage() {
  const { novelId } = useParams();
  const navigate = useNavigate();
  const [novel, setNovel] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    let isMounted = true;

    const loadNovelDetail = async () => {
      try {
        const [novelResponse, chaptersResponse] = await Promise.all([
          getNovel(novelId),
          getChapters(novelId),
        ]);

        const novelData = novelResponse.data?.data?.novel || null;
        const chapterList = Array.isArray(
          chaptersResponse.data?.data?.chapters,
        )
          ? chaptersResponse.data.data.chapters
          : [];

        if (isMounted) {
          setNovel(novelData);
          setChapters(
            [...chapterList].sort((current, next) => current.order - next.order),
          );
          setErrorMessage("");
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message || "Failed to load novel detail.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadNovelDetail();

    return () => {
      isMounted = false;
    };
  }, [novelId]);

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

  const getPublishLabel = (value) => {
    if (value === true) {
      return "Published";
    }

    if (value === false) {
      return "Private";
    }

    return null;
  };

  const publishLabel = novel ? getPublishLabel(novel.is_published) : null;

  return (
    <section className="page-layout novel-detail-page">
      {isLoading && (
        <div className="detail-state-panel">
          <p className="eyebrow">Novel Detail</p>
          <Loading message="작품 상세 정보를 불러오는 중입니다..." />
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="detail-state-panel">
          <p className="eyebrow">Novel Detail</p>
          <ErrorMessage message={errorMessage} />
        </div>
      )}

      {!isLoading && !errorMessage && novel && (
        <>
          <article className="detail-panel novel-hero-panel">
            <div className="detail-header-layout">
              <div>
                <p className="eyebrow">Novel Detail</p>
                <h1>{novel.title}</h1>
                <p className="summary">
                  {novel.description || "No description."}
                </p>
              </div>

              <div className="detail-action-panel">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => navigate("/novels")}
                >
                  Back to Novels
                </button>
                {isLoggedIn && (
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => navigate(`/write/chapter?novelId=${novelId}`)}
                  >
                    Write Chapter
                  </button>
                )}
              </div>
            </div>

            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span>Author</span>
                <strong>{novel.author?.nickname || "Unknown author"}</strong>
              </div>
              <div className="detail-info-item">
                <span>Created</span>
                <strong>{formatDate(novel.created_at)}</strong>
              </div>
              {publishLabel && (
                <div className="detail-info-item">
                  <span>Status</span>
                  <strong>{publishLabel}</strong>
                </div>
              )}
            </div>
          </article>

          <section className="chapter-section">
            <div className="section-heading section-heading-row">
              <div>
                <p className="eyebrow">Chapters</p>
                <h2>Chapter List</h2>
              </div>
              <span className="chapter-count">{chapters.length} chapters</span>
            </div>

            {chapters.length === 0 ? (
              <EmptyState
                title="아직 회차가 없습니다"
                message="작가가 회차를 추가하면 이곳에 표시됩니다."
              />
            ) : (
              <div className="chapter-list">
                {chapters.map((chapter) => {
                  const chapterId = chapter.id || chapter._id;

                  return (
                    <button
                      className="chapter-row"
                      key={chapterId}
                      type="button"
                      onClick={() => navigate(`/chapters/${chapterId}`)}
                    >
                      <span className="chapter-order">#{chapter.order}</span>
                      <span className="chapter-row-main">
                        <span className="chapter-title">{chapter.title}</span>
                        <span className="chapter-row-subtitle">
                          Read chapter
                        </span>
                      </span>
                      <span className="chapter-date">
                        {formatDate(chapter.created_at)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </section>
  );
}

export default NovelDetailPage;
