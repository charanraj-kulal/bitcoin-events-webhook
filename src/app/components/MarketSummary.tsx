"use client";
import React from "react";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";

interface MarketSummaryProps {
  cryptoData: Array<{
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h_in_currency?: number;
    market_cap: number;
    total_volume: number;
  }>;
}

export default function MarketSummary({ cryptoData }: MarketSummaryProps) {
  if (cryptoData.length === 0) return null;

  // Calculate market metrics
  const gainers = cryptoData.filter(
    (coin) =>
      coin.price_change_percentage_24h_in_currency &&
      coin.price_change_percentage_24h_in_currency > 0
  ).length;

  const losers = cryptoData.filter(
    (coin) =>
      coin.price_change_percentage_24h_in_currency &&
      coin.price_change_percentage_24h_in_currency < 0
  ).length;

  const topGainer = cryptoData.reduce((max, coin) =>
    (coin.price_change_percentage_24h_in_currency || 0) >
    (max.price_change_percentage_24h_in_currency || 0)
      ? coin
      : max
  );

  const topLoser = cryptoData.reduce((min, coin) =>
    (coin.price_change_percentage_24h_in_currency || 0) <
    (min.price_change_percentage_24h_in_currency || 0)
      ? coin
      : min
  );

  const totalVolume = cryptoData.reduce(
    (sum, coin) => sum + coin.total_volume,
    0
  );
  const avgChange =
    cryptoData.reduce(
      (sum, coin) => sum + (coin.price_change_percentage_24h_in_currency || 0),
      0
    ) / cryptoData.length;

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 border border-gray-700 mb-8">
      <h3 className="text-xl font-semibold mb-6 flex items-center">
        <BarChart3 className="mr-2 text-blue-400" size={20} />
        Market Summary (24h)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Market Sentiment */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Market Sentiment
          </h4>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <p className="text-lg font-bold text-green-400">{gainers}</p>
              <p className="text-xs text-gray-400">Gainers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-red-400">{losers}</p>
              <p className="text-xs text-gray-400">Losers</p>
            </div>
          </div>
          <div className="mt-2">
            <p
              className={`text-center text-sm font-medium ${
                avgChange >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              Avg: {avgChange >= 0 ? "+" : ""}
              {avgChange.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Top Gainer */}
        <div className="bg-green-900/30 rounded-lg p-4 border border-green-700">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
            <TrendingUp size={14} className="mr-1 text-green-400" />
            Top Gainer
          </h4>
          <div className="flex items-center space-x-2">
            <p className="font-bold text-white text-lg">
              {topGainer.symbol.toUpperCase()}
            </p>
            <p className="text-green-400 font-semibold">
              +{topGainer.price_change_percentage_24h_in_currency?.toFixed(2)}%
            </p>
          </div>
          <p className="text-gray-400 text-sm">
            ${topGainer.current_price.toFixed(2)}
          </p>
        </div>

        {/* Top Loser */}
        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
            <TrendingDown size={14} className="mr-1 text-red-400" />
            Top Loser
          </h4>
          <div className="flex items-center space-x-2">
            <p className="font-bold text-white text-lg">
              {topLoser.symbol.toUpperCase()}
            </p>
            <p className="text-red-400 font-semibold">
              {topLoser.price_change_percentage_24h_in_currency?.toFixed(2)}%
            </p>
          </div>
          <p className="text-gray-400 text-sm">
            ${topLoser.current_price.toFixed(2)}
          </p>
        </div>

        {/* Total Volume */}
        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
            <DollarSign size={14} className="mr-1 text-blue-400" />
            Total Volume
          </h4>
          <p className="font-bold text-white text-lg">
            {formatLargeNumber(totalVolume)}
          </p>
          <p className="text-gray-400 text-sm">
            Across {cryptoData.length} coins
          </p>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-6 pt-4 border-t border-gray-600">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-orange-400">
              $
              {cryptoData
                .find((c) => c.id === "bitcoin")
                ?.current_price.toFixed(0) || "N/A"}
            </p>
            <p className="text-sm text-gray-400">Bitcoin Price</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">
              $
              {cryptoData
                .find((c) => c.id === "ethereum")
                ?.current_price.toFixed(0) || "N/A"}
            </p>
            <p className="text-sm text-gray-400">Ethereum Price</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {cryptoData.length}
            </p>
            <p className="text-sm text-gray-400">Coins Tracked</p>
          </div>
        </div>
      </div>
    </div>
  );
}
