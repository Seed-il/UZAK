import { useEffect, useState } from "react";

import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import NovelCard from "../components/NovelCard";
import { getNovels } from "../api/novelApi";

function NovelListPage() {
  const [novels, setNovels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadNovels = async () => {
      try {
        const response = await getNovels({ page: 1, limit: 10 });
        const responseData = response.data?.data;
        const novelList = Array.isArray(responseData?.novels)
          ? responseData.novels
          : [];

        if (isMounted) {
          setNovels(novelList);
          setErrorMessage("");
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message || "Failed to load novels.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadNovels();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="page-layout">
      <div className="list-page-header">
        <p className="eyebrow">Novels</p>
        <h1>Novel List</h1>
        <p className="summary">Published stories from UZAK writers.</p>
      </div>

      {isLoading && <Loading message="작품 목록을 불러오는 중입니다..." />}

      {!isLoading && errorMessage && <ErrorMessage message={errorMessage} />}

      {!isLoading && !errorMessage && novels.length === 0 && (
        <EmptyState
          title="공개된 작품이 없습니다"
          message="새로운 작품이 공개되면 이곳에 표시됩니다."
        />
      )}

      {!isLoading && !errorMessage && novels.length > 0 && (
        <div className="novel-grid">
          {novels.map((novel) => (
            <NovelCard key={novel.id || novel._id} novel={novel} />
          ))}
        </div>
      )}
    </section>
  );
}

export default NovelListPage;
