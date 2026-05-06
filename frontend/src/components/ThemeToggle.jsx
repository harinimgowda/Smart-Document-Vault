import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();

  return (
    <div style={styles.wrapper} onClick={toggleTheme}>
      <div
        style={{
          ...styles.toggle,
          justifyContent: dark ? "flex-end" : "flex-start",
        }}
      >
        <div style={styles.circle}>{dark ? "🌙" : "☀️"}</div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    cursor: "pointer",
  },
  toggle: {
    width: "60px",
    height: "30px",
    borderRadius: "50px",
    background: "linear-gradient(135deg, #6366f1, #06b6d4)",
    display: "flex",
    alignItems: "center",
    padding: "5px",
    transition: "0.3s",
  },
  circle: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
  },
};

export default ThemeToggle;
