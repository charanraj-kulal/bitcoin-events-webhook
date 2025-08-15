"use client";
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
} from "lucide-react";

interface MarketEvent {
  id: string;
  type: "price_spike" | "price_drop" | "volume_surge" | "new_high" | "new_low";
  coin: string;
  symbol: string;
  message: string;
  timestamp: Date;
  severity: "low" | "medium" | "high";
  value?: number;
  percentage?: number;
}

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  total_volume: number;
  image: string;
}

interface LiveEventsProps {
  cryptoData: Array<CryptoData>;
}

export default function LiveEvents({ cryptoData }: LiveEventsProps) {
  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [previousPrices, setPreviousPrices] = useState<Record<string, number>>(
    {}
  );

  const generateEvent = (
    type: MarketEvent["type"],
    coin: CryptoData,
    message: string,
    severity: MarketEvent["severity"],
    value?: number,
    percentage?: number
  ): MarketEvent => ({
    id: `${Date.now()}-${Math.random()}`,
    type,
    coin: coin.name,
    symbol: coin.symbol,
    message,
    timestamp: new Date(),
    severity,
    value,
    percentage,
  });

  const checkForEvents = () => {
    if (cryptoData.length === 0) return;

    const newEvents: MarketEvent[] = [];

    cryptoData.forEach((coin) => {
      const prevPrice = previousPrices[coin.id];
      const currentPrice = coin.current_price;

      if (prevPrice && prevPrice !== currentPrice) {
        const priceChange = ((currentPrice - prevPrice) / prevPrice) * 100;

        // Significant price movements (>2% in update interval)
        if (Math.abs(priceChange) > 2) {
          const eventType = priceChange > 0 ? "price_spike" : "price_drop";
          const severity =
            Math.abs(priceChange) > 5
              ? "high"
              : Math.abs(priceChange) > 3
              ? "medium"
              : "low";

          newEvents.push(
            generateEvent(
              eventType,
              coin,
              `${coin.name} ${
                priceChange > 0 ? "surged" : "dropped"
              } ${Math.abs(priceChange).toFixed(2)}% to $${currentPrice.toFixed(
                2
              )}`,
              severity,
              currentPrice,
              priceChange
            )
          );
        }
      }

      // Volume surge detection
      if (coin.total_volume > 1e9) {
        // Large volume
        newEvents.push(
          generateEvent(
            "volume_surge",
            coin,
            `High trading volume detected for ${coin.name}: $${(
              coin.total_volume / 1e9
            ).toFixed(2)}B`,
            "medium",
            coin.total_volume
          )
        );
      }

      // Price milestones
      if (coin.id === "bitcoin" && currentPrice > 70000) {
        newEvents.push(
          generateEvent(
            "new_high",
            coin,
            `Bitcoin reaches $${currentPrice.toFixed(
              0
            )} - Above $70K resistance!`,
            "high",
            currentPrice
          )
        );
      }

      // 24h change alerts
      if (coin.price_change_percentage_24h_in_currency) {
        if (coin.price_change_percentage_24h_in_currency > 10) {
          newEvents.push(
            generateEvent(
              "price_spike",
              coin,
              `${
                coin.name
              } gained ${coin.price_change_percentage_24h_in_currency.toFixed(
                2
              )}% in 24h!`,
              "high",
              currentPrice,
              coin.price_change_percentage_24h_in_currency
            )
          );
        } else if (coin.price_change_percentage_24h_in_currency < -10) {
          newEvents.push(
            generateEvent(
              "price_drop",
              coin,
              `${coin.name} fell ${Math.abs(
                coin.price_change_percentage_24h_in_currency
              ).toFixed(2)}% in 24h`,
              "high",
              currentPrice,
              coin.price_change_percentage_24h_in_currency
            )
          );
        }
      }
    });

    // Update previous prices
    const newPreviousPrices: Record<string, number> = {};
    cryptoData.forEach((coin) => {
      newPreviousPrices[coin.id] = coin.current_price;
    });
    setPreviousPrices(newPreviousPrices);
    if (newEvents.length > 0) {
      setEvents((prev) => [...newEvents, ...prev].slice(0, 20));
    }
  };

  useEffect(() => {
    checkForEvents();
  }, [cryptoData]);

  const getEventIcon = (type: MarketEvent["type"]) => {
    switch (type) {
      case "price_spike":
      case "new_high":
        return <TrendingUp className="text-green-400" size={16} />;
      case "price_drop":
      case "new_low":
        return <TrendingDown className="text-red-400" size={16} />;
      case "volume_surge":
        return <Activity className="text-blue-400" size={16} />;
      default:
        return <AlertTriangle className="text-yellow-400" size={16} />;
    }
  };

  const getEventColor = (severity: MarketEvent["severity"]) => {
    switch (severity) {
      case "high":
        return "border-l-red-500 bg-red-900/20";
      case "medium":
        return "border-l-yellow-500 bg-yellow-900/20";
      case "low":
        return "border-l-green-500 bg-green-900/20";
      default:
        return "border-l-gray-500 bg-gray-900/20";
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - timestamp.getTime()) / 1000
    );

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <Activity className="mr-2 text-orange-400" size={20} />
          Live Market Events
        </h3>
        <div className="text-sm text-gray-400">
          {events.length} events tracked
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {events.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Monitoring for market events... Events will appear as they happen!
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`p-4 rounded-lg border-l-4 ${getEventColor(
                event.severity
              )} transition-all duration-300 hover:bg-gray-700/50`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getEventIcon(event.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {event.message}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-400 uppercase font-medium">
                        {event.symbol}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(event.timestamp)}
                      </span>
                      {event.severity === "high" && (
                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                          HIGH IMPACT
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {event.value && (
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">
                      ${event.value.toFixed(2)}
                    </p>
                    {event.percentage && (
                      <p
                        className={`text-xs ${
                          event.percentage > 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {event.percentage > 0 ? "+" : ""}
                        {event.percentage.toFixed(2)}%
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
