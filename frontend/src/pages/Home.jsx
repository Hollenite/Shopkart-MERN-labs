import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { changePassword, getMe } from "../services/api";

function Home() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await getMe();
        setCustomer(response.data.customer || response.data);
      } catch (requestError) {
        if (requestError.response?.status === 401 || requestError.response?.status === 403) {
          navigate("/login", { replace: true });
        } else {
          setError("Unable to load customer details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [navigate]);

  const handlePasswordChange = (event) => {
    setPasswordForm({ ...passwordForm, [event.target.name]: event.target.value });
    setPasswordError("");
    setPasswordMessage("");
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      setPasswordError("Old password and new password are required");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(passwordForm);
      setPasswordMessage("Password changed successfully");
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (requestError) {
      setPasswordError(
        requestError.response?.data?.message || "Unable to change password",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <main className="shop-main">
        <div className="page-status">
          <div className="status-icon">⏳</div>
          <h1>Loading your profile...</h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="shop-main">
        <div className="page-status">
          <div className="status-icon">!</div>
          <h1>Something went wrong.</h1>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="shop-main">
      <section className="hero-card">
        <p className="eyebrow">Good to see you</p>
        <h1>
          Welcome back,
          <br />
          {customer.fullName}.
        </h1>
        <p>Your saved finds and next favorite thing are only a tap away.</p>
      </section>
      <section className="content-card">
        <p className="eyebrow">Your profile</p>
        <h2>{customer.fullName}</h2>
        <p className="order-meta">{customer.email}</p>
        <p className="order-meta">{customer.phone}</p>
        <div className="card-actions" style={{ maxWidth: "360px" }}>
          <Link to="/products" className="button-primary">
            Browse products
          </Link>
          <Link to="/wishlist" className="button-secondary">
            Open wishlist
          </Link>
        </div>
      </section>
      <section className="content-card" style={{ marginTop: "1.25rem", maxWidth: "28rem" }}>
        <h2>Change password</h2>
        <form onSubmit={handlePasswordSubmit}>
          {passwordError && <p className="error">{passwordError}</p>}
          {passwordMessage && <p className="success">{passwordMessage}</p>}
          <label>
            Old password
            <input
              name="oldPassword"
              type="password"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
            />
          </label>
          <label>
            New password
            <input
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
            />
          </label>
          <button type="submit" disabled={savingPassword}>
            {savingPassword ? "Saving..." : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default Home;
