import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginCustomer } from "../services/api";
import { useCart } from "../context/useCart";

function Login() {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: "", form: "" });
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await loginCustomer(form);
      await refreshCart();
      navigate("/home");
    } catch (error) {
      setErrors({
        form:
          error.response?.data?.message ||
          "Cannot reach the server. Check VITE_API_URL and Render CLIENT_URL.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-stack">
        <h1 className="auth-brand">ShopKart</h1>
        <p className="auth-tagline">Sign in to pick up where you left off.</p>
        <form className="card" onSubmit={handleSubmit}>
          <h1>Login</h1>
          {errors.form && <p className="error">{errors.form}</p>}
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
          <p>
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
