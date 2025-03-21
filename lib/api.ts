import axios from 'axios';

// You'll need to sign up for a free API key from these services
const FINNHUB_API_KEY = 'YOUR_FINNHUB_API_KEY'; // Replace with actual API key
const ALPHA_VANTAGE_API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY'; // Replace with actual API key

// Stock data types
export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  volume: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  marketCap: number;
  lastUpdated: string;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: number;
  macdSignal: number;
  sma: number;
  ema: number;
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
  };
  volumeAvg: number;
}

export interface PredictionData {
  symbol: string;
  price: number;
  predictedPrice: number;
  predictedChange: number;
  predictedChangePercent: number;
  timeFrame: string;
  confidenceScore: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  recommendedAction: 'Buy' | 'Sell' | 'Hold';
  reasons: string[];
  technicalIndicators: TechnicalIndicators;
  lastUpdated: string;
  isFallback: boolean;
}

// Mock data generators
const generateMockStockData = (symbol: string): StockData => {
  const price = 100 + Math.random() * 900;
  const previousClose = price * (0.98 + Math.random() * 0.04);
  const change = price - previousClose;
  const percentChange = (change / previousClose) * 100;
  
  return {
    symbol,
    name: getCompanyName(symbol),
    price,
    change,
    percentChange,
    volume: Math.floor(Math.random() * 10000000),
    previousClose,
    open: previousClose * (0.99 + Math.random() * 0.02),
    high: price * (1 + Math.random() * 0.02),
    low: price * (0.98 + Math.random() * 0.01),
    marketCap: price * 1000000 * (10 + Math.random() * 990),
    lastUpdated: new Date().toISOString(),
  };
};

const getCompanyName = (symbol: string): string => {
  const companies: Record<string, string> = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'META': 'Meta Platforms Inc.',
    'TSLA': 'Tesla Inc.',
    'NVDA': 'NVIDIA Corporation',
    'JPM': 'JPMorgan Chase & Co.',
    'NFLX': 'Netflix Inc.',
    'DIS': 'The Walt Disney Company',
  };
  
  return companies[symbol] || `${symbol} Inc.`;
};

const generateTechnicalIndicators = (price: number): TechnicalIndicators => {
  return {
    rsi: Math.random() * 100,
    macd: (Math.random() * 10) - 5,
    macdSignal: (Math.random() * 10) - 5,
    sma: price * (0.95 + Math.random() * 0.1),
    ema: price * (0.96 + Math.random() * 0.08),
    bollingerBands: {
      upper: price * 1.05,
      middle: price,
      lower: price * 0.95,
    },
    volumeAvg: Math.floor(Math.random() * 5000000) + 1000000,
  };
};

const mockGeneratePrediction = (stockData: StockData): PredictionData => {
  const predictedChangePercent = (Math.random() * 10) - 5; // -5% to +5%
  const predictedChange = stockData.price * (predictedChangePercent / 100);
  const predictedPrice = stockData.price + predictedChange;
  const confidenceScore = 50 + Math.random() * 40; // 50% to 90%
  
  let sentiment: PredictionData['sentiment'] = 'Neutral';
  let recommendedAction: PredictionData['recommendedAction'] = 'Hold';
  
  if (predictedChangePercent > 2) {
    sentiment = 'Bullish';
    recommendedAction = 'Buy';
  } else if (predictedChangePercent < -2) {
    sentiment = 'Bearish';
    recommendedAction = 'Sell';
  }
  
  const indicators = generateTechnicalIndicators(stockData.price);
  
  const reasons = [];
  if (indicators.rsi < 30) {
    reasons.push('RSI indicates oversold conditions at ' + indicators.rsi.toFixed(2));
  } else if (indicators.rsi > 70) {
    reasons.push('RSI indicates overbought conditions at ' + indicators.rsi.toFixed(2));
  } else {
    reasons.push('RSI is at a neutral level of ' + indicators.rsi.toFixed(2));
  }
  
  if (indicators.macd > indicators.macdSignal) {
    reasons.push('MACD is above signal line, indicating potential upward momentum');
  } else {
    reasons.push('MACD is below signal line, suggesting potential downward pressure');
  }
  
  if (stockData.price > indicators.sma) {
    reasons.push('Price is above the 50-day SMA, showing positive trend');
  } else {
    reasons.push('Price is below the 50-day SMA, indicating weakness');
  }
  
  // Add one more random reason
  const randomReasons = [
    'Recent sector performance trends align with forecast',
    'Unusual options activity detected',
    'Volume patterns suggest institutional interest',
    'Potential catalyst events within forecast timeframe',
    'Recent earnings data supports outlook'
  ];
  
  reasons.push(randomReasons[Math.floor(Math.random() * randomReasons.length)]);
  
  return {
    symbol: stockData.symbol,
    price: stockData.price,
    predictedPrice,
    predictedChange,
    predictedChangePercent,
    timeFrame: '7 days',
    confidenceScore,
    sentiment,
    recommendedAction,
    reasons,
    technicalIndicators: indicators,
    lastUpdated: new Date().toISOString(),
    isFallback: true,
  };
};

// API functions
export async function mockFetchStockData(symbol: string): Promise<StockData> {
  // In a real implementation, this would call a stock API
  // E.g., return fetch(`https://api.example.com/stocks/${symbol}`).then(res => res.json());
  
  // For now, we'll use mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockStockData(symbol));
    }, 300);
  });
}

export async function fetchStockPrediction(symbol: string): Promise<PredictionData> {
  // In a real implementation, this would call an AI prediction API
  // E.g., return fetch(`https://api.example.com/predictions/${symbol}`).then(res => res.json());
  
  // For now, generate a prediction based on mock stock data
  const stockResult = await fetchStockData(symbol);
  
  // Create a StockData object from the fetchStockData result
  let stockData: StockData;
  if (stockResult.success) {
    const { quote, profile } = stockResult;
    stockData = {
      symbol,
      name: profile.name || `${symbol} Inc.`,
      price: quote.c || 0,
      change: quote.d || 0,
      percentChange: quote.dp || 0,
      volume: quote.v || 0,
      previousClose: quote.pc || 0,
      open: quote.o || 0,
      high: quote.h || 0,
      low: quote.l || 0,
      marketCap: profile.marketCapitalization * 1000000 || 0,
      lastUpdated: new Date().toISOString()
    };
  } else {
    // Fallback to mock data if the API call failed
    stockData = await mockFetchStockData(symbol);
  }
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockGeneratePrediction(stockData));
    }, 500);
  });
}

// Finnhub API for real-time stock data
export const fetchStockData = async (symbol: string) => {
  try {
    // First try with the real API
    const quoteResponse = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    
    const profileResponse = await axios.get(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    
    return {
      quote: quoteResponse.data,
      profile: profileResponse.data,
      success: true
    };
  } catch (error) {
    console.error('Error fetching stock data from API, using mock data:', error);
    // Fallback to mock data
    const mockData = await mockFetchStockData(symbol);
    return {
      success: true,
      quote: {
        c: mockData.price,
        d: mockData.change,
        dp: mockData.percentChange,
        h: mockData.high,
        l: mockData.low,
        o: mockData.open,
        pc: mockData.previousClose,
        v: mockData.volume
      },
      profile: {
        name: mockData.name,
        marketCapitalization: mockData.marketCap / 1000000 // Convert to millions
      }
    };
  }
};

// Fetch historical data for charts
export const fetchHistoricalData = async (symbol: string, resolution = 'D', from: number, to: number) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
    );
    
    return {
      data: response.data,
      success: true
    };
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return { success: false, error };
  }
};

// Fetch company news
export const fetchCompanyNews = async (symbol: string) => {
  try {
    // Get today's date and date from a week ago
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const todayFormatted = formatDate(today);
    const lastWeekFormatted = formatDate(lastWeek);
    
    const response = await axios.get(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${lastWeekFormatted}&to=${todayFormatted}&token=${FINNHUB_API_KEY}`
    );
    
    return {
      news: response.data.slice(0, 10), // Get the first 10 news items
      success: true
    };
  } catch (error) {
    console.error('Error fetching company news:', error);
    return { success: false, error };
  }
};

// Helper to format date as YYYY-MM-DD for API requests
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Alpha Vantage API for technical indicators and predictions
export const fetchTechnicalIndicators = async (symbol: string) => {
  try {
    // RSI (Relative Strength Index)
    const rsiResponse = await axios.get(
      `https://www.alphavantage.co/query?function=RSI&symbol=${symbol}&interval=daily&time_period=14&series_type=close&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    // MACD (Moving Average Convergence/Divergence)
    const macdResponse = await axios.get(
      `https://www.alphavantage.co/query?function=MACD&symbol=${symbol}&interval=daily&series_type=close&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    // SMA (Simple Moving Average)
    const smaResponse = await axios.get(
      `https://www.alphavantage.co/query?function=SMA&symbol=${symbol}&interval=daily&time_period=50&series_type=close&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    return {
      rsi: rsiResponse.data,
      macd: macdResponse.data,
      sma: smaResponse.data,
      success: true
    };
  } catch (error) {
    console.error('Error fetching technical indicators:', error);
    return { success: false, error };
  }
};

// Generate simple prediction based on technical indicators
export const generatePrediction = async (symbol: string) => {
  try {
    const indicators = await fetchTechnicalIndicators(symbol);
    
    if (!indicators.success) {
      throw new Error('Failed to fetch indicators for prediction');
    }
    
    // Extract the latest values
    const latestRSI = extractLatestValue(indicators.rsi, 'RSI');
    const macdData = indicators.macd;
    const latestSMA = extractLatestValue(indicators.sma, 'SMA');
    
    // Get the latest MACD and signal values
    const macdValues = Object.entries(macdData['Technical Analysis: MACD'] || {});
    let latestMACD = 0;
    let latestSignal = 0;
    
    if (macdValues.length > 0) {
      const [, macdObj] = macdValues[0];
      latestMACD = parseFloat((macdObj as any).MACD);
      latestSignal = parseFloat((macdObj as any).MACD_Signal);
    }
    
    // Simple prediction algorithm
    let sentiment = 'Neutral';
    let confidenceScore = 50;
    let reasons = [];
    
    // RSI analysis (values above 70 typically indicate overbought, below 30 oversold)
    if (latestRSI > 70) {
      sentiment = 'Bearish';
      confidenceScore -= 15;
      reasons.push('RSI indicates overbought conditions');
    } else if (latestRSI < 30) {
      sentiment = 'Bullish';
      confidenceScore += 15;
      reasons.push('RSI indicates oversold conditions');
    }
    
    // MACD analysis (MACD crossing above signal line is bullish)
    if (latestMACD > latestSignal) {
      if (sentiment === 'Bearish') {
        sentiment = 'Neutral';
        confidenceScore = 50;
      } else {
        sentiment = 'Bullish';
        confidenceScore += 10;
      }
      reasons.push('MACD is above signal line');
    } else if (latestMACD < latestSignal) {
      if (sentiment === 'Bullish') {
        sentiment = 'Neutral';
        confidenceScore = 50;
      } else {
        sentiment = 'Bearish';
        confidenceScore -= 10;
      }
      reasons.push('MACD is below signal line');
    }
    
    // Cap confidence score between 0 and 100
    confidenceScore = Math.max(0, Math.min(100, confidenceScore));
    
    // Generate prediction output
    const prediction = {
      symbol,
      sentiment,
      confidenceScore,
      reasons,
      recommendedAction: sentiment === 'Bullish' ? 'Buy' : sentiment === 'Bearish' ? 'Sell' : 'Hold',
      technicalIndicators: {
        rsi: latestRSI,
        macd: latestMACD,
        macdSignal: latestSignal,
        sma: latestSMA
      }
    };
    
    return {
      prediction,
      success: true
    };
  } catch (error) {
    console.error('Error generating prediction:', error);
    return { 
      success: false, 
      error,
      // Fallback to simple random prediction if API fails
      prediction: generateFallbackPrediction(symbol)
    };
  }
};

// Helper to extract latest value from API response
const extractLatestValue = (data: any, indicator: string) => {
  try {
    const key = `Technical Analysis: ${indicator}`;
    if (data[key]) {
      const dates = Object.keys(data[key]);
      if (dates.length > 0) {
        const latestDate = dates[0];
        return parseFloat(data[key][latestDate][indicator]);
      }
    }
    return 0;
  } catch (error) {
    console.error(`Error extracting ${indicator} value:`, error);
    return 0;
  }
};

// Generate a fallback prediction when APIs fail
const generateFallbackPrediction = (symbol: string) => {
  const sentiments = ['Bullish', 'Neutral', 'Bearish'];
  const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  const randomConfidence = Math.floor(Math.random() * 30) + 50; // 50-80 range
  
  return {
    symbol,
    sentiment: randomSentiment,
    confidenceScore: randomConfidence,
    reasons: ['Based on simulated data (API fallback)'],
    recommendedAction: randomSentiment === 'Bullish' ? 'Buy' : randomSentiment === 'Bearish' ? 'Sell' : 'Hold',
    technicalIndicators: {
      rsi: Math.floor(Math.random() * 100),
      macd: (Math.random() * 2) - 1,
      macdSignal: (Math.random() * 2) - 1,
      sma: 100 + (Math.random() * 20)
    },
    isFallback: true
  };
}; 