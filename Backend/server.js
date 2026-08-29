import "dotenv/config";
import express from "express";
import cors from "cors";
import "./models/index.js"
import sequelize from "./config/database.js";
import adminJobRoutes from "./routes/adminJobRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import adminApplicationRoutes from "./routes/adminApplicationRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Job Assistant API is running",
  });
});
app.use("/api/jobs",jobRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/jobs",adminJobRoutes);
app.use("/api/applications",applicationRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/admin/applications",adminApplicationRoutes);

const PORT = 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected successfully");

    await sequelize.sync();
    console.log("Database tables synchronized successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

startServer();