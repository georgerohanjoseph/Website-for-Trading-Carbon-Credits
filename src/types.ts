export type Currency = 'INR' | 'SGD' | 'AUD' | 'NZD' | 'USD' | 'GBP' | 'AED' | 'EUR';

export interface CurrencyDetails {
  code: Currency;
  symbol: string;
  name: string;
  rateToUSD: number; // exchange rate helper
}

export interface CarbonProject {
  id: string;
  name: string;
  type: 'Forestry' | 'Agroforestry' | 'Blue Carbon' | 'Soil Carbon' | 'Renewable Energy' | 'Peatland';
  location: string;
  country: string;
  ownerName: string;
  ownerType: 'Farmer' | 'Natural Reserve' | 'Cooperative' | 'NGO';
  verifiedCredits: number; // total tCO2e available
  soldCredits: number;
  pricePerCreditUSD: number; // Base price in USD
  sequestrationRate: number; // tCO2e per hour (realtime simulation)
  telemetryLogs: { timestamp: string; reading: number; status: 'Active' | 'Optimal' | 'Alert' }[];
  latitude: number;
  longitude: number;
  description: string;
}

export interface Transaction {
  id: string;
  sellerId: string;
  sellerName: string;
  buyerName: string;
  buyerCompany: string;
  buyerCountry: string;
  credits: number; // tons of CO2
  currency: Currency;
  pricePerCredit: number; // converted price
  totalAmount: number;
  projectName: string;
  timestamp: string;
  signature: string; // crypto-style signature
}

export interface Block {
  index: number;
  timestamp: string;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface TelemetryReading {
  timestamp: string;
  sequestration: number; // cumulative
  sensorHealth: number; // percentage
  humidity: number;
  temperature: number;
}
