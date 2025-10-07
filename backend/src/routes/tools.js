import express from "express";
import pdfToWord from "./tools/pdfToWord.js";
import wordToPdf from "./tools/wordToPdf.js";
import pdfMerge from "./tools/pdfMerge.js";
import pdfSplit from "./tools/pdfSplit.js";
import pdfCompress from "./tools/pdfCompress.js"; // ✅ uses /compress inside
import imageToPdf from "./tools/imageToPdf.js";
import pdfToImage from "./tools/pdfToImage.js";

const router = express.Router();

// ✅ Register tool routes
router.use("/pdf-to-word", pdfToWord);
router.use("/word-to-pdf", wordToPdf);
router.use("/pdf-merge", pdfMerge);
router.use("/pdf-split", pdfSplit);
router.use("/pdf", pdfCompress);          // 👈 Correct path for /api/tools/pdf/compress
router.use("/image-to-pdf", imageToPdf);
router.use("/pdf-to-image", pdfToImage);

export default router;
