import express from 'express';
import { sendMessage,getMessage } from '../controllers/message.controller.js';
import { protect } from '../middlewares/protect.middleware.js';
const router = express.Router();

router.post("/send/:id", protect,sendMessage)
router.get("/:id", protect,getMessage)

export default router;