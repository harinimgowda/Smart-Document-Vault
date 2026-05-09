import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

function Topbar() {
  const { dark, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
    setShowLanguageDropdown(false);
  };

  const toggleLanguageDropdown = () => {
    setShowLanguageDropdown(!showLanguageDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={styles.topbar}>
      <h4>{t("dashboard")}</h4>

      <div style={styles.right}>
        {/* 🌐 LANGUAGE SELECTOR */}
        <div style={styles.dropdown} ref={dropdownRef}>
          <button onClick={toggleLanguageDropdown} style={styles.languageBtn}>
            🌐 {t("language")}
          </button>
          {showLanguageDropdown && (
            <div style={styles.dropdownMenu}>
              <button
                style={styles.dropdownItem}
                onClick={() => handleLanguageChange("en")}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                🇺🇸 {t("english")}
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => handleLanguageChange("kn")}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                🇮🇳 {t("kannada")}
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => handleLanguageChange("te")}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                🇮🇳 {t("telugu")}
              </button>
              <button
                style={styles.dropdownItem}
                onClick={() => handleLanguageChange("hi")}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                🇮🇳 {t("hindi")}
              </button>
            </div>
          )}
        </div>

        {/* 🌙 THEME TOGGLE */}
        <button onClick={toggleTheme} style={styles.btn}>
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* 👤 USER ROLE */}
        <span style={styles.roleBadge}>{role}</span>

        {/* 🚪 LOGOUT */}
        <button onClick={logout} style={styles.logoutBtn}>
          {t("logout")}
        </button>
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
  languageBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #6366f1",
    cursor: "pointer",
    background: "transparent",
    color: "#6366f1",
    position: "relative",
  },
  dropdown: {
    position: "relative",
  },
  dropdownMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    zIndex: 1000,
    minWidth: "150px",
  },
  dropdownItem: {
    display: "block",
    width: "100%",
    padding: "8px 16px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  roleBadge: {
    background: "#22c55e",
    color: "white",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  logoutBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "#ef4444",
    color: "white",
  },
};

export default Topbar;
