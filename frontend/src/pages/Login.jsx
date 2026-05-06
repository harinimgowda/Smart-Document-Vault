import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email && !password) {
      return setError("Email and Password are required");
    }
    if (!email) return setError("Email is required");
    if (!password) return setError("Password is required");

    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      const token = response?.data?.token;

      if (!token) {
        throw new Error("Login failed. Please try again.");
      }

      login(token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back 👋</h2>
        <p className="login-sub">Login to your account</p>
        <p className="field-help">All fields are required.</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="login-field">
            <input
              type="email"
              required
              placeholder=" "
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          {/* PASSWORD */}
          <div className="login-field">
            <input
              type="password"
              required
              placeholder=" "
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* REGISTER LINK */}
        <p className="bottom-text">
          Don't have an account?{" "}
          <span className="register-link" onClick={() => navigate("/register")}>
            Register →
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
