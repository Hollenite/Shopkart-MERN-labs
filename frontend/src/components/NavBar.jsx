import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutCustomer } from "../services/api";
import { useCart } from "../context/useCart";
import { useTheme } from "../context/useTheme";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, clearCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  if (["/login", "/register", "/signup"].includes(location.pathname)) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutCustomer();
    } finally {
      clearCart();
      navigate("/login");
    }
  };

  return (
    <nav className="shop-nav">
      <Link to="/home" className="brand">
        ShopKart
      </Link>
      <div className="nav-links">
        <Link to="/home" className={isActive("/home") || location.pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link to="/products" className={isActive("/products") ? "active" : ""}>
          Products
        </Link>
        <Link to="/wishlist" className={isActive("/wishlist") ? "active" : ""}>
          Wishlist
        </Link>
        <Link to="/cart" className={isActive("/cart") ? "active" : ""}>
          Cart <span className="cart-badge">{cartCount}</span>
        </Link>
        <Link to="/orders" className={isActive("/orders") ? "active" : ""}>
          Orders
        </Link>
      </div>
      <div className="nav-actions">
        <button
          type="button"
          className="icon-button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
        <button type="button" onClick={handleLogout} className="nav-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
