import React, { useState, useEffect } from 'react';
import { useStockData } from '../hooks/useStockData';

interface StockPicksProps {
  onSelect: (symbol: string) => void;
}

// Top stock symbols to track
const TOP_SYMBOLS = ['NVDA', 'MSFT', 'AAPL', 'AMZN', 'GOOGL'];

// Additional data that might not be in our stock API
interface StockPrediction {
  symbol: string;
  prediction: string;
  confidence: number;
  target: number;
  reason: string;
}

// Mock prediction data - would be replaced with ML-based API data
const STOCK_PREDICTIONS: Record<string, StockPrediction> = {
  'NVDA': {
    symbol: 'NVDA',
    prediction: 'Strong Buy',
    confidence: 92,
    target: 1050.00,
    reason: 'AI chip demand surge, market leadership in GPUs, strong datacenter growth'
  },
  'MSFT': {
    symbol: 'MSFT',
    prediction: 'Buy',
    confidence: 87,
    target: 460.00,
    reason: 'Azure cloud growth, AI integration across product suite, strong enterprise demand'
  },
  'AAPL': {
    symbol: 'AAPL',
    prediction: 'Hold',
    confidence: 65,
    target: 205.00,
    reason: 'iPhone 16 upcoming launch, services revenue growth, potential AI features'
  },
  'AMZN': {
    symbol: 'AMZN',
    prediction: 'Buy',
    confidence: 83,
    target: 200.00,
    reason: 'AWS acceleration, retail margin improvement, advertising growth'
  },
  'GOOGL': {
    symbol: 'GOOGL',
    prediction: 'Buy',
    confidence: 78,
    target: 175.00,
    reason: 'Search dominance, YouTube growth, AI advancements, cloud market share gains'
  }
};

const StockPicks: React.FC<StockPicksProps> = ({ onSelect }) => {
  // State to store combined stock data with predictions
  const [stockPicks, setStockPicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch data for each stock symbol with 20 second refresh
  const stockDataResults = TOP_SYMBOLS.map(symbol => {
    return useStockData(symbol, 20000);
  });

  // Combine stock data with predictions and update state
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
          const prediction = STOCK_PREDICTIONS[symbol];
          
          return {
            ...stockData,
            prediction: prediction.prediction,
            confidence: prediction.confidence,
            target: prediction.target,
            reason: prediction.reason
          };
        });
      
      setStockPicks(combinedData);
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

  const getPredictionColor = (prediction: string) => {
    switch (prediction.toLowerCase()) {
      case 'strong buy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'buy':
        return 'bg-green-50 text-green-700 dark:bg-green-800 dark:text-green-200';
      case 'hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'sell':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'strong sell':
        return 'bg-red-200 text-red-900 dark:bg-red-950 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 
      ? 'text-green-600 dark:text-green-400' 
      : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Today's Top Picks
        </h2>
        <div className="flex items-center">
          {loading && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
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
      
      <div className="overflow-x-auto -mx-6">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Change</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prediction</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Confidence</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Target</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Reason</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {stockPicks.map((stock) => (
              <tr 
                key={stock.symbol} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => onSelect(stock.symbol)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{stock.symbol}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">${stock.price.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${getChangeColor(stock.percentChange)}`}>
                    {stock.percentChange >= 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPredictionColor(stock.prediction)}`}>
                    {stock.prediction}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${stock.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block">{stock.confidence}%</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900 dark:text-white">${stock.target.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">{stock.reason}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockPicks; 