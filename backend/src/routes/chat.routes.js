import { Router } from 'express';
import { ask, getConversation, listConversations, deleteConversation } from '../controllers/chat.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

// Step 1 - Ask
router.post('/ask', authenticateJwt, ask);

// Step 2 - Fetch conversation(s)
router.get('/conversation/:id', authenticateJwt, getConversation);
router.get('/conversations', authenticateJwt, listConversations);

// Step 4 - Delete conversation
router.delete('/conversation/:id', authenticateJwt, deleteConversation);

export default router;
