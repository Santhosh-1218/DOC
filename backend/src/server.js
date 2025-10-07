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

// ✅ Allow your frontend on port 3000
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ API routes
app.use("/api", authRoutes);
app.use("/api/docs", docsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/tools", toolsRoutes); // 🧩 Mount tools (Excel-to-PDF lives here)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
