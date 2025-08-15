import axios from "axios";

const API_KEY = "CG-PhBcbpbRk7J5dpseTsTMhWEm";
const BASE_URL = "https://api.coingecko.com/api/v3";

const headers = {
  accept: "application/json",
  "x-cg-demo-api-key": API_KEY,
};

// Get comprehensive market data for multiple cryptocurrencies
export async function getCryptoMarketData() {
  const res = await axios.get(
    `${BASE_URL}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,cardano,solana,polkadot,dogecoin,polygon,chainlink,avalanche-2&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=1h,24h,7d`,
    { headers }
  );
  return res.data;
}

// Get historical data for charts
export async function getBitcoinMarketData() {
  const res = await axios.get(
    `${BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=7`,
    { headers }
  );
  return res.data;
}

// Get detailed info for a specific coin
export async function getBitcoinDetails() {
  const res = await axios.get(`${BASE_URL}/coins/bitcoin`, { headers });
  return res.data;
}

// Get global market stats
export async function getGlobalMarketStats() {
  const res = await axios.get(`${BASE_URL}/global`, { headers });
  return res.data;
}

// Get trending coins
export async function getTrendingCoins() {
  const res = await axios.get(`${BASE_URL}/search/trending`, { headers });
  return res.data;
}

// Get fear & greed index (alternative API - free)
export async function getFearGreedIndex() {
  try {
    const res = await axios.get("https://api.alternative.me/fng/");
    return res.data;
  } catch (error) {
    console.warn("Fear & Greed API unavailable:", error);
    return null;
  }
}
