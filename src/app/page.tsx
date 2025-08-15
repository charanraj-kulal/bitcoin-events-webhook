"use client";
import { useEffect, useState } from "react";
import { getBitcoinMarketData, getBitcoinDetails } from "@/app/lib/coingecko";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface BitcoinDetails {
  name: string;
  symbol: string;
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
  };
}

export default function Home() {
  const [chartData, setChartData] = useState([]);
  const [details, setDetails] = useState<BitcoinDetails | null>(null);

  useEffect(() => {
    async function fetchData() {
      const market = await getBitcoinMarketData();
      const det = await getBitcoinDetails();

      const formattedData = market.prices.map(
        ([timestamp, price]: [number, number]) => ({
          time: new Date(timestamp).toLocaleTimeString(),
          price: Number(price.toFixed(2)),
        })
      );

      setChartData(formattedData);
      setDetails(det);
    }

    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Bitcoin Events Dashboard</h1>
      {details && (
        <div style={{ marginBottom: 20 }}>
          <h2>
            {details.name} ({details.symbol.toUpperCase()})
          </h2>
          <p>
            Current Price: $
            {details.market_data.current_price.usd.toLocaleString()}
          </p>
          <p>
            Market Cap: ${details.market_data.market_cap.usd.toLocaleString()}
          </p>
        </div>
      )}

      <LineChart width={800} height={400} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis dataKey="price" />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#f7931a" />
      </LineChart>
    </div>
  );
}
