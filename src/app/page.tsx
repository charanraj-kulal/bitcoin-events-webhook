"use client";
import React, { useEffect, useState } from "react";
import {
  getCryptoMarketData,
  getBitcoinMarketData,
  getGlobalMarketStats,
  getTrendingCoins,
  getFearGreedIndex,
} from "@/app/lib/coingecko";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import PriceAlert from "./components/PriceAlert";
import RealTimeStatus from "./components/RealTimeStatus";
import LiveEvents from "./components/LiveEvents";
import MarketSummary from "./components/MarketSummary";

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  sparkline_in_7d: {
    price: number[];
  };
  image: string;
  market_cap_rank: number;
  total_volume: number;
}

interface GlobalStats {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    market_cap_percentage: {
      btc: number;
      eth: number;
    };
  };
}

interface TrendingData {
  coins: Array<{
    item: {
      id: string;
      name: string;
      symbol: string;
      market_cap_rank: number;
      thumb: string;
    };
  }>;
}

interface FearGreedData {
  data: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
  }>;
}

export default function Home() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [chartData, setChartData] = useState([]);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);
  const [trendingCoins, setTrendingCoins] = useState<TrendingData | null>(null);
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const updateInterval = 30; // seconds

  const fetchAllData = async () => {
    try {
      setIsConnected(true);
      const [market, chart, global, trending, fearGreedData] =
        await Promise.all([
          getCryptoMarketData(),
          getBitcoinMarketData(),
          getGlobalMarketStats(),
          getTrendingCoins(),
          getFearGreedIndex(),
        ]);

      setCryptoData(market);

      // Format chart data for Bitcoin
      const formattedChart = chart.prices
        .slice(-24)
        .map(([timestamp, price]: [number, number]) => ({
          time: new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: Number(price.toFixed(2)),
          volume:
            chart.total_volumes[
              chart.prices.indexOf([timestamp, price])
            ]?.[1] || 0,
        }));

      setChartData(formattedChart);
      setGlobalStats(global);
      setTrendingCoins(trending);
      setFearGreed(fearGreedData);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsConnected(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAllData, updateInterval * 1000);

    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price);
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? "text-green-500" : "text-red-500";
  };

  const getPriceChangeIcon = (change: number) => {
    return change >= 0 ? "▲" : "▼";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Loading real-time crypto data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Real-time Status */}
      <RealTimeStatus
        lastUpdate={lastUpdate}
        isConnected={isConnected}
        updateInterval={updateInterval}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
          🚀 Crypto Events Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Real-time cryptocurrency market data • Last updated:{" "}
          {lastUpdate.toLocaleTimeString()}
        </p>
      </div>

      {/* Global Market Stats */}
      {globalStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Total Market Cap
            </h3>
            <p className="text-2xl font-bold text-green-400">
              {formatLargeNumber(globalStats.data.total_market_cap.usd)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              24h Volume
            </h3>
            <p className="text-2xl font-bold text-blue-400">
              {formatLargeNumber(globalStats.data.total_volume.usd)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Bitcoin Dominance
            </h3>
            <p className="text-2xl font-bold text-orange-400">
              {globalStats.data.market_cap_percentage.btc.toFixed(1)}%
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Active Cryptos
            </h3>
            <p className="text-2xl font-bold text-purple-400">
              {globalStats.data.active_cryptocurrencies.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Market Summary */}
      <MarketSummary cryptoData={cryptoData} />

      {/* Fear & Greed Index */}
      {fearGreed && fearGreed.data && fearGreed.data[0] && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h3 className="text-xl font-semibold mb-4">Fear & Greed Index</h3>
          <div className="flex items-center space-x-4">
            <div className="text-3xl font-bold text-yellow-400">
              {fearGreed.data[0].value}
            </div>
            <div>
              <p className="text-lg font-semibold capitalize">
                {fearGreed.data[0].value_classification}
              </p>
              <p className="text-gray-400 text-sm">Market Sentiment</p>
            </div>
          </div>
        </div>
      )}

      {/* Bitcoin Price Chart */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
        <h3 className="text-xl font-semibold mb-4">
          Bitcoin Price Chart (24h)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f7931a" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f7931a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis
              stroke="#9CA3AF"
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [formatPrice(value), "Price"]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#f7931a"
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Cryptocurrencies */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
        <h3 className="text-xl font-semibold mb-6">Top Cryptocurrencies</h3>
        <div className="grid gap-4">
          {cryptoData.map((crypto) => (
            <div
              key={crypto.id}
              className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-10 h-10"
                />
                <div>
                  <h4 className="font-semibold">{crypto.name}</h4>
                  <p className="text-gray-400 text-sm uppercase">
                    {crypto.symbol}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="font-semibold text-lg">
                    {formatPrice(crypto.current_price)}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Rank #{crypto.market_cap_rank}
                  </p>
                </div>

                <div className="text-right min-w-[80px]">
                  {crypto.price_change_percentage_1h_in_currency && (
                    <p
                      className={`text-sm ${getPriceChangeColor(
                        crypto.price_change_percentage_1h_in_currency
                      )}`}
                    >
                      {getPriceChangeIcon(
                        crypto.price_change_percentage_1h_in_currency
                      )}
                      {Math.abs(
                        crypto.price_change_percentage_1h_in_currency
                      ).toFixed(2)}
                      % (1h)
                    </p>
                  )}
                  {crypto.price_change_percentage_24h_in_currency && (
                    <p
                      className={`text-sm ${getPriceChangeColor(
                        crypto.price_change_percentage_24h_in_currency
                      )}`}
                    >
                      {getPriceChangeIcon(
                        crypto.price_change_percentage_24h_in_currency
                      )}
                      {Math.abs(
                        crypto.price_change_percentage_24h_in_currency
                      ).toFixed(2)}
                      % (24h)
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">Market Cap</p>
                  <p className="font-semibold">
                    {formatLargeNumber(crypto.market_cap)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-400">Volume</p>
                  <p className="font-semibold">
                    {formatLargeNumber(crypto.total_volume)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Alerts */}
      <div className="mb-8">
        <PriceAlert cryptoData={cryptoData} />
      </div>

      {/* Live Market Events */}
      <div className="mb-8">
        <LiveEvents cryptoData={cryptoData} />
      </div>

      {/* Trending Coins */}
      {trendingCoins && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">🔥 Trending Coins</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {trendingCoins.coins.slice(0, 5).map((coin, index) => (
              <div
                key={coin.item.id}
                className="bg-gray-700 rounded-lg p-4 text-center"
              >
                <img
                  src={coin.item.thumb}
                  alt={coin.item.name}
                  className="w-8 h-8 mx-auto mb-2"
                />
                <h4 className="font-semibold text-sm">{coin.item.name}</h4>
                <p className="text-gray-400 text-xs uppercase">
                  {coin.item.symbol}
                </p>
                <p className="text-yellow-400 text-xs mt-1">
                  #{index + 1} Trending
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
