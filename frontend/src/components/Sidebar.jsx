import { FaHome, FaFile, FaSearch, FaUpload } from "react-icons/fa";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 className="gradient-text">DocuVault</h2>

      <nav>
        <NavItem to="/dashboard" icon={<FaHome />} text="Dashboard" />
        <NavItem to="/documents" icon={<FaFile />} text="Documents" />
        <NavItem to="/search" icon={<FaSearch />} text="Search" />
        <NavItem to="/upload" icon={<FaUpload />} text="Upload" />
      </nav>
    </div>
  );
}

const NavItem = ({ to, icon, text }) => (
  <Link to={to} style={styles.link}>
    {icon} {text}
  </Link>
);

const styles = {
  sidebar: {
    width: "230px",
    height: "100vh",
    padding: "25px",
    position: "fixed",
    background: "rgba(15,23,42,0.8)",
    backdropFilter: "blur(10px)",
    borderRight: "1px solid rgba(255,255,255,0.1)",
  },
  link: {
    display: "flex",
    gap: "10px",
    padding: "12px",
    marginTop: "10px",
    color: "#cbd5f5",
    textDecoration: "none",
    borderRadius: "10px",
  },
};

export default Sidebar;
