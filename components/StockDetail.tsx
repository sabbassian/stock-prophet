import React, { useState, useEffect } from 'react';

interface StockDetailProps {
  symbol: string;
  onBack: () => void;
}

// Mock stock details - would be replaced with API data
const mockStockDetails = {
  AAPL: {
    name: 'Apple Inc.',
    price: 192.42,
    change: -0.8,
    high: 195.63,
    low: 191.24,
    open: 194.12,
    prevClose: 194.02,
    volume: '42.3M',
    marketCap: '2.94T',
    pe: '31.25',
    dividend: '0.24 (0.5%)',
    forecast: {
      recommendation: 'Buy',
      targetPrice: 205.00,
      confidence: 78,
      riskLevel: 'Medium',
      timeHorizon: 'Short-term'
    },
    chartData: {
      labels: ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
      prices: [194.02, 194.25, 193.80, 194.10, 193.95, 193.50, 193.25, 192.80, 192.50, 192.35, 192.60, 192.80, 192.55, 192.42]
    },
    news: [
      {
        headline: 'Apple to Release New iPhones with Advanced AI Features',
        source: 'Tech Insider',
        time: '1h ago'
      },
      {
        headline: 'Services Revenue Growth Beats Expectations for Apple',
        source: 'Financial News',
        time: '3h ago'
      },
      {
        headline: 'Analysts Remain Bullish on Apple Despite Market Weakness',
        source: 'Market Watch',
        time: '5h ago'
      }
    ],
    keyMetrics: [
      { name: 'Revenue Growth (YoY)', value: '8.1%' },
      { name: 'Profit Margin', value: '25.3%' },
      { name: 'Debt to Equity', value: '1.2' },
      { name: 'Return on Equity', value: '32.5%' },
      { name: 'Quick Ratio', value: '1.3' },
      { name: 'Free Cash Flow', value: '$24.8B' }
    ]
  },
  NVDA: {
    name: 'NVIDIA Corporation',
    price: 945.71,
    change: 3.2,
    high: 952.08,
    low: 925.33,
    open: 928.45,
    prevClose: 916.38,
    volume: '89.7M',
    marketCap: '2.33T',
    pe: '80.12',
    dividend: '0.01 (0.01%)',
    forecast: {
      recommendation: 'Strong Buy',
      targetPrice: 1050.00,
      confidence: 92,
      riskLevel: 'Medium-High',
      timeHorizon: 'Medium-term'
    },
    chartData: {
      labels: ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
      prices: [916.38, 922.45, 928.72, 935.18, 940.25, 938.92, 937.50, 941.22, 943.80, 945.10, 948.32, 950.15, 947.90, 945.71]
    },
    news: [
      {
        headline: 'NVIDIA's New AI Chips Set Industry Performance Records',
        source: 'Tech Review',
        time: '2h ago'
      },
      {
        headline: 'Cloud Providers Expanding NVIDIA GPU Deployments',
        source: 'Cloud News',
        time: '4h ago'
      },
      {
        headline: 'NVIDIA Partners with Leading Automakers for Self-Driving Tech',
        source: 'Auto Industry Today',
        time: '6h ago'
      }
    ],
    keyMetrics: [
      { name: 'Revenue Growth (YoY)', value: '124.5%' },
      { name: 'Profit Margin', value: '54.2%' },
      { name: 'Debt to Equity', value: '0.3' },
      { name: 'Return on Equity', value: '72.1%' },
      { name: 'Quick Ratio', value: '3.8' },
      { name: 'Free Cash Flow', value: '$18.9B' }
    ]
  },
  // Add more stocks as needed
};

const StockDetail: React.FC<StockDetailProps> = ({ symbol, onBack }) => {
  // This would fetch data from an API in a real application
  const [stockData, setStockData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      // Check if we have mock data for this symbol
      const data = mockStockDetails[symbol as keyof typeof mockStockDetails];
      if (data) {
        setStockData(data);
      } else {
        // If no mock data for this symbol, create some based on the symbol name
        setStockData({
          name: `${symbol} Inc.`,
          price: 150 + Math.random() * 200,
          change: (Math.random() * 10) - 5,
          high: 160 + Math.random() * 200,
          low: 140 + Math.random() * 190,
          open: 155 + Math.random() * 190,
          prevClose: 152 + Math.random() * 195,
          volume: `${Math.floor(Math.random() * 100)}M`,
          marketCap: `${(Math.random() * 2 + 0.1).toFixed(2)}T`,
          pe: (Math.random() * 40 + 10).toFixed(2),
          dividend: `${(Math.random() * 0.5).toFixed(2)} (${(Math.random() * 2).toFixed(2)}%)`,
          forecast: {
            recommendation: ['Strong Buy', 'Buy', 'Hold', 'Sell'][Math.floor(Math.random() * 4)],
            targetPrice: 150 + Math.random() * 250,
            confidence: Math.floor(Math.random() * 30) + 70,
            riskLevel: ['Low', 'Medium', 'Medium-High', 'High'][Math.floor(Math.random() * 4)],
            timeHorizon: ['Short-term', 'Medium-term', 'Long-term'][Math.floor(Math.random() * 3)]
          },
          chartData: {
            labels: ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
            prices: Array.from({ length: 14 }, (_, i) => 150 + Math.random() * 10 * i)
          },
          news: [
            {
              headline: `${symbol} Reports Strong Quarterly Earnings`,
              source: 'Financial Times',
              time: '2h ago'
            },
            {
              headline: `Analyst Upgrades ${symbol} to Outperform`,
              source: 'Market Watch',
              time: '4h ago'
            },
            {
              headline: `${symbol} Announces New Product Line`,
              source: 'Business News',
              time: '7h ago'
            }
          ],
          keyMetrics: [
            { name: 'Revenue Growth (YoY)', value: `${(Math.random() * 20 + 5).toFixed(1)}%` },
            { name: 'Profit Margin', value: `${(Math.random() * 30 + 10).toFixed(1)}%` },
            { name: 'Debt to Equity', value: (Math.random() * 2 + 0.2).toFixed(1) },
            { name: 'Return on Equity', value: `${(Math.random() * 40 + 10).toFixed(1)}%` },
            { name: 'Quick Ratio', value: (Math.random() * 3 + 0.8).toFixed(1) },
            { name: 'Free Cash Flow', value: `$${(Math.random() * 30 + 1).toFixed(1)}B` }
          ]
        });
      }
      setLoading(false);
    }, 800);
  }, [symbol]);

  if (loading) {
    return (
      <div className="card flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 dark:text-gray-400">Loading stock data...</p>
        </div>
      </div>
    );
  }

  if (!stockData) {
    return (
      <div className="card p-6">
        <button onClick={onBack} className="flex items-center text-primary-600 mb-4">
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to stocks
        </button>
        <div className="text-center py-8">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stock Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">We couldn't find any data for {symbol}.</p>
        </div>
      </div>
    );
  }
  
  const getRecommendationColor = (recommendation: string) => {
    switch(recommendation.toLowerCase()) {
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
      <button onClick={onBack} className="flex items-center text-primary-600 mb-4">
        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to stocks
      </button>

      <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            {symbol}
            <span className="ml-2 text-lg font-normal text-gray-600 dark:text-gray-400">{stockData.name}</span>
          </h1>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">${stockData.price.toFixed(2)}</span>
            <span className={`ml-2 text-lg font-medium ${getChangeColor(stockData.change)}`}>
              {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 inline-block">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(stockData.forecast.recommendation)}`}>
              {stockData.forecast.recommendation}
            </span>
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Target:</span>
              <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">${stockData.forecast.targetPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Confidence:</span>
              <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">{stockData.forecast.confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-64 flex items-center justify-center">
          {/* This would be replaced with a real chart component like Recharts */}
          <div className="w-full h-full relative">
            <div className="absolute inset-0 flex items-center justify-center text-lg text-gray-400">
              Chart visualization placeholder - would use Recharts in production
            </div>
            <div className="absolute inset-0 opacity-30">
              <svg viewBox="0 0 100 20" className="w-full h-full">
                <path 
                  fill="none" 
                  stroke={stockData.change >= 0 ? "rgba(52, 211, 153, 0.8)" : "rgba(248, 113, 113, 0.8)"} 
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                  d={`M0,${20 - stockData.chartData.prices[0] / 5} ${stockData.chartData.prices.map((price: number, i: number) => 
                    `L${(i+1) * 7},${20 - price / 5}`).join(' ')}`}
                />
                <path 
                  fill={stockData.change >= 0 ? "rgba(52, 211, 153, 0.2)" : "rgba(248, 113, 113, 0.2)"} 
                  d={`M0,${20 - stockData.chartData.prices[0] / 5} ${stockData.chartData.prices.map((price: number, i: number) => 
                    `L${(i+1) * 7},${20 - price / 5}`).join(' ')} L${stockData.chartData.prices.length * 7},20 L0,20 Z`}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 font-medium text-sm border-b-2 ${
              activeTab === 'overview'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-2 font-medium text-sm border-b-2 ${
              activeTab === 'metrics'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Key Metrics
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`py-2 font-medium text-sm border-b-2 ${
              activeTab === 'news'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            News
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Price Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Open</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">${stockData.open.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">High</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">${stockData.high.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Low</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">${stockData.low.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Previous Close</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">${stockData.prevClose.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Trading Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">{stockData.volume}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">{stockData.marketCap}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">P/E Ratio</p>
                    <p className="text-base font-medium text-gray-900 dark:text-white">{stockData.pe}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Forecast</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="mb-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Target Price</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">${stockData.forecast.targetPrice.toFixed(2)}</p>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Recommendation</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRecommendationColor(stockData.forecast.recommendation)}`}>
                    {stockData.forecast.recommendation}
                  </span>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Confidence</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full" 
                      style={{ width: `${stockData.forecast.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1 block">{stockData.forecast.confidence}%</span>
                </div>
                <div className="mb-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Risk Level</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{stockData.forecast.riskLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time Horizon</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">{stockData.forecast.timeHorizon}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Key Financial Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {stockData.keyMetrics.map((metric: { name: string, value: string }) => (
                <div key={metric.name} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{metric.name}</p>
                  <p className="text-xl font-medium text-gray-900 dark:text-white">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Latest News</h3>
            <div className="space-y-4">
              {stockData.news.map((item: { headline: string, source: string, time: string }, index: number) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0">
                  <h4 className="text-base font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    <a href="#">{item.headline}</a>
                  </h4>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span>{item.source}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDetail; 