require("dotenv").config();
console.log(
  "OPENROUTER API KEY:",
  process.env.OPENROUTER_API_KEY ? "Loaded" : "Not Found",
);

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

// 🔥 CREATE DEFAULT ADMIN USER
const createDefaultAdmin = async () => {
  const User = require("./models/userModel");
  const bcrypt = require("bcryptjs");

  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin",
        email: "admin@test.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Default admin user created: admin@test.com / admin123");
    }
  } catch (error) {
    console.log("Error creating default admin:", error);
  }
};

createDefaultAdmin();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
