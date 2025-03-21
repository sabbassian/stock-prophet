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

export function useStockData(symbol: string, refreshInterval = 30000): UseStockDataReturn {
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  
  const loadData = async () => {
    if (!symbol) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const stockResult = await fetchStockData(symbol);
      
      if (!stockResult.success) {
        throw new Error('Failed to fetch stock data');
      }

      const { quote, profile } = stockResult;
      
      // Convert API data to our extended StockData format
      const stockData: StockData = {
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
        const mockData: StockData = {
          symbol,
          name: `${symbol} Inc.`,
          price: 100 + Math.random() * 900,
          change: -10 + Math.random() * 20,
          percentChange: -5 + Math.random() * 10,
          volume: Math.floor(Math.random() * 10000000),
          previousClose: 100 + Math.random() * 900,
          open: 100 + Math.random() * 900,
          high: 100 + Math.random() * 950,
          low: 100 + Math.random() * 850,
          marketCap: 1000000000 * (1 + Math.random() * 1000),
          lastUpdated: new Date().toISOString(),
          prevClose: 100 + Math.random() * 900
        };
        setData(mockData);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Initial load
  useEffect(() => {
    loadData();
  }, [symbol]);
  
  // Refresh on interval
  useEffect(() => {
    if (!refreshInterval) return;
    
    const intervalId = setInterval(() => {
      // Only refresh if it's been at least half the interval since last fetch
      if (Date.now() - lastFetchTime > refreshInterval / 2) {
        loadData();
      }
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [symbol, refreshInterval, lastFetchTime]);
  
  return {
    data,
    loading,
    error,
    refreshData: loadData
  };
} 