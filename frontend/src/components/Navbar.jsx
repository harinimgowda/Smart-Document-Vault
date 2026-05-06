import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { dark, toggleTheme } = useTheme();
  const { role } = useAuth();

  // active link style
  const isActive = (path) =>
    location.pathname === path
      ? "btn btn-light text-dark fw-bold"
      : "btn btn-outline-light";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* LOGO */}
        <Link className="navbar-brand fw-bold" to="/dashboard">
          SMART DOCS
        </Link>

        {/* NAV LINKS */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Link className={isActive("/dashboard")} to="/dashboard">
            Dashboard
          </Link>

          <Link className={isActive("/documents")} to="/documents">
            Documents
          </Link>

          <Link className={isActive("/search")} to="/search">
            Search
          </Link>

          <Link className={isActive("/chat")} to="/chat">
            Chat
          </Link>

          {/* Upload → admin + faculty */}
          {(role === "admin" || role === "faculty") && (
            <Link className={isActive("/upload")} to="/upload">
              Upload
            </Link>
          )}

          {/* Users → admin only */}
          {role === "admin" && (
            <Link className={isActive("/users")} to="/users">
              Users
            </Link>
          )}

          {/* Theme toggle */}
          <button
            className="btn btn-secondary"
            onClick={toggleTheme}
            title="Toggle Theme"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* Role badge */}
          <span className="badge bg-info text-dark text-uppercase">{role}</span>

          {/* Logout */}
          <button className="btn btn-danger" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
