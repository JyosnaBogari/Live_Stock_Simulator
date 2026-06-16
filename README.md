#  StockSim - Live Stock Market Simulator

A full-stack virtual stock trading platform that allows users to practice investing using virtual money, track portfolios, monitor stock performance, receive alerts, and learn stock market concepts without risking real money.

---

#  Live Links

### Frontend
https://live-stock-simulator-omega.vercel.app

### Backend API
https://live-stock-simulator.onrender.com

---

# Features

## User Features

- User Registration & Login
- JWT Authentication
- Virtual Wallet
- Buy Stocks
- Sell Stocks
- Portfolio Tracking
- Profit & Loss Monitoring
- Watchlist Management
- Price Alerts
- AI Stock Assistant
- Market News
- User Settings
- Profile Management
- Bug Reporting
- Feedback Submission
- Dark / Light Theme
- Responsive Design

---

## Admin Features

- Admin Dashboard
- User Management
- Block / Unblock Users
- Reports Management
- Analytics Dashboard
- System Monitoring
- Trading Statistics
- Simulator Activity Tracking

---

## Real-Time Features

- Live Stock Price Updates
- Socket.io Integration
- Portfolio Refresh
- Alert Notifications
- Live Market Simulation

---

# Tech Stack

## Frontend

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

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- Cookie Parser
- BcryptJS
- Socket.io
- Gemini AI
- Finnhub API
- CORS

---

#  Project Structure

```txt
Live_Stock_Simulator
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── config
│   │   ├── store
│   │   ├── styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── backend
│   ├── API's
│   │   ├── userAPI.js
│   │   ├── stockAPI.js
│   │   └── adminAPI.js
│   │
│   ├── middleware
│   │   ├── verifyToken.js
│   │   └── verifyAdmin.js
│   │
│   ├── models
│   │   ├── UserTypeModel.js
│   │   ├── StockModel.js
│   │   ├── PortfolioModel.js
│   │   ├── WatchlistModel.js
│   │   ├── AlertModel.js
│   │   └── ReportModel.js
│   │
│   ├── Services
│   │   ├── authService.js
│   │   ├── aiService.js
│   │   ├── stockPriceService.js
│   │   └── newsService.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

#  Environment Variables

## Backend (.env)

```env
DB_URL=your_mongodb_connection_string

PORT=3000

JWT_SECRET=your_jwt_secret

FINNHUB_API_KEY=your_finnhub_api_key

GEMINI_API_KEY=your_gemini_api_key

NODE_ENV=development
```

### Production Example

```env
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/Live_Stock_Simulator

PORT=3000

JWT_SECRET=your_secure_jwt_secret

FINNHUB_API_KEY=xxxxxxxxxxxxxxxx

GEMINI_API_KEY=xxxxxxxxxxxxxxxx

NODE_ENV=production
```

## Frontend (.env)

### Development

```env
VITE_API_URL=http://localhost:3000
```

### Production

```env
VITE_API_URL=https://live-stock-simulator.onrender.com
```

---

#  Installation

## Clone Repository

```bash
git clone https://github.com/JyosnaBogari/Live_Stock_Simulator.git

cd Live_Stock_Simulator
```

---

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

Backend runs on:

```txt
http://localhost:3000
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Authentication

Authentication uses:

- JWT Tokens
- HTTP Only Cookies
- Protected Routes
- Role-Based Authorization

Cookie Configuration:

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

---

#  API Routes

## User APIs

```txt
POST   /user-api/register
POST   /user-api/login
POST   /user-api/logout
GET    /user-api/me
PATCH  /user-api/update-profile
PATCH  /user-api/change-password
```

## Stock APIs

```txt
GET    /stock-api/market
GET    /stock-api/details/:symbol
POST   /stock-api/buy
POST   /stock-api/sell
GET    /stock-api/portfolio
```

## Watchlist APIs

```txt
GET    /stock-api/watchlist
POST   /stock-api/watchlist
DELETE /stock-api/watchlist/:symbol
```

## Alert APIs

```txt
GET    /stock-api/alerts
POST   /stock-api/alerts
DELETE /stock-api/alerts/:id
```

## AI APIs

```txt
POST /stock-api/ai-chat
```

## Admin APIs

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

---

# Deployment

## Frontend (Vercel)

### Settings

```txt
Root Directory: frontend

Build Command:
npm run build

Output Directory:
dist

Install Command:
npm install
```

### React Router Support

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## Backend (Render)

### Settings

```txt
Root Directory:
backend

Build Command:
npm install

Start Command:
node server.js
```

Configure all environment variables inside Render Dashboard.

---

# Security Features

- JWT Authentication
- HTTP Only Cookies
- Password Hashing with Bcrypt
- Role-Based Authorization
- Protected Routes
- Admin Route Protection
- MongoDB Validation
- Global Error Handling
- Session Expiry Handling
- User-Friendly Error Messages

---

#  Error Handling

The application handles:

- Invalid Credentials
- Unauthorized Access
- Session Expiration
- Duplicate Email Registration
- Validation Errors
- API Failures
- Database Errors
- Socket Connection Errors
- Server Errors

---

#  Future Enhancements

- Real Market Data Integration
- Advanced Portfolio Analytics
- Trading Leaderboard
- Email Notifications
- Mobile App Version
- Candlestick Charts
- AI Portfolio Suggestions
- Multi-language Support

---

#  Author

**Jyosna Bogari**

B.Tech Information Technology  
Anurag University

---

#  Project Objective

StockSim helps students and beginners understand stock market trading concepts by providing a realistic trading simulator using virtual money. Users can learn investing, test strategies, track performance, and gain practical experience without financial risk.
