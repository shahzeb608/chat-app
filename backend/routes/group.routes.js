import express from "express";
import { protect } from "../middlewares/protect.middleware.js";

import {
  createGroup,
  getGroups,
  getGroupById,
  addMemberToGroup,
  removeMemberFromGroup,
  sendGroupMessage,
  getGroupMessages
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/create", protect, createGroup);
router.get("/", protect, getGroups);
router.get("/:id", protect, getGroupById);
router.post("/:id/members", protect, addMemberToGroup);
router.delete("/:id/members/:memberId", protect, removeMemberFromGroup);
router.post("/:id/messages", protect, sendGroupMessage);
router.get("/:id/messages", protect, getGroupMessages);

export default router;