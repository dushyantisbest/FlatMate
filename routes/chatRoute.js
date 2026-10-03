import express from "express";
import { isLoggedIn } from "../middleware.js";
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
} from "../controller/chat.controller.js";

const router = express.Router();

router.get("/", isLoggedIn, getConversations);
router.post("/start", isLoggedIn, getOrCreateConversation);
router.get("/:conversationId/messages", isLoggedIn, getMessages);
router.post("/:conversationId/messages", isLoggedIn, sendMessage);

export default router;
