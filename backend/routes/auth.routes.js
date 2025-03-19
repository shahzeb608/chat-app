import express from "express";
import { signup, login, logout, verify } from "../controllers/auth.controllers.js";
import { protect } from "../middlewares/protect.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verify", protect, verify); 

export default router;