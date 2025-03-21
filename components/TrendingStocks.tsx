import React from 'react';

interface TrendingStocksProps {
  onSelect: (symbol: string) => void;
}

// Mock data for trending stocks - in a real app, this would come from an API
const trendingStocks = [
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    trend: 'up',
    volume: '42.3M',
    price: 248.42,
    change: 2.8,
    chartData: [210, 215, 208, 212, 220, 218, 225, 230, 228, 235, 242, 248]
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    trend: 'up',
    volume: '37.1M',
    price: 512.74,
    change: 3.5,
    chartData: [480, 478, 485, 490, 492, 498, 495, 501, 505, 508, 510, 512]
  },
  {
    symbol: 'NFLX',
    name: 'Netflix, Inc.',
    trend: 'up',
    volume: '15.7M',
    price: 675.15,
    change: 1.2,
    chartData: [650, 655, 660, 658, 657, 662, 664, 668, 670, 672, 673, 675]
  },
  {
    symbol: 'SBUX',
    name: 'Starbucks Corporation',
    trend: 'down',
    volume: '8.3M',
    price: 78.32,
    change: -2.4,
    chartData: [85, 84, 83, 82, 81, 80, 79.5, 79, 78.8, 78.5, 78.4, 78.3]
  },
];

const TrendingStocks: React.FC<TrendingStocksProps> = ({ onSelect }) => {
  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Trending Stocks
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Stocks with significant trading volume and price movement
        </p>
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
                <div className={`text-sm ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(1)}%
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
              {stock.chartData.map((value, index) => {
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