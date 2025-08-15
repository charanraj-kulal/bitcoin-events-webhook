import axios from "axios";

const API_KEY = "CG-PhBcbpbRk7J5dpseTsTMhWEm";
const BASE_URL = "https://api.coingecko.com/api/v3";

const headers = {
  accept: "application/json",
  "x-cg-demo-api-key": API_KEY,
};

export async function getBitcoinMarketData() {
  const res = await axios.get(
    `${BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=2`,
    { headers }
  );
  return res.data;
}

export async function getBitcoinDetails() {
  const res = await axios.get(`${BASE_URL}/coins/bitcoin`, { headers });
  return res.data;
}
