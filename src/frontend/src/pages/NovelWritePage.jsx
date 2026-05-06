import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createNovel } from "../api/novelApi";

function NovelWritePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    is_published: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!form.title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createNovel({
        title: form.title.trim(),
        description: form.description.trim(),
        is_published: form.is_published,
      });
      const createdNovel = response.data?.data?.novel;
      const createdNovelId = createdNovel?.id || createdNovel?._id;

      navigate(createdNovelId ? `/novels/${createdNovelId}` : "/novels");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to create novel.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-layout write-page">
      <div className="write-page-header">
        <p className="eyebrow">Write Novel</p>
        <h1>Start a new story</h1>
        <p className="summary">
          Add the core information readers will see before they open your novel.
        </p>
      </div>

      <form className="auth-form write-form" onSubmit={handleSubmit}>
        <label className="form-field" htmlFor="title">
          <span className="field-label-row">
            <span>Title</span>
            <span className="field-count">{form.title.length} characters</span>
          </span>
          <input
            id="title"
            name="title"
            onChange={handleChange}
            placeholder="A title readers can remember"
            required
            type="text"
            value={form.title}
          />
          <span className="helper-text">
            Use a clear title. You can refine it later when editing is added.
          </span>
        </label>

        <label className="form-field" htmlFor="description">
          Description
          <textarea
            className="description-textarea"
            id="description"
            name="description"
            onChange={handleChange}
            placeholder="Introduce the world, premise, or mood of your story."
            rows="5"
            value={form.description}
          />
          <span className="helper-text">
            A short synopsis helps readers decide where to begin.
          </span>
        </label>

        <div className="checkbox-panel">
          <label className="checkbox-field" htmlFor="is_published">
            <input
              checked={form.is_published}
              id="is_published"
              name="is_published"
              onChange={handleChange}
              type="checkbox"
            />
            Publish now
          </label>
          <p className="helper-text">
            Published novels can appear in public lists. Leave it off to keep a
            draft private.
          </p>
        </div>

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
            onClick={() => navigate("/novels")}
          >
            Cancel
          </button>
          <button
            className="primary-button"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating..." : "Create Novel"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default NovelWritePage;
