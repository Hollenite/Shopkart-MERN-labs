import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutCustomer } from "../services/api";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  if (["/login", "/register"].includes(location.pathname)) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutCustomer();
    } finally {
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
      </div>
      <button type="button" onClick={handleLogout} className="nav-logout">
        Logout
      </button>
    </nav>
  );
}

export default NavBar;
