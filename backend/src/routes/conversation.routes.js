import { Router } from 'express';
import { getConversation, listConversations } from '../controllers/chat.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateJwt, listConversations);
router.get('/:id', authenticateJwt, getConversation);

export default router;


