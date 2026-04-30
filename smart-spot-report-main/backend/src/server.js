/**
 * CleanCity AI — Manual Backend Server
 * ------------------------------------
 * A plain Express + Supabase server that mirrors what the Lovable Cloud
 * edge functions do. Built for local development in VS Code so the
 * project can run as a normal full-stack Node app.
 *
 * Endpoints:
 *   GET    /api/health           → server health check
 *   GET    /api/reports          → list all garbage reports
 *   GET    /api/reports/:id      → fetch a single report
 *   POST   /api/reports          → create a new report
 *   PATCH  /api/reports/:id      → update report status / assignment
 *   GET    /api/officers         → list ward officers
 *   POST   /api/officers         → create an officer
 *   PATCH  /api/officers/:id     → update an officer
 *   DELETE /api/officers/:id     → remove an officer
 *   POST   /api/detect           → run AI garbage detection on an image URL
 */
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const reportsRoutes = require("./routes/reports");
const officersRoutes = require("./routes/officers");
const detectRoutes = require("./routes/detect");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(logger);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "CleanCity AI Backend",
    time: new Date().toISOString(),
  });
});

// Feature routes
app.use("/api/reports", reportsRoutes);
app.use("/api/officers", officersRoutes);
app.use("/api/detect", detectRoutes);

// Error handler (last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 CleanCity AI backend running on http://localhost:${PORT}`);
  console.log(`   Health check → http://localhost:${PORT}/api/health\n`);
});
