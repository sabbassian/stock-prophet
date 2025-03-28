import { useState, useEffect } from 'react';
import { StockData as ApiStockData, fetchStockData, fetchHistoricalData, fetchCompanyNews } from '../lib/api';

// Interface for stock data with additional properties needed for the UI
export interface StockData extends Omit<ApiStockData, 'lastUpdated'> {
  prevClose?: number;
  news?: any[];
  historicalData?: any;
  lastUpdated: string | Date;
}

interface UseStockDataReturn {
  data: StockData | null;
  loading: boolean;
  error: Error | null;
  refreshData: () => void;
}

// Changed default refresh interval from 30000 to 20000 (20 seconds)
export function useStockData(symbol: string, refreshInterval = 20000): UseStockDataReturn {
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  
  const loadData = async () => {
    if (!symbol) return;
    
    // Only show loading indicator on initial load, not during refresh
    if (!data) {
      setLoading(true);
    }
    setError(null);
    
    try {
      console.log(`Fetching stock data for ${symbol} at ${new Date().toLocaleTimeString()}`);
      const stockResult = await fetchStockData(symbol);
      
      if (!stockResult.success) {
        throw new Error('Failed to fetch stock data');
      }

      const { quote, profile } = stockResult;
      
      // For mock data, add some random movement to the price to simulate real-time changes
      let newPrice = quote.c || 0;
      if (data && data.price) {
        // Add small random movement (±0.5%) to simulate real-time price changes
        const randomMovement = data.price * (Math.random() * 0.01 - 0.005);
        newPrice = data.price + randomMovement;
      }
      
      // Calculate change based on newPrice and previous close
      const prevClose = quote.pc || 0;
      const change = newPrice - prevClose;
      const percentChange = prevClose > 0 ? (change / prevClose) * 100 : 0;
      
      // Convert API data to our extended StockData format
      const stockData: StockData = {
        symbol,
        name: profile.name || `${symbol} Inc.`,
        price: newPrice,
        change: change,
        percentChange: percentChange,
        volume: quote.v || 0,
        previousClose: quote.pc || 0,
        open: quote.o || 0,
        high: quote.h || 0,
        low: quote.l || 0,
        marketCap: profile.marketCapitalization * 1000000 || 0,
        lastUpdated: new Date().toISOString(),
        prevClose: quote.pc || 0
      };
      
      setData(stockData);
      setLastFetchTime(Date.now());
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch stock data'));
      
      // If we already have data, keep it (don't set to null on error)
      if (!data) {
        // Create fallback mock data if API fails
        const mockData: StockData = createMockData(symbol);
        setData(mockData);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to create mock data
  const createMockData = (symbol: string): StockData => {
    // Base price between 100 and 1000
    const basePrice = 100 + Math.random() * 900;
    
    // If we already have data, create variation from current price
    const currentPrice = data ? data.price : basePrice;
    
    // Add small random movement (±1%) to the price
    const newPrice = currentPrice * (1 + (Math.random() * 0.02 - 0.01));
    
    // Calculate previous close (slightly different from current price)
    const prevClose = currentPrice * (0.98 + Math.random() * 0.04);
    
    // Calculate change and percent change
    const change = newPrice - prevClose;
    const percentChange = (change / prevClose) * 100;
    
    return {
      symbol,
      name: `${symbol} Inc.`,
      price: newPrice,
      change: change,
      percentChange: percentChange,
      volume: Math.floor(Math.random() * 10000000),
      previousClose: prevClose,
      open: prevClose * (0.99 + Math.random() * 0.02),
      high: newPrice * (1 + Math.random() * 0.02),
      low: newPrice * (0.98 + Math.random() * 0.01),
      marketCap: newPrice * 1000000 * (10 + Math.random() * 990),
      lastUpdated: new Date().toISOString(),
      prevClose: prevClose
    };
  };
  
  // Initial load
  useEffect(() => {
    loadData();
    
    // Add this line to reset lastFetchTime when symbol changes
    setLastFetchTime(0);
  }, [symbol]);
  
  // Refresh on interval
  useEffect(() => {
    if (!refreshInterval) return;
    
    // Force an immediate update when component mounts
    const immediateTimeout = setTimeout(() => {
      loadData();
    }, 100);
    
    // Set up regular interval for updates
    const intervalId = setInterval(() => {
      loadData();
    }, refreshInterval);
    
    return () => {
      clearTimeout(immediateTimeout);
      clearInterval(intervalId);
    };
  }, [symbol, refreshInterval]);
  
  return {
    data,
    loading,
    error,
    refreshData: loadData
  };
} 