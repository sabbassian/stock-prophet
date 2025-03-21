import { useState, useEffect } from 'react';
import { fetchStockPrediction, PredictionData } from '../lib/api';

interface UsePredictionReturn {
  prediction: PredictionData | null;
  loading: boolean;
  error: Error | null;
  refreshPrediction: () => void;
}

export { type PredictionData };

export function usePrediction(symbol: string): UsePredictionReturn {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPrediction = async () => {
    if (!symbol) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const predictionData = await fetchStockPrediction(symbol);
      setPrediction(predictionData);
    } catch (err) {
      console.error('Error fetching prediction:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch prediction data'));
      
      // If we have no prediction data, create fallback data
      if (!prediction) {
        const mockTechnicalIndicators = {
          rsi: Math.min(Math.max(Math.random() * 100, 1), 99),
          macd: (Math.random() * 10) - 5,
          macdSignal: (Math.random() * 10) - 5,
          sma: 100 + (Math.random() * 100),
          ema: 100 + (Math.random() * 100),
          bollingerBands: {
            upper: 120 + (Math.random() * 20),
            middle: 100 + (Math.random() * 20),
            lower: 80 + (Math.random() * 20),
          },
          volumeAvg: Math.floor(Math.random() * 5000000) + 1000000,
        };
        
        // Random sentiment with weighted probability
        const sentimentRand = Math.random();
        let sentiment: 'Bullish' | 'Bearish' | 'Neutral' = 'Neutral';
        let recommendedAction: 'Buy' | 'Sell' | 'Hold' = 'Hold';
        
        if (sentimentRand > 0.6) {
          sentiment = 'Bullish';
          recommendedAction = 'Buy';
        } else if (sentimentRand > 0.3) {
          sentiment = 'Neutral';
          recommendedAction = 'Hold';
        } else {
          sentiment = 'Bearish';
          recommendedAction = 'Sell';
        }
        
        const mockPrediction: PredictionData = {
          symbol,
          price: 100 + Math.random() * 900,
          predictedPrice: 100 + Math.random() * 950,
          predictedChange: -20 + Math.random() * 40,
          predictedChangePercent: -5 + Math.random() * 10,
          timeFrame: '7 days',
          confidenceScore: Math.min(Math.max(Math.round(Math.random() * 100), 40), 95),
          sentiment,
          recommendedAction,
          reasons: [
            `${mockTechnicalIndicators.rsi > 70 ? 'Overbought' : mockTechnicalIndicators.rsi < 30 ? 'Oversold' : 'Neutral'} RSI of ${mockTechnicalIndicators.rsi.toFixed(2)}`,
            `Price ${mockTechnicalIndicators.sma > 100 + Math.random() * 100 ? 'above' : 'below'} 50-day moving average`,
            `${Math.random() > 0.5 ? 'Positive' : 'Negative'} volume trend detected`,
            `Recent market volatility ${Math.random() > 0.5 ? 'supports' : 'challenges'} position`,
          ],
          technicalIndicators: mockTechnicalIndicators,
          lastUpdated: new Date().toISOString(),
          isFallback: true,
        };
        
        setPrediction(mockPrediction);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchPrediction();
  }, [symbol]);
  
  return {
    prediction,
    loading,
    error,
    refreshPrediction: fetchPrediction
  };
} 