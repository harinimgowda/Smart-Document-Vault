import { useTheme } from "../context/ThemeContext";

function Topbar() {
  const { dark, toggleTheme } = useTheme(); // ✅ INSIDE COMPONENT

  return (
    <div style={styles.topbar}>
      <h4>Dashboard</h4>

      <div style={styles.right}>
        {/* 🌙 THEME TOGGLE */}
        <button onClick={toggleTheme} style={styles.btn}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

        <span>👩‍💻 Admin</span>
      </div>
    </div>
  );
}

const styles = {
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  right: {
    display: "flex",
    gap: "15px",
    alignItems: "center",
  },
  btn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#6366f1",
    color: "white",
  },
};

export default Topbar;
