import { CarbonProject, CurrencyDetails, Block, Transaction } from './types';

export const CURRENCY_LIST: CurrencyDetails[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1.0 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToUSD: 83.5 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateToUSD: 1.35 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateToUSD: 1.51 },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', rateToUSD: 1.63 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.79 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rateToUSD: 3.67 },
  { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92 }
];

export const INITIAL_PROJECTS: CarbonProject[] = [
  {
    id: 'proj-01',
    name: 'Amazon Rainforest Protection Zone',
    type: 'Forestry',
    location: 'Amazonas Basin',
    country: 'Brazil',
    ownerName: 'Rainforest Alliance Co-op',
    ownerType: 'Cooperative',
    verifiedCredits: 124500,
    soldCredits: 38200,
    pricePerCreditUSD: 24.50,
    sequestrationRate: 45.2,
    latitude: -3.4653,
    longitude: -62.2159,
    description: 'Protecting continuous old-growth rainforest from logging and agricultural encroachment. High species density and telemetry sensors provide continuous canopy carbon tracking.',
    telemetryLogs: [
      { timestamp: '08:00', reading: 45.2, status: 'Optimal' },
      { timestamp: '09:00', reading: 45.3, status: 'Optimal' },
      { timestamp: '10:00', reading: 45.1, status: 'Optimal' },
      { timestamp: '11:00', reading: 45.4, status: 'Optimal' }
    ]
  },
  {
    id: 'proj-02',
    name: 'Himachal Smallholder Agroforestry League',
    type: 'Agroforestry',
    location: 'Mandi Hills, Himachal Pradesh',
    country: 'India',
    ownerName: 'Dev Raj & 450 Family Farmers',
    ownerType: 'Farmer',
    verifiedCredits: 62800,
    soldCredits: 29400,
    pricePerCreditUSD: 18.00,
    sequestrationRate: 21.8,
    latitude: 31.5822,
    longitude: 76.9182,
    description: 'Empowering local smallholders to plant mixed fruit and timber trees alongside traditional crops. Integrates digital smart ledger for secure credit aggregation and monitoring.',
    telemetryLogs: [
      { timestamp: '08:00', reading: 21.4, status: 'Optimal' },
      { timestamp: '09:00', reading: 21.8, status: 'Optimal' },
      { timestamp: '10:00', reading: 22.1, status: 'Optimal' },
      { timestamp: '11:00', reading: 21.9, status: 'Optimal' }
    ]
  },
  {
    id: 'proj-03',
    name: 'Southern Cross Sea Meadows',
    type: 'Blue Carbon',
    location: 'Shark Bay, Western Australia',
    country: 'Australia',
    ownerName: 'Oceania Seagrass Reserve Fund',
    ownerType: 'Natural Reserve',
    verifiedCredits: 89000,
    soldCredits: 12000,
    pricePerCreditUSD: 32.00,
    sequestrationRate: 33.5,
    latitude: -25.8014,
    longitude: 113.7891,
    description: 'Restoring and conserving massive sub-aquatic Posidonia seagrass meadows, capturing organic carbon up to 40 times faster than terrestrial forests.',
    telemetryLogs: [
      { timestamp: '08:00', reading: 33.1, status: 'Optimal' },
      { timestamp: '09:00', reading: 33.4, status: 'Optimal' },
      { timestamp: '10:00', reading: 33.6, status: 'Optimal' },
      { timestamp: '11:00', reading: 33.5, status: 'Optimal' }
    ]
  },
  {
    id: 'proj-04',
    name: 'Sumatra Peatland Hydrated Reserve',
    type: 'Peatland',
    location: 'Kampar Peninsula, Sumatra',
    country: 'Indonesia',
    ownerName: 'Peat Restoration NGO',
    ownerType: 'NGO',
    verifiedCredits: 210000,
    soldCredits: 145000,
    pricePerCreditUSD: 28.00,
    sequestrationRate: 72.3,
    latitude: 0.2831,
    longitude: 102.6667,
    description: 'Rewetting and closing drainage canals in critical tropical peatlands of Sumatra. Inhibits massive soil oxidation to preserve thousands of carbon tons.',
    telemetryLogs: [
      { timestamp: '08:00', reading: 71.9, status: 'Optimal' },
      { timestamp: '09:00', reading: 72.1, status: 'Optimal' },
      { timestamp: '10:00', reading: 72.4, status: 'Optimal' },
      { timestamp: '11:00', reading: 72.3, status: 'Optimal' }
    ]
  },
  {
    id: 'proj-05',
    name: 'Canterbury Plains Regulated Soil Farm',
    type: 'Soil Carbon',
    location: 'Canterbury, South Island',
    country: 'New Zealand',
    ownerName: 'Alistair Ross & Sons Estates',
    ownerType: 'Farmer',
    verifiedCredits: 42000,
    soldCredits: 8500,
    pricePerCreditUSD: 19.50,
    sequestrationRate: 14.2,
    latitude: -43.6214,
    longitude: 172.0911,
    description: 'Advocating multi-species pasture and regenerative organic agriculture. Verified using deep soil sensor probes and core-sample telemetry reports.',
    telemetryLogs: [
      { timestamp: '08:00', reading: 14.0, status: 'Optimal' },
      { timestamp: '09:00', reading: 14.1, status: 'Optimal' },
      { timestamp: '10:00', reading: 14.3, status: 'Optimal' },
      { timestamp: '11:00', reading: 14.2, status: 'Optimal' }
    ]
  },
  {
    id: 'proj-06',
    name: 'Cairngorms Caledonian Forest Initiative',
    type: 'Forestry',
    location: 'Cairngorms National Park',
    country: 'United Kingdom',
    ownerName: 'Highland Conservation Trust',
    ownerType: 'Natural Reserve',
    verifiedCredits: 55000,
    soldCredits: 17200,
    pricePerCreditUSD: 29.00,
    sequestrationRate: 19.5,
    latitude: 57.0850,
    longitude: -3.5350,
    description: 'Reintroducing native Scot’s Pine, Rowan, and Birch to expand ancient Caledonian woodlands. Backed by rigorous microclimate sensor tracking.',
    telemetryLogs: [
      { timestamp: '08:00', reading: 19.2, status: 'Optimal' },
      { timestamp: '09:00', reading: 19.5, status: 'Optimal' },
      { timestamp: '10:00', reading: 19.7, status: 'Optimal' },
      { timestamp: '11:00', reading: 19.5, status: 'Optimal' }
    ]
  },
  {
    id: 'proj-07',
    name: 'Al Marmoom Desert Mangrove Zone',
    type: 'Blue Carbon',
    location: 'Al Marmoom Biosphere Reserve',
    country: 'United Arab Emirates',
    ownerName: 'Emirates Environmental Reserve Authority',
    ownerType: 'Natural Reserve',
    verifiedCredits: 78000,
    soldCredits: 22000,
    pricePerCreditUSD: 35.00,
    sequestrationRate: 26.4,
    latitude: 24.8322,
    longitude: 55.3021,
    description: 'Establishing desert mangrove wetlands fed by smart recycled water pipelines. Demonstrates the extreme viability of hyper-arid blue carbon zones.',
    telemetryLogs: [
      { timestamp: '08:00', reading: 25.9, status: 'Optimal' },
      { timestamp: '09:00', reading: 26.2, status: 'Optimal' },
      { timestamp: '10:00', reading: 26.5, status: 'Optimal' },
      { timestamp: '11:00', reading: 26.4, status: 'Optimal' }
    ]
  }
];

export function calculateBlockHash(
  index: number,
  previousHash: string,
  timestamp: string,
  transactions: Transaction[],
  nonce: number
): string {
  const str = index + previousHash + timestamp + JSON.stringify(transactions) + nonce;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Create a 64-character hash using multiple rounds
  let finalHash = '';
  for (let i = 0; i < 8; i++) {
    const roundSeed = Math.abs(hash * (i + 17) + 0x3f5c71a3) % 4294967296;
    finalHash += roundSeed.toString(16).padStart(8, '0');
  }
  return finalHash.substring(0, 64);
}

// Generate some authentic-looking initial blocks in our chain
export const getGenesisBlock = (): Block => {
  const genesisTx: Transaction = {
    id: 'tx-genesis',
    sellerId: 'proj-01',
    sellerName: 'Amazon Rainforest Protection Zone',
    buyerName: 'Global Carbon Initiative',
    buyerCompany: 'UN Green Transition Org',
    buyerCountry: 'Switzerland',
    credits: 1000,
    currency: 'USD',
    pricePerCredit: 24.50,
    totalAmount: 24500,
    projectName: 'Amazon Rainforest Protection Zone',
    timestamp: '2026-06-10T12:00:00Z',
    signature: '7f9a2e3f81e80...sig_verified'
  };

  const index = 0;
  const previousHash = '0000000000000000000000000000000000000000000000000000000000000000';
  const timestamp = '2026-06-10T12:00:00Z';
  const transactions = [genesisTx];
  const nonce = 422;
  const hash = calculateBlockHash(index, previousHash, timestamp, transactions, nonce);

  return {
    index,
    timestamp,
    transactions,
    previousHash,
    hash,
    nonce
  };
};

export const getPreminedBlocks = (): Block[] => {
  const genesis = getGenesisBlock();
  
  // Block 1
  const tx1: Transaction = {
    id: 'tx-001',
    sellerId: 'proj-02',
    sellerName: 'Himachal Smallholder Agroforestry League',
    buyerName: 'Hiroshi Tanaka',
    buyerCompany: 'Aki Climate Solutions',
    buyerCountry: 'Japan',
    credits: 500,
    currency: 'INR',
    pricePerCredit: 1503, // approx 18 USD in INR
    totalAmount: 751500,
    projectName: 'Himachal Smallholder Agroforestry League',
    timestamp: '2026-06-12T14:30:00Z',
    signature: '3da8b21ef002c...sig_verified'
  };

  const block1Index = 1;
  const block1Timestamp = '2026-06-12T14:35:00Z';
  const block1TxList = [tx1];
  const block1Nonce = 9811;
  const block1Hash = calculateBlockHash(block1Index, genesis.hash, block1Timestamp, block1TxList, block1Nonce);

  const block1: Block = {
    index: block1Index,
    timestamp: block1Timestamp,
    transactions: block1TxList,
    previousHash: genesis.hash,
    hash: block1Hash,
    nonce: block1Nonce
  };

  // Block 2
  const tx2: Transaction = {
    id: 'tx-002',
    sellerId: 'proj-03',
    sellerName: 'Southern Cross Sea Meadows',
    buyerName: 'Emily Vance',
    buyerCompany: 'Vanguard Invest',
    buyerCountry: 'United Kingdom',
    credits: 300,
    currency: 'AUD',
    pricePerCredit: 48.32, // approx 32 USD in AUD
    totalAmount: 14496,
    projectName: 'Southern Cross Sea Meadows',
    timestamp: '2026-06-13T09:12:00Z',
    signature: 'f4b10ed2c33ef...sig_verified'
  };

  const tx3: Transaction = {
    id: 'tx-003',
    sellerId: 'proj-05',
    sellerName: 'Canterbury Plains Regulated Soil Farm',
    buyerName: 'Dev Raj',
    buyerCompany: 'Pacific Green Fund',
    buyerCountry: 'Singapore',
    credits: 150,
    currency: 'NZD',
    pricePerCredit: 31.78, // approx 19.50 USD in NZD
    totalAmount: 4767,
    projectName: 'Canterbury Plains Regulated Soil Farm',
    timestamp: '2026-06-13T10:00:00Z',
    signature: '0ec3f7e91d5cb...sig_verified'
  };

  const block2Index = 2;
  const block2Timestamp = '2026-06-13T10:15:00Z';
  const block2TxList = [tx2, tx3];
  const block2Nonce = 15309;
  const block2Hash = calculateBlockHash(block2Index, block1.hash, block2Timestamp, block2TxList, block2Nonce);

  const block2: Block = {
    index: block2Index,
    timestamp: block2Timestamp,
    transactions: block2TxList,
    previousHash: block1.hash,
    hash: block2Hash,
    nonce: block2Nonce
  };

  return [genesis, block1, block2];
};
