import { Route, Routes } from "react-router-dom";

import Header from "./components/Header.jsx";
import ChapterReadPage from "./pages/ChapterReadPage.jsx";
import ChapterWritePage from "./pages/ChapterWritePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NovelDetailPage from "./pages/NovelDetailPage.jsx";
import NovelListPage from "./pages/NovelListPage.jsx";
import NovelWritePage from "./pages/NovelWritePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  return (
    <div className="app-shell">
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/novels" element={<NovelListPage />} />
          <Route path="/novels/:novelId" element={<NovelDetailPage />} />
          <Route path="/chapters/:chapterId" element={<ChapterReadPage />} />
          <Route path="/write/novel" element={<NovelWritePage />} />
          <Route path="/write/chapter" element={<ChapterWritePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
