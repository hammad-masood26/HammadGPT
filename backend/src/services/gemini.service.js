import { GoogleGenerativeAI } from '@google/generative-ai';

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
  return new GoogleGenerativeAI(apiKey);
}

export async function generateAssistantReply(userMessage, history = []) {
  try {
    const genAI = getClient();
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-pro';
    const model = genAI.getGenerativeModel({ model: modelName });

    // Format history for Gemini's chat method
    const formattedHistory = [];

    // Add system prompt
    formattedHistory.push({
      role: 'user',
      parts: [{ text: 'You are a helpful AI assistant. You must remember everything from our conversation and maintain context.' }]
    });
    formattedHistory.push({
      role: 'model',
      parts: [{ text: 'I understand. I will remember all details from our conversation and maintain context throughout our discussion.' }]
    });

    // Add the actual conversation history
    for (const msg of history) {
      formattedHistory.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ 
          text: msg.content || msg.parts[0].text 
        }]
      });
    }

    // Start new chat with history
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });

    try {
      // Send message and get response
      const result = await chat.sendMessage([{
        text: userMessage
      }]);
      
      const response = await result.response;
      const text = response.text();

      if (!text) throw new Error('Empty response from Gemini API');
      return text.trim();
    } catch (error) {
      console.error('Error generating assistant reply:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in generateAssistantReply:', error);
    throw new Error(error.message || 'Failed to generate response');
  }
}
