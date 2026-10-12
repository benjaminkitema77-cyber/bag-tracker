
const API_URL = "https://open.er-api.com/v6/latest/USD";

export async function fetchExchangeRates() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Exchange-rate request failed (${response.status}).`);
  }

  const data = await response.json();

  if (
    data.result !== "success" ||
    !data.rates ||
    typeof data.rates.USD !== "number"
  ) {
    throw new Error("The exchange-rate API returned invalid data.");
  }

  return {
    rates: data.rates,
    updatedAt: data.time_last_update_utc || "Unknown",
  };
}
