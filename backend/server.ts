import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import groupRoutes from "./src/routes/group.route.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/groups", groupRoutes);
// app.use("/api/persons", personRoutes);

// Health check (optional)
app.get("/", (_req, _res) => {
  _res.json({ message: "API is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
