import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { connectToDatabase } from './config/db.js';

// Route imports (will be implemented)
import authRouter from './routes/auth.routes.js';
import chatRouter from './routes/chat.routes.js';
import conversationRouter from './routes/conversation.routes.js';

dotenv.config();

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({ origin: clientUrl, credentials: true }));

// Logging
app.use(morgan('dev'));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Mount routes
app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/conversation', conversationRouter);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();


