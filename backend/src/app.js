const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors({origin:true,credentials:true}));
app.use(express.json());


// 🔥 FIX PREVIEW PATH
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/ai", aiRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("API running...");
});

module.exports = app;
