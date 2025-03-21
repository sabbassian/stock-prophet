import React, { useState, useEffect } from 'react';

interface StockPicksProps {
  onSelect: (symbol: string) => void;
}

// Mock data for demo purposes - this would be replaced with API data in a production app
const mockStockPicks = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 945.71,
    change: 3.2,
    prediction: 'Strong Buy',
    confidence: 92,
    target: 1050.00,
    reason: 'AI chip demand surge, market leadership in GPUs, strong datacenter growth'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 429.85,
    change: 1.5,
    prediction: 'Buy',
    confidence: 87,
    target: 460.00,
    reason: 'Azure cloud growth, AI integration across product suite, strong enterprise demand'
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 192.42,
    change: -0.8,
    prediction: 'Hold',
    confidence: 65,
    target: 205.00,
    reason: 'iPhone 16 upcoming launch, services revenue growth, potential AI features'
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 180.75,
    change: 2.1,
    prediction: 'Buy',
    confidence: 83,
    target: 200.00,
    reason: 'AWS acceleration, retail margin improvement, advertising growth'
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 163.22,
    change: 0.9,
    prediction: 'Buy',
    confidence: 78,
    target: 175.00,
    reason: 'Search dominance, YouTube growth, AI advancements, cloud market share gains'
  }
];

const StockPicks: React.FC<StockPicksProps> = ({ onSelect }) => {
  const [stockPicks, setStockPicks] = useState(mockStockPicks);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate data refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLoading(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        // In a real app, this would be an API call to get the latest data
        const updatedStocks = stockPicks.map(stock => {
          const randomChange = (Math.random() * 2 - 1) * 2; // Range from -2% to +2%
          const newPrice = stock.price * (1 + randomChange / 100);
          return {
            ...stock,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat((stock.change + randomChange / 2).toFixed(1))
          };
        });
        
        setStockPicks(updatedStocks);
        setLoading(false);
        setLastUpdated(new Date());
      }, 1000);
    }, 30000);

    return () => clearInterval(interval);
  }, [stockPicks]);

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
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
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
                  <div className={`text-sm font-medium ${getChangeColor(stock.change)}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(1)}%
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