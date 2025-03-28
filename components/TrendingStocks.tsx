import React, { useState, useEffect } from 'react';
import { useStockData } from '../hooks/useStockData';

interface TrendingStocksProps {
  onSelect: (symbol: string) => void;
}

// Trending symbols to track
const TRENDING_SYMBOLS = ['TSLA', 'META', 'NFLX', 'SBUX'];

// Additional trend data not in our stock data API
interface TrendData {
  symbol: string;
  trend: 'up' | 'down';
  chartData: number[];
}

// Mock trend data - would be replaced with historical API data in production
const TREND_DATA: Record<string, TrendData> = {
  'TSLA': {
    symbol: 'TSLA',
    trend: 'up',
    chartData: [210, 215, 208, 212, 220, 218, 225, 230, 228, 235, 242, 248]
  },
  'META': {
    symbol: 'META',
    trend: 'up',
    chartData: [480, 478, 485, 490, 492, 498, 495, 501, 505, 508, 510, 512]
  },
  'NFLX': {
    symbol: 'NFLX',
    trend: 'up',
    chartData: [650, 655, 660, 658, 657, 662, 664, 668, 670, 672, 673, 675]
  },
  'SBUX': {
    symbol: 'SBUX',
    trend: 'down',
    chartData: [85, 84, 83, 82, 81, 80, 79.5, 79, 78.8, 78.5, 78.4, 78.3]
  },
};

const TrendingStocks: React.FC<TrendingStocksProps> = ({ onSelect }) => {
  // State to store combined stock and trend data
  const [trendingStocks, setTrendingStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch data for each trending symbol with 20 second refresh
  const stockDataResults = TRENDING_SYMBOLS.map(symbol => {
    return useStockData(symbol, 20000);
  });

  // Combine stock data with trend data and update state
  useEffect(() => {
    // Check if all stock data is loaded
    const allDataLoaded = stockDataResults.every(result => !result.loading);
    const anyErrors = stockDataResults.some(result => result.error);
    
    // Update loading state
    setLoading(!allDataLoaded || anyErrors);
    
    // If we have all data, build the combined view
    if (allDataLoaded && !anyErrors) {
      const combinedData = stockDataResults
        .filter(result => result.data)
        .map(result => {
          const stockData = result.data!;
          const symbol = stockData.symbol;
          const trendData = TREND_DATA[symbol];
          
          // Format volume
          const volume = formatVolume(stockData.volume);
          
          return {
            ...stockData,
            trend: trendData.trend,
            chartData: trendData.chartData,
            volume
          };
        });
      
      setTrendingStocks(combinedData);
      setLastUpdated(new Date());
    }
  }, [stockDataResults.map(result => result.data)]);

  // Manual refresh function
  const refreshData = () => {
    stockDataResults.forEach(result => {
      if (result.refreshData) {
        result.refreshData();
      }
    });
    setLastUpdated(new Date());
  };

  // Format volume for display
  const formatVolume = (volume: number): string => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(1)}K`;
    }
    return volume.toString();
  };
  
  if (loading) {
    return (
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Trending Stocks
          </h2>
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs text-gray-500 dark:text-gray-400">Loading trending stocks...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Trending Stocks
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Stocks with significant trading volume and price movement
          </p>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-3">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button 
            onClick={refreshData}
            className="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trendingStocks.map((stock) => (
          <div 
            key={stock.symbol}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelect(stock.symbol)}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{stock.symbol}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</p>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">${stock.price.toFixed(2)}</div>
                <div className={`text-sm ${stock.percentChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-3">
              <span className={`text-xs px-2 py-1 rounded-full ${stock.trend === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                {stock.trend === 'up' ? 'Bullish' : 'Bearish'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                Vol: {stock.volume}
              </span>
            </div>
            
            {/* Simple sparkline chart */}
            <div className="h-12 flex items-end space-x-1">
              {stock.chartData.map((value: number, index: number) => {
                // Calculate height percentage based on min/max values
                const min = Math.min(...stock.chartData);
                const max = Math.max(...stock.chartData);
                const range = max - min;
                const heightPercentage = range > 0 ? ((value - min) / range) * 100 : 50;
                
                return (
                  <div 
                    key={index}
                    className={`flex-1 ${stock.trend === 'up' ? 'bg-green-500' : 'bg-red-500'} rounded-sm`}
                    style={{ height: `${heightPercentage}%` }}
                  ></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingStocks; 