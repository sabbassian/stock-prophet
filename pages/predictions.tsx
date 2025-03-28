import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { usePrediction, PredictionData } from '../hooks/usePrediction';
import { useStockData } from '../hooks/useStockData';
import { useRouter } from 'next/router';
import Link from 'next/link';

const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META'];

const PredictionsPage: React.FC = () => {
  const [activeSymbol, setActiveSymbol] = useState('AAPL');
  const router = useRouter();
  const { symbol } = router.query;
  
  // Set active symbol from URL if available
  useEffect(() => {
    if (typeof symbol === 'string' && symbol.trim() !== '') {
      setActiveSymbol(symbol.toUpperCase());
    }
  }, [symbol]);
  
  // Use both stock data and prediction hooks
  const { data: stockData, loading: stockLoading, error: stockError, refreshData: refreshStock } = useStockData(activeSymbol, 20000); // 20 second refresh
  const { prediction, loading, error, refreshPrediction } = usePrediction(activeSymbol);
  
  // Function to refresh all data
  const refreshAllData = () => {
    refreshStock();
    refreshPrediction();
  };
  
  // Handle search for new symbol
  const [searchInput, setSearchInput] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveSymbol(searchInput.toUpperCase());
      router.push({
        pathname: '/predictions',
        query: { symbol: searchInput.toUpperCase() }
      }, undefined, { shallow: true });
    }
  };
  
  // Format the last updated time
  const formatLastUpdated = (dateString: string | Date | undefined) => {
    if (!dateString) return 'N/A';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleTimeString();
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Stock Predictions & Analysis
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                  AI-powered predictions based on technical indicators and market trends
                </p>
              </div>
              <div className="mt-2 sm:mt-0 text-xs text-gray-500 dark:text-gray-400">
                <span className="mr-2">Last updated:</span>
                <span className="font-medium">
                  {stockData ? formatLastUpdated(stockData.lastUpdated) : 'Loading...'}
                </span>
                <span className="text-xs ml-2 italic">(Auto-refreshes every 20s)</span>
              </div>
            </div>
          </div>
          
          {/* Symbol search */}
          <div className="px-4 py-4 sm:px-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter stock symbol (e.g., AAPL)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Analyze
              </button>
            </form>
          </div>
          
          {/* Quick symbol selector */}
          <div className="px-4 py-3 sm:px-6 border-b dark:border-gray-700 flex space-x-2 overflow-x-auto">
            {DEFAULT_SYMBOLS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setActiveSymbol(s);
                  router.push({
                    pathname: '/predictions',
                    query: { symbol: s }
                  }, undefined, { shallow: true });
                }}
                className={`px-3 py-1 text-sm font-medium rounded-md ${
                  activeSymbol === s
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          
          {/* Current stock price display */}
          {stockData && !stockLoading && (
            <div className="px-4 py-4 sm:px-6 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{stockData.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{activeSymbol}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">${stockData.price.toFixed(2)}</div>
                  <div className={`text-sm font-medium ${
                    stockData.change >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.change >= 0 ? '+' : ''}{stockData.percentChange.toFixed(2)}%)
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Prediction content */}
          <div className="px-4 py-6 sm:px-6">
            {(loading || stockLoading) ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-400">Loading prediction...</span>
              </div>
            ) : (error || stockError) ? (
              <div className="text-center py-12">
                <p className="text-red-500 dark:text-red-400 mb-4">Failed to load prediction data</p>
                <button
                  onClick={refreshAllData}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Main prediction */}
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeSymbol} Prediction</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Last updated: {prediction ? formatLastUpdated(prediction.lastUpdated) : 'N/A'}
                        </p>
                      </div>
                      
                      <Link href={`/stocks/${activeSymbol}`} className="mt-2 sm:mt-0 text-primary-600 hover:text-primary-800 dark:text-primary-400 text-sm font-medium flex items-center">
                        View detailed analysis
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                    
                    <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner">
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Price</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">${stockData?.price.toFixed(2) || 'N/A'}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Predicted Price ({prediction?.timeFrame})</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">${prediction?.predictedPrice.toFixed(2) || 'N/A'}</div>
                        
                        {prediction && (
                          <div className={`text-sm font-medium mt-1 ${
                            prediction.predictedChangePercent >= 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-red-600 dark:text-red-400'
                          }`}>
                            {prediction.predictedChangePercent >= 0 ? '+' : ''}
                            {prediction.predictedChangePercent.toFixed(2)}% 
                            ({prediction.predictedChange >= 0 ? '+' : ''}${prediction.predictedChange.toFixed(2)})
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Recommendation</span>
                        <span className={`text-sm font-semibold ${
                          prediction?.recommendedAction === 'Buy' ? 'text-green-600 dark:text-green-400' :
                          prediction?.recommendedAction === 'Sell' ? 'text-red-600 dark:text-red-400' :
                          'text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {prediction?.recommendedAction || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sentiment</span>
                        <span className={`text-sm font-semibold ${
                          prediction?.sentiment === 'Bullish' ? 'text-green-600 dark:text-green-400' :
                          prediction?.sentiment === 'Bearish' ? 'text-red-600 dark:text-red-400' :
                          'text-yellow-600 dark:text-yellow-400'
                        }`}>
                          {prediction?.sentiment || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Confidence Score</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{prediction?.confidenceScore || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div 
                          className="bg-primary-600 h-2.5 rounded-full"
                          style={{ width: `${prediction?.confidenceScore || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {prediction?.isFallback && (
                      <div className="text-xs text-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 py-1 px-2 rounded-md">
                        Note: Using simplified analysis due to API limitations
                      </div>
                    )}
                  </div>
                  
                  {/* Technical indicators */}
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Technical Indicators</h2>
                    
                    {prediction?.technicalIndicators && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">RSI</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {prediction.technicalIndicators.rsi.toFixed(2)}
                            </div>
                            <div className="text-xs font-medium mt-1 text-gray-500 dark:text-gray-400">
                              {prediction.technicalIndicators.rsi > 70 ? 'Overbought' : 
                               prediction.technicalIndicators.rsi < 30 ? 'Oversold' : 'Neutral'}
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">MACD</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                              {prediction.technicalIndicators.macd.toFixed(2)}
                            </div>
                            <div className="text-xs font-medium mt-1 text-gray-500 dark:text-gray-400">
                              Signal: {prediction.technicalIndicators.macdSignal.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        
                        {prediction.technicalIndicators.sma !== undefined && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">50-Day SMA</div>
                            <div className="flex justify-between">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                ${prediction.technicalIndicators.sma.toFixed(2)}
                              </div>
                              <div className={`text-sm font-medium ${
                                stockData && prediction.technicalIndicators.sma && stockData.price > prediction.technicalIndicators.sma 
                                  ? 'text-green-600 dark:text-green-400' 
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                {stockData && prediction.technicalIndicators.sma && stockData.price > prediction.technicalIndicators.sma ? 'Price above SMA' : 'Price below SMA'}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {prediction.technicalIndicators.bollingerBands && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm">
                            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Bollinger Bands</div>
                            <div className="grid grid-cols-3 gap-2 mt-1">
                              <div className="text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Lower</div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  ${prediction.technicalIndicators.bollingerBands.lower.toFixed(2)}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Middle</div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  ${prediction.technicalIndicators.bollingerBands.middle.toFixed(2)}
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Upper</div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  ${prediction.technicalIndicators.bollingerBands.upper.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Analysis Reasons */}
                <div className="mt-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Analysis Reasons</h2>
                  
                  {prediction?.reasons && prediction.reasons.length > 0 ? (
                    <ul className="space-y-2">
                      {prediction.reasons.map((reason, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 h-5 w-5 text-primary-600 dark:text-primary-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="ml-2 text-gray-700 dark:text-gray-300">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No analysis reasons available.</p>
                  )}
                </div>
                
                <div className="mt-6 text-center py-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Need the latest prediction data?
                  </p>
                  <button
                    onClick={refreshAllData}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Data
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="px-4 py-4 sm:px-6 bg-gray-100 dark:bg-gray-900 border-t dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <strong>Disclaimer:</strong> All predictions are for informational purposes only and should not be considered as financial advice.
              Past performance is not indicative of future results. Always conduct your own research before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PredictionsPage; 