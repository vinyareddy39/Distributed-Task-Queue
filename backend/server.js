import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint (used by Render.com to verify service is up)
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => { 
    
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});