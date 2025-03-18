import express from 'express';
import { protect } from '../middlewares/protect.middleware.js';
import { getUser } from '../controllers/user.controller.js';
const router = express.Router();

router.get("/", protect, getUser)

export default router;