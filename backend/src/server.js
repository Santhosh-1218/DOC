import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import toolsRoutes from "./routes/tools.js";
import authRoutes from "./routes/auth.js";
import docsRoutes from "./routes/docs.js";
import uploadRoutes from "./routes/upload.js";
import profileRoutes from "./routes/profile.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api", authRoutes);
app.use("/api/docs", docsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/tools", toolsRoutes);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
