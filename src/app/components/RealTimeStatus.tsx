"use client";
import { useState, useEffect } from "react";
import { Wifi, WifiOff, Clock } from "lucide-react";

interface RealTimeStatusProps {
  lastUpdate: Date;
  isConnected: boolean;
  updateInterval: number; // in seconds
}

export default function RealTimeStatus({
  lastUpdate,
  isConnected,
  updateInterval,
}: RealTimeStatusProps) {
  const [timeAgo, setTimeAgo] = useState("");
  const [nextUpdate, setNextUpdate] = useState(updateInterval);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor(
        (now.getTime() - lastUpdate.getTime()) / 1000
      );

      if (diffInSeconds < 60) {
        setTimeAgo(`${diffInSeconds}s ago`);
      } else if (diffInSeconds < 3600) {
        setTimeAgo(`${Math.floor(diffInSeconds / 60)}m ago`);
      } else {
        setTimeAgo(`${Math.floor(diffInSeconds / 3600)}h ago`);
      }

      // Calculate next update countdown
      const timeSinceLastUpdate = diffInSeconds;
      const timeToNext =
        updateInterval - (timeSinceLastUpdate % updateInterval);
      setNextUpdate(timeToNext);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate, updateInterval]);

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`px-4 py-2 rounded-lg shadow-lg flex items-center space-x-3 ${
          isConnected ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {isConnected ? (
          <Wifi size={16} className="text-white" />
        ) : (
          <WifiOff size={16} className="text-white" />
        )}

        <div className="text-white text-sm">
          <div className="flex items-center space-x-2">
            <Clock size={14} />
            <span>Updated {timeAgo}</span>
          </div>
          {isConnected && (
            <div className="text-xs opacity-80">
              Next update in {nextUpdate}s
            </div>
          )}
        </div>

        {isConnected && (
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        )}
      </div>
    </div>
  );
}
