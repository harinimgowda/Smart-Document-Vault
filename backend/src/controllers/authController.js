const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
const registerUser = async (req, res) => {
  try {
    console.log("Register attempt:", req.body);
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    console.log(
      "Existing user check:",
      existingUser ? "User exists" : "No existing user",
    );

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    console.log("User created successfully:", email);
    res.status(201).json({
      message: "Registered successfully",
    });
  } catch (error) {
    console.log("Register error:", error);
    res.status(500).json({ message: "Register failed" });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    console.log("Login attempt:", req.body);
    const { email, password } = req.body;

    const user = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    console.log("User found:", user ? user.email : "No user found");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // 🔥 TEMPORARY: Allow admin123 for testing
    const isTempPassword = password === "admin123" && user.role === "admin";

    console.log("Password match:", isMatch, "Temp password:", isTempPassword);

    if (!isMatch && !isTempPassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    console.log("Login successful for:", user.email);
    res.json({ token });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// GET USERS
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// UPDATE ROLE
const updateUserRole = async (req, res) => {
  const { role } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.user.id === req.params.id) {
    return res.status(400).json({
      message: "You cannot change your own role",
    });
  }

  user.role = role;
  await user.save();

  res.json({ message: "Role updated successfully" });
};

// DELETE USER
const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
