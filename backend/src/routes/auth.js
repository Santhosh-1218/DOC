import express from "express";
import { signup, login, checkUsername } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/check-username", checkUsername); // ✅ new route

export default router;
