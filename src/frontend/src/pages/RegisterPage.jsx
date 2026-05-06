import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { register } from "../api/authApi";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
    role: "reader",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    try {
      await register(form);
      navigate("/login");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-layout form-page">
      <p className="eyebrow">Auth</p>
      <h1>Register</h1>
      <p className="summary">Create an account to read and write stories.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Email</span>
          <input
            autoComplete="email"
            name="email"
            onChange={handleChange}
            required
            type="email"
            value={form.email}
          />
        </label>

        <label className="form-field">
          <span>Password</span>
          <input
            autoComplete="new-password"
            minLength={8}
            name="password"
            onChange={handleChange}
            required
            type="password"
            value={form.password}
          />
        </label>

        <label className="form-field">
          <span>Nickname</span>
          <input
            autoComplete="nickname"
            minLength={2}
            name="nickname"
            onChange={handleChange}
            required
            type="text"
            value={form.nickname}
          />
        </label>

        <fieldset className="role-options">
          <legend>Role</legend>
          <label>
            <input
              checked={form.role === "reader"}
              name="role"
              onChange={handleChange}
              type="radio"
              value="reader"
            />
            Reader
          </label>
          <label>
            <input
              checked={form.role === "writer"}
              name="role"
              onChange={handleChange}
              type="radio"
              value="writer"
            />
            Writer
          </label>
        </fieldset>

        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </section>
  );
}

export default RegisterPage;
