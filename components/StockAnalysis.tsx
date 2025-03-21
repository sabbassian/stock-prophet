import React from 'react';
import { usePrediction, PredictionData } from '../hooks/usePrediction';

interface StockAnalysisProps {
  symbol: string;
}

const StockAnalysis: React.FC<StockAnalysisProps> = ({ symbol }) => {
  const { prediction, loading, error } = usePrediction(symbol);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Analysis Unavailable</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {error ? error.message : 'Unable to retrieve prediction data.'}
          </p>
        </div>
      </div>
    );
  }

  const getSentimentColor = (sentiment: PredictionData['sentiment']) => {
    switch (sentiment) {
      case 'Bullish':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-800';
      case 'Bearish':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800';
      default:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-800';
    }
  };

  const getActionColor = (action: PredictionData['recommendedAction']) => {
    switch (action) {
      case 'Buy':
        return 'bg-green-500 dark:bg-green-600';
      case 'Sell':
        return 'bg-red-500 dark:bg-red-600';
      default:
        return 'bg-yellow-500 dark:bg-yellow-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">AI-Powered Analysis</h3>
      
      {prediction.isFallback && (
        <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400 dark:text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Using simulated prediction data. Connect to real APIs for accurate predictions.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 dark:text-gray-300">Market Sentiment</span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(prediction.sentiment)}`}>
            {prediction.sentiment}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700 dark:text-gray-300">Confidence Score</span>
          <div className="flex items-center">
            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
              <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${prediction.confidenceScore}%` }}></div>
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{prediction.confidenceScore}%</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6 bg-gray-50 dark:bg-gray-700/30 rounded p-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Technical Indicators</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">RSI</div>
            <div className="text-gray-900 dark:text-white font-medium">
              {prediction.technicalIndicators.rsi.toFixed(2)}
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                ({prediction.technicalIndicators.rsi > 70 ? 'Overbought' : prediction.technicalIndicators.rsi < 30 ? 'Oversold' : 'Neutral'})
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">MACD</div>
            <div className="text-gray-900 dark:text-white font-medium">
              {prediction.technicalIndicators.macd.toFixed(2)}
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                (Signal: {prediction.technicalIndicators.macdSignal.toFixed(2)})
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">SMA (50-day)</div>
            <div className="text-gray-900 dark:text-white font-medium">{prediction.technicalIndicators.sma.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Key Insights</h4>
        <ul className="space-y-2 text-sm">
          {prediction.reasons.map((reason, index) => (
            <li key={index} className="flex">
              <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {reason}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-6">
        <button className={`w-full py-3 px-4 rounded-md text-white font-medium ${getActionColor(prediction.recommendedAction)}`}>
          Recommended Action: {prediction.recommendedAction}
        </button>
      </div>
    </div>
  );
};

export default StockAnalysis; 