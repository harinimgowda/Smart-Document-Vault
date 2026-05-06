import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "faculty",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Register form data:", form);

    try {
      console.log("Calling registerUser...");
      await registerUser(form);
      console.log("Register successful");

      alert("Registered successfully");

      navigate("/");
    } catch (err) {
      console.log("Register error:", err);
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <div className="card p-4 shadow">
        <h3 className="text-center mb-3">Register</h3>
        <p className="field-help">Please complete all required fields.</p>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            placeholder="Name"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            className="form-control mb-2"
            placeholder="Email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            className="form-control mb-2"
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          {/* ROLE */}
          <select
            className="form-select mb-3"
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="faculty">Faculty</option>
            <option value="reviewer">Reviewer</option>
            <option value="admin">Admin</option>
          </select>

          <button className="btn btn-success w-100">Register</button>
        </form>

        <p className="mt-3 text-center">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
