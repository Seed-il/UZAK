import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import NovelCard from "../components/NovelCard";
import { getNovels } from "../api/novelApi";

const features = [
  {
    title: "웹소설 읽기",
    description: "공개된 작품과 회차를 간단한 흐름으로 찾아 읽을 수 있습니다.",
  },
  {
    title: "작품 연재하기",
    description: "작가 계정으로 작품을 만들고 회차를 이어서 발행할 수 있습니다.",
  },
  {
    title: "작가와 독자가 만나는 공간",
    description: "새로운 이야기를 발견하고 다음 회차를 기다리는 독자를 만납니다.",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const [recentNovels, setRecentNovels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadRecentNovels = async () => {
      try {
        const response = await getNovels({
          page: 1,
          limit: 3,
          sort: "latest",
        });
        const novelList = Array.isArray(response.data?.data?.novels)
          ? response.data.data.novels
          : [];

        if (isMounted) {
          setRecentNovels(novelList.slice(0, 3));
          setErrorMessage("");
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            error.response?.data?.message || "Failed to load recent novels.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadRecentNovels();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleWriteClick = () => {
    navigate(localStorage.getItem("token") ? "/write/novel" : "/login");
  };

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="page-layout home-hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">UZAK / 우작</p>
            <h1>우리는 작가다</h1>
            <p className="summary">
              누구나 웹소설을 읽고 연재할 수 있는 공간
            </p>
            <div className="hero-actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => navigate("/novels")}
              >
                작품 보러가기
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={handleWriteClick}
              >
                작품 작성하기
              </button>
            </div>
          </div>

          <div className="hero-showcase" aria-hidden="true">
            <div className="showcase-page showcase-page-primary">
              <span>UZAK</span>
              <strong>Chapter 01</strong>
              <p>Write the next page.</p>
            </div>
            <div className="showcase-page showcase-page-secondary">
              <span>READ</span>
              <strong>New Stories</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="page-layout landing-section">
        <div className="section-heading">
          <p className="eyebrow">Features</p>
          <h2>읽고, 쓰고, 이어지는 이야기</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-layout landing-section">
        <div className="section-heading section-heading-row">
          <div>
            <p className="eyebrow">Recent Novels</p>
            <h2>최신 공개 작품</h2>
          </div>
          <button
            className="secondary-button"
            type="button"
            onClick={() => navigate("/novels")}
          >
            전체 보기
          </button>
        </div>

        {isLoading && <Loading message="최신 작품을 불러오는 중입니다..." />}

        {!isLoading && errorMessage && <ErrorMessage message={errorMessage} />}

        {!isLoading && !errorMessage && recentNovels.length === 0 && (
          <EmptyState
            title="아직 공개된 작품이 없습니다"
            message="첫 공개 작품이 등록되면 이곳에 표시됩니다."
          />
        )}

        {!isLoading && !errorMessage && recentNovels.length > 0 && (
          <div className="novel-grid recent-novel-grid">
            {recentNovels.map((novel) => (
              <NovelCard key={novel.id || novel._id} novel={novel} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
