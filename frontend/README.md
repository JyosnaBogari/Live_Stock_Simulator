### Project Architecture

Stock Market Simulator
│
├── Frontend - React
│   ├── Home Page public
│   ├── Signup/Login
│   ├── Dashboard private
│   ├── Buy/Sell Stocks
│   ├── Portfolio
│   ├── Leaderboard
│   ├── Alerts
│   └── AI Stock Assistant
│
├── Backend - Node.js + Express
│   ├── Auth APIs
│   ├── Stock APIs
│   ├── Buy/Sell APIs
│   ├── Portfolio APIs
│   ├── Leaderboard APIs
│   └── Socket.io live price updates
│
├── Database - MongoDB
│   ├── Users
│   ├── Wallets
│   ├── Portfolio
│   ├── Transactions
│   └── Alerts
│
├── Chart.js / Recharts
│   └── Shows stock price graph
│
├── Socket.io
│   └── Updates stock prices live without refreshing
│
├── Generative AI
│   └── Explains stock/company/news in simple language
│
└── Cloud
    ├── Frontend: Vercel / Netlify
    ├── Backend: Render
    └── Database: MongoDB Atlas