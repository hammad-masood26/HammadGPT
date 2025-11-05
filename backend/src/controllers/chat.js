import Conversation from '../models/Conversation.js';
import { generateAssistantReply } from '../services/gemini.service.js';

// Ask a question (create or continue conversation)
export const ask = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    let conversation;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // If continuing an existing conversation
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation || conversation.user.toString() !== req.user._id.toString()) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
    } else {
      // Create a new conversation with a title based on first message
      if (!message || message.trim() === '') {
        return res.status(400).json({ error: 'Message is required to start a conversation' });
      }

      conversation = new Conversation({
        user: req.user._id,
        title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
        messages: []
      });
    }

    // Add user message to conversation
    conversation.messages.push({
      role: 'user',
      content: message
    });

    // Send the complete conversation history
    const aiResponse = await generateAssistantReply(message, conversation.messages);

    // Add assistant reply
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse
    });

    // Save conversation
    await conversation.save();

    res.json({ conversation, conversationId: conversation._id });
  } catch (error) {
    console.error('Error in ask:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
};

// Get a single conversation
export const getConversation = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || conversation.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Error in getConversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
};

// List all conversations for the logged-in user
export const listConversations = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const conversations = await Conversation.find({ user: req.user._id })
      .sort({ updatedAt: -1 });

    res.json({ conversations });
  } catch (error) {
    console.error('Error in listConversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// Delete a conversation
export const deleteConversation = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation || conversation.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    await conversation.deleteOne();
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error in deleteConversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};
