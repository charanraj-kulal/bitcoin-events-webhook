# 🚀 Bitcoin Events Dashboard

A real-time cryptocurrency monitoring dashboard with advanced features for tracking market events and price alerts.

## Features

### 📊 Real-Time Data

- **Live Price Updates**: Updates every 30 seconds from CoinGecko API
- **Multi-Currency Support**: Track top 10 cryptocurrencies
- **Historical Charts**: Bitcoin price trends with interactive charts
- **Market Statistics**: Global market cap, volume, and dominance data

### 🔔 Smart Alerts

- **Price Alerts**: Set custom price targets (above/below thresholds)
- **Browser Notifications**: Get notified when alerts are triggered
- **Multiple Cryptocurrencies**: Create alerts for any tracked coin
- **Alert Management**: Easy creation and deletion of alerts

### 📈 Market Analysis

- **Fear & Greed Index**: Market sentiment indicator
- **Market Summary**: 24h gainers, losers, and volume analysis
- **Trending Coins**: Currently popular cryptocurrencies
- **Live Events Feed**: Real-time detection of significant price movements

### 🎨 Modern UI

- **Dark Theme**: Easy on the eyes for extended monitoring
- **Responsive Design**: Works on desktop and mobile
- **Real-Time Status**: Connection indicator and update timer
- **Gradient Effects**: Beautiful visual elements

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **API**: CoinGecko API (free tier)
- **Notifications**: Browser Notification API

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## API Usage

The dashboard uses CoinGecko's free API tier which provides:

- 50 calls/minute rate limit
- Historical data (7 days for charts)
- Real-time price data
- Market statistics

## Demo Features for Client

### Real-Time Events Detection

- **Price Spikes**: Automatically detects significant price movements (>2%)
- **Volume Surges**: Identifies unusual trading activity
- **Market Milestones**: Bitcoin crossing key resistance levels ($70K+)
- **24h Performance**: Highlights major gainers and losers (>10% change)

### Alert System Demonstration

1. Create an alert for Bitcoin at current price + $1000
2. Watch the live events feed for market activity
3. See how the system would notify users of price changes
4. Demonstrate browser notifications (with user permission)

### Professional Presentation Points

- **Scalable Architecture**: Built with enterprise-grade Next.js
- **Real-Time Capabilities**: 30-second update intervals
- **User Experience**: Intuitive interface with modern design
- **Mobile Ready**: Responsive design for all devices
- **Extensible**: Easy to add more cryptocurrencies, exchanges, or features

## Future Enhancements

- Push notifications for mobile apps
- Portfolio tracking
- Advanced technical indicators
- Social sentiment analysis
- Multi-exchange price comparison
- Trading integration

## API Keys

The project includes a demo CoinGecko API key. For production use, obtain your own key from [CoinGecko](https://www.coingecko.com/en/api).

---

**Perfect for demonstrating cryptocurrency monitoring capabilities to clients!** 🎯
