import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import toolsRoutes from "./routes/tools.js";
import authRoutes from "./routes/auth.js";
import docsRoutes from "./routes/docs.js";
import uploadRoutes from "./routes/upload.js";
import profileRoutes from "./routes/profile.js";
import fileUpload from "express-fileupload";
import contactRoutes from "./routes/contactRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// ✅ Proper directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Serve the real uploads folder (one level above /src)
const uploadsDir = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsDir));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
console.log("🗂 Serving uploads from:", uploadsDir);

// ✅ Routes
app.use("/api", authRoutes);
app.use("/api/docs", docsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/tools", toolsRoutes);
app.use(fileUpload());
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Root check
app.get("/", (req, res) => res.send("✅ Backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
