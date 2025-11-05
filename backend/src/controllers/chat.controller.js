import { Router } from "express";
import {
  ask,
  getConversation,
  listConversations,
  deleteConversation,
} from "../controllers/chat.js"; // ✅ corrected relative path
import { authenticateJwt } from "../middleware/auth.js";

const router = Router();

/**
 * POST /api/chat/ask
 * Send a message and get the assistant's reply (with memory)
 */
router.post("/ask", authenticateJwt, ask);

/**
 * GET /api/chat/conversation/:id
 * Get a specific conversation by ID
 */
router.get("/conversation/:id", authenticateJwt, getConversation);

/**
 * GET /api/chat/conversations
 * Get a list of all user conversations
 */
router.get("/conversations", authenticateJwt, listConversations);

/**
 * DELETE /api/chat/conversation/:id
 * Delete a conversation
 */
router.delete("/conversation/:id", authenticateJwt, deleteConversation);

export default router;
