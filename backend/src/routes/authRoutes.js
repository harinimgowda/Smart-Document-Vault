const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// 🔓 AUTH ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// 👥 ADMIN ROUTES
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

router.put("/users/:id/role", protect, authorizeRoles("admin"), updateUserRole);

router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

// 🧪 TEST ROUTE (REMOVE LATER)
router.get("/test", (req, res) => {
  res.send("Auth route working");
});

module.exports = router;
