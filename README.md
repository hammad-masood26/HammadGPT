# Gemini Chatbot (MERN)

A complete MERN stack AI chatbot powered by Google Gemini API with JWT auth and conversation history.

## Features
- Email/password signup & login (JWT sessions)
- Protected chat routes; only authenticated users can chat
- Conversations stored per user in MongoDB
- Google Gemini integration using `@google/genai`
- Secure server: CORS, Helmet, JWT middleware
- React (Vite) client with Login/Signup and responsive chat UI
- Typing indicator, different user/bot message styles
- Deployment-ready (Backend: Render/Heroku/DigitalOcean, Frontend: Vercel/Netlify)

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, Helmet, CORS
- Frontend: React, Vite, React Router, Axios

## Monorepo Structure
```
backend/
  src/
    config/db.js
    models/{User.js, Conversation.js}
    middleware/auth.js
    utils/jwt.js
    controllers/{auth.controller.js, chat.controller.js}
    routes/{auth.routes.js, chat.routes.js, conversation.routes.js}
    server.js
  package.json
  env.example

frontend/
  src/
    api/axios.ts
    context/AuthContext.tsx
    pages/{Login.tsx, Signup.tsx, Chat.tsx}
    App.tsx
    main.tsx
    styles.css
  index.html
  package.json
  env.example
```

## Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string
- A Google Gemini API key

## Setup
### 1) Backend
1. Copy env template and edit values:
```bash
cd backend
cp env.example .env
```
Environment variables:
- PORT=5000
- MONGO_URI=mongodb://localhost:27017/gemini_chat
- JWT_SECRET=change_me_in_production
- GEMINI_API_KEY=your_gemini_api_key_here
- GEMINI_MODEL=gemini-1.5-flash
- CLIENT_URL=http://localhost:5173

2. Install deps and run:
```bash
npm install
npm run dev
```
Server will start on http://localhost:5000

### 2) Frontend
1. Copy env template and edit values:
```bash
cd ../frontend
cp env.example .env
```
- VITE_API_URL=http://localhost:5000

2. Install deps and run:
```bash
npm install
npm run dev
```
App will open on http://localhost:5173

## REST API
- POST `/api/auth/signup` { email, password } → { token, user }
- POST `/api/auth/login` { email, password } → { token, user }
- POST `/api/chat/ask` { conversationId?, message } → { conversationId, reply, conversation }
- GET `/api/conversation/:id` → conversation (requires Authorization: Bearer <token>)

## Deployment
### Backend (Render example)
- Create a new Web Service from the `backend` folder
- Set Node 18+, Build Command: `npm install`, Start Command: `npm start`
- Add environment variables from `.env`
- Set `CLIENT_URL` to your deployed frontend URL

### Frontend (Vercel/Netlify)
- Import project and select the `frontend` folder
- Set Environment Variable: `VITE_API_URL` to your backend URL
- Build Command: `npm run build`, Output: `dist`

## Notes
- JWT is stored in localStorage for simplicity. For higher security, consider httpOnly cookies and CSRF protection.
- Update `GEMINI_MODEL` as needed if your account supports other models.

## License
MIT
