import API from "./api";

// 🔐 LOGIN
export const loginUser = async (data) => {
  console.log("authService loginUser called with:", data);
  const res = await API.post("/auth/login", data);
  console.log("authService response:", res);
  return res;
};

// 📝 REGISTER
export const registerUser = async (data) => {
  console.log("authService registerUser called with:", data);
  const res = await API.post("/auth/register", data);
  console.log("authService register response:", res);
  return res;
};

// 🚪 LOGOUT (optional helper)
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
