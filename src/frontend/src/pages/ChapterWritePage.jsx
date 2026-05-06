import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { createChapter } from "../api/chapterApi";

function ChapterWritePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    title: "",
    content: "",
    order: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const novelId = useMemo(() => {
    return (
      searchParams.get("novelId") ||
      searchParams.get("novel_id") ||
      location.state?.novelId ||
      location.state?.novel_id ||
      ""
    );
  }, [location.state, searchParams]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (!novelId) {
      setErrorMessage("Novel ID is required. Please choose a novel first.");
    }
  }, [novelId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const trimmedTitle = form.title.trim();
    const trimmedContent = form.content.trim();
    const parsedOrder = Number(form.order);

    if (!novelId) {
      setErrorMessage("Novel ID is required. Please choose a novel first.");
      return;
    }

    if (!trimmedTitle || !trimmedContent || !form.order) {
      setErrorMessage("Title, content, and order are required.");
      return;
    }

    if (!Number.isFinite(parsedOrder)) {
      setErrorMessage("Order must be a number.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createChapter(novelId, {
        title: trimmedTitle,
        content: trimmedContent,
        order: parsedOrder,
      });

      navigate(`/novels/${novelId}`);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to create chapter.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-layout write-page write-page-wide">
      <div className="write-page-header">
        <p className="eyebrow">Write Chapter</p>
        <h1>Add the next chapter</h1>
        <p className="summary">
          Give readers a clear title, the full chapter text, and the order it
          should appear in.
        </p>
      </div>

      <form className="auth-form write-form" onSubmit={handleSubmit}>
        <label className="form-field" htmlFor="title">
          Title
          <input
            id="title"
            name="title"
            onChange={handleChange}
            placeholder="Chapter title"
            required
            type="text"
            value={form.title}
          />
          <span className="helper-text">
            Keep it short enough to scan in the chapter list.
          </span>
        </label>

        <label className="form-field" htmlFor="content">
          Content
          <textarea
            className="chapter-content-textarea"
            id="content"
            name="content"
            onChange={handleChange}
            placeholder="Write the full chapter here."
            required
            rows="10"
            value={form.content}
          />
          <span className="helper-text">
            Longer text is welcome. Line breaks are preserved on the read page.
          </span>
        </label>

        <label className="form-field" htmlFor="order">
          Order
          <input
            id="order"
            min="1"
            name="order"
            onChange={handleChange}
            placeholder="1"
            required
            type="number"
            value={form.order}
          />
          <span className="helper-text">
            Enter the chapter sequence number. It must be unique in this novel.
          </span>
        </label>

        {errorMessage && (
          <p className="form-error" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="form-actions">
          <button
            className="secondary-button"
            disabled={isSubmitting}
            type="button"
            onClick={() => navigate(novelId ? `/novels/${novelId}` : "/novels")}
          >
            Cancel
          </button>
          <button
            className="primary-button"
            disabled={isSubmitting || !novelId}
            type="submit"
          >
            {isSubmitting ? "Creating..." : "Create Chapter"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ChapterWritePage;
