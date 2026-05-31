# StockSim Frontend

Frontend for the Live Stock Market Simulator project. This React application allows users to explore live simulator prices, buy and sell stocks with virtual money, manage portfolio, watchlist, alerts, AI assistant, news, and profile settings.

## Live Demo

https://live-stock-simulator-omega.vercel.app

## Tech Stack

- React
- Vite
- Tailwind CSS
- React Router
- Zustand
- Axios
- Socket.io Client
- Recharts
- React Hot Toast
- Lucide React

## Features

- Responsive landing page
- User login and signup
- Role-based navigation
- Protected user routes
- Admin-only routes
- Market page
- Stock details page
- Portfolio page
- Watchlist
- Price alerts
- AI assistant
- News page
- Profile and settings
- Support ticket tracking
- Dark and light mode
- User-friendly error messages

## Project Structure

```txt
frontend
├── public
├── src
│   ├── components
│   ├── config
│   ├── data
│   ├── store
│   ├── styles
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── vercel.json

Environment Variables
Create .env inside the frontend folder.
VITE_API_URL=http://localhost:3000

For production:
VITE_API_URL=https://live-stock-simulator.onrender.com

Installation
cd frontend
npm install
npm run dev

Frontend runs on:
http://localhost:5173

Build
npm run build

Deployment

The frontend is deployed on Vercel.

Vercel settings:
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command:npm install

vercel.json is used to support React Router direct routes:
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}

Author
Jyosna Bogari
