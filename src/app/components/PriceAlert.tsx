"use client";
import React, { useState, useEffect } from "react";
import { Bell, Plus, X } from "lucide-react";

interface PriceAlertProps {
  cryptoData: Array<{
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    image: string;
  }>;
}

interface Alert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  condition: "above" | "below";
  isActive: boolean;
  createdAt: Date;
}

export default function PriceAlert({ cryptoData }: PriceAlertProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState<"above" | "below">("above");

  const createAlert = () => {
    const coin = cryptoData.find((c) => c.id === selectedCoin);
    if (!coin || !targetPrice) return;

    const newAlert: Alert = {
      id: Date.now().toString(),
      coinId: coin.id,
      coinName: coin.name,
      coinSymbol: coin.symbol,
      targetPrice: parseFloat(targetPrice),
      condition,
      isActive: true,
      createdAt: new Date(),
    };

    setAlerts([...alerts, newAlert]);
    setShowCreateAlert(false);
    setSelectedCoin("");
    setTargetPrice("");
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId));
  };

  const checkAlerts = () => {
    const triggeredAlerts = alerts.filter((alert) => {
      const coin = cryptoData.find((c) => c.id === alert.coinId);
      if (!coin || !alert.isActive) return false;

      if (alert.condition === "above") {
        return coin.current_price >= alert.targetPrice;
      } else {
        return coin.current_price <= alert.targetPrice;
      }
    });

    triggeredAlerts.forEach((alert) => {
      // Simulate notification
      if (Notification.permission === "granted") {
        new Notification(`Price Alert: ${alert.coinName}`, {
          body: `${alert.coinSymbol.toUpperCase()} has reached your target price!`,
          icon: cryptoData.find((c) => c.id === alert.coinId)?.image,
        });
      }
    });

    return triggeredAlerts;
  };

  // Check for triggered alerts whenever crypto data changes
  useEffect(() => {
    if (cryptoData.length > 0) {
      checkAlerts();
    }
  }, [cryptoData]);

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center">
          <Bell className="mr-2" size={20} />
          Price Alerts ({alerts.filter((a) => a.isActive).length})
        </h3>
        <button
          onClick={() => setShowCreateAlert(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center text-sm"
        >
          <Plus size={16} className="mr-1" />
          New Alert
        </button>
      </div>

      {/* Create Alert Modal */}
      {showCreateAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Create Price Alert</h4>
              <button
                onClick={() => setShowCreateAlert(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cryptocurrency
                </label>
                <select
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                >
                  <option value="">Select a cryptocurrency</option>
                  {cryptoData.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) =>
                    setCondition(e.target.value as "above" | "below")
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                >
                  <option value="above">Price goes above</option>
                  <option value="below">Price drops below</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Enter target price"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={createAlert}
                  disabled={!selectedCoin || !targetPrice}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg"
                >
                  Create Alert
                </button>
                <button
                  onClick={() => setShowCreateAlert(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Alerts */}
      <div className="space-y-3">
        {alerts.filter((alert) => alert.isActive).length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No active alerts. Create one to get notified of price changes!
          </p>
        ) : (
          alerts
            .filter((alert) => alert.isActive)
            .map((alert) => {
              const coin = cryptoData.find((c) => c.id === alert.coinId);
              const currentPrice = coin?.current_price || 0;
              const isTriggered =
                alert.condition === "above"
                  ? currentPrice >= alert.targetPrice
                  : currentPrice <= alert.targetPrice;

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    isTriggered
                      ? "bg-green-900 border-green-600"
                      : "bg-gray-700 border-gray-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {coin && (
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-8 h-8"
                        />
                      )}
                      <div>
                        <h5 className="font-semibold">{alert.coinName}</h5>
                        <p className="text-sm text-gray-400">
                          Alert when price goes {alert.condition} $
                          {alert.targetPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Current Price</p>
                        <p className="font-semibold">
                          ${currentPrice.toFixed(2)}
                        </p>
                      </div>
                      {isTriggered && (
                        <div className="text-green-400 text-sm font-semibold">
                          TRIGGERED!
                        </div>
                      )}
                      <button
                        onClick={() => deleteAlert(alert.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
