import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import pdfPoppler from "pdf-poppler";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("pdf"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const outputDir = path.join("uploads", Date.now().toString());
    fs.mkdirSync(outputDir, { recursive: true });

    const options = {
      format: "png",
      out_dir: outputDir,
      out_prefix: path.basename(filePath, path.extname(filePath)),
      page: null,
    };

    console.log("Starting conversion:", filePath); // 👈 Add debug log
    await pdfPoppler.convert(filePath, options);
    console.log("Conversion done");

    const imageUrls = fs
      .readdirSync(outputDir)
      .map((file) => `http://localhost:5000/${outputDir}/${file}`);

    fs.unlinkSync(filePath);
    res.json({ images: imageUrls });
  } catch (err) {
    console.error("Conversion error:", err); // 👈 show real cause
    res.status(500).json({ message: "Failed to convert PDF" });
  }
});

export default router;
