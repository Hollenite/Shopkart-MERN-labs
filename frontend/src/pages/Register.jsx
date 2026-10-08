import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomer } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: "", form: "" });
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6)
      next.password = "Password must be at least 6 characters";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await registerCustomer(form);
      navigate("/login");
    } catch (error) {
      setErrors({
        form: error.response?.data?.message || "Registration failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="auth-stack">
        <h1 className="auth-brand">ShopKart</h1>
        <p className="auth-tagline">Create an account to start shopping.</p>
        <form className="card" onSubmit={handleSubmit}>
          <h1>Create account</h1>
          {errors.form && <p className="error">{errors.form}</p>}
          <label>
            Full Name
            <input name="fullName" value={form.fullName} onChange={handleChange} />
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </label>
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
          <label>
            Phone Number
            <input name="phone" value={form.phone} onChange={handleChange} />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
          </button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
