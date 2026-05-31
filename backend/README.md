# StockSim Backend

Backend API for the Live Stock Market Simulator project. This server handles authentication, stock trading, portfolio management, watchlists, alerts, admin operations, AI assistant integration, and real-time stock updates.

## Live API

https://live-stock-simulator.onrender.com

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Cookie Parser
- BcryptJS
- Socket.io
- Gemini AI API
- Finnhub API
- CORS

## Features

### Authentication

- User Registration
- User Login
- User Logout
- JWT Authentication
- Cookie-based Sessions
- Protected Routes
- Role-Based Authorization
- Admin Access Control

### User Features

- View Market Stocks
- Buy Stocks
- Sell Stocks
- Portfolio Tracking
- Watchlist Management
- Price Alerts
- User Settings
- Report Bugs
- Submit Feedback
- AI Assistant

### Admin Features

- Dashboard Statistics
- User Management
- Block/Unblock Users
- Reports Management
- Monitor Simulator Activity
- Analytics Dashboard

### Real-Time Features

- Socket.io Live Price Updates
- Real-Time Portfolio Refresh
- Alert Notifications

## Project Structure

```txt
backend
├── API's
│   ├── userAPI.js
│   ├── stockAPI.js
│   ├── adminAPI.js
│
├── middleware
│   ├── verifyToken.js
│   ├── verifyAdmin.js
│
├── models
│   ├── UserTypeModel.js
│   ├── StockModel.js
│   ├── PortfolioModel.js
│   ├── WatchlistModel.js
│   ├── AlertModel.js
│   ├── ReportModel.js
│
├── Services
│   ├── authService.js
│   ├── aiService.js
│   ├── stockPriceService.js
│   ├── newsService.js
│
├── server.js
├── package.json
└── .env
```

## Environment Variables

Create a `.env` file inside backend folder.

```env
DB_URL=your_mongodb_connection_string

PORT=3000

JWT_SECRET=your_jwt_secret

FINNHUB_API_KEY=your_finnhub_api_key

GEMINI_API_KEY=your_gemini_api_key

NODE_ENV=development
```

Production example:

```env
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/Live_Stock_Simulator

PORT=3000

JWT_SECRET=your_secure_jwt_secret

FINNHUB_API_KEY=xxxxxxxxxxxxxxxx

GEMINI_API_KEY=xxxxxxxxxxxxxxxx

NODE_ENV=production
```

## Installation

```bash
cd backend

npm install
```

## Run Development Server

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:3000
```

## Run Production Server

```bash
npm start
```

or

```bash
node server.js
```

## Authentication

Authentication uses:

- JWT Tokens
- HTTP Only Cookies
- Protected Routes
- Role-Based Access

Cookie configuration:

```js
const cookieOptions = {
  httpOnly: true,
  sameSite:
    process.env.NODE_ENV === "production"
      ? "none"
      : "lax",
  secure:
    process.env.NODE_ENV === "production",
};
```

## Main API Routes

### User APIs

```txt
POST   /user-api/register
POST   /user-api/login
POST   /user-api/logout
GET    /user-api/me
PATCH  /user-api/update-profile
PATCH  /user-api/change-password
```

### Stock APIs

```txt
GET    /stock-api/market
GET    /stock-api/details/:symbol
POST   /stock-api/buy
POST   /stock-api/sell
```

### Portfolio APIs

```txt
GET    /stock-api/portfolio
```

### Watchlist APIs

```txt
GET    /stock-api/watchlist
POST   /stock-api/watchlist
DELETE /stock-api/watchlist/:symbol
```

### Alert APIs

```txt
GET    /stock-api/alerts
POST   /stock-api/alerts
DELETE /stock-api/alerts/:id
```

### AI Assistant APIs

```txt
POST   /stock-api/ai-chat
```

### Admin APIs

```txt
GET    /admin-api/stats
GET    /admin-api/users
PUT    /admin-api/users/:id/status

GET    /admin-api/reports
POST   /admin-api/reports
GET    /admin-api/my-reports

PUT    /admin-api/reports/:id/resolve

GET    /admin-api/analytics
GET    /admin-api/monitor
```

## Deployment

Backend is deployed on Render.

Render Settings:

```txt
Root Directory: backend

Build Command:
npm install

Start Command:
node server.js
```

Environment variables must be configured in Render Dashboard.

## Security Features

- JWT Authentication
- HTTP Only Cookies
- Protected Routes
- Role-Based Authorization
- Password Hashing using Bcrypt
- MongoDB Validation
- Global Error Handling
- Unauthorized Route Protection

## Error Handling

Global error middleware handles:

- Validation Errors
- Duplicate Email Errors
- Invalid Credentials
- Unauthorized Access
- Server Errors
- Database Errors

## Author

Jyosna Bogari

B.Tech Information Technology

Anurag University

## Project

StockSim – Live Stock Market Simulator

Practice stock trading using virtual money, manage portfolios, track market activity, and learn investing without risking real money.
