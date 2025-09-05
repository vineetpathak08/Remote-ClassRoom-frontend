# Frontend - MERN Auth & Chatbot

This is the frontend for the MERN Auth & Integrated Chatbot project. Built with React, Vite, and Tailwind CSS, it provides a modern UI for authentication and chatbot interaction.

## Features

- User registration, login, and Google OAuth
- Email verification and password reset flows
- Conversational AI chatbot (Google Gemini API)
- Responsive, animated UI with custom themes
- Context API for user state
- Axios for API integration

## Setup

1. `cd frontend`
2. `npm install`
3. Create a `.env` file (see `.env.example`):
   - `VITE_API_URL=...`
   - `VITE_API_TYPE=gemini` or `openai`
4. `npm run dev`

## Folder Structure

- `src/components/` - UI & chatbot
- `src/pages/` - Auth, home, etc.
- `src/context/` - User context
- `src/styles/` - Tailwind, variables, animations
- `src/api/` - Axios config

## Future Add-ons

- User profile page
- Chatbot history
- Push notifications
- Analytics dashboard

---

MIT License
