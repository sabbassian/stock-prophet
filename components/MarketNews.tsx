import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Mock financial news data - would be replaced with API calls
const mockNews = [
  {
    id: 1,
    headline: 'Fed Signals Potential Rate Cut in September',
    source: 'Financial Times',
    date: new Date(2023, 7, 15, 9, 30),
    snippet: 'Federal Reserve officials have indicated they may be prepared to cut interest rates at their September meeting if inflation continues to cool.',
    url: '#',
    sentiment: 'positive'
  },
  {
    id: 2,
    headline: 'Tech Stocks Rally on Strong Earnings Reports',
    source: 'Wall Street Journal',
    date: new Date(2023, 7, 15, 8, 15),
    snippet: 'Technology stocks surged in early trading following better-than-expected earnings reports from several major companies.',
    url: '#',
    sentiment: 'positive'
  },
  {
    id: 3,
    headline: 'Oil Prices Drop as OPEC+ Considers Production Increase',
    source: 'Bloomberg',
    date: new Date(2023, 7, 15, 7, 45),
    snippet: 'Crude oil prices fell after reports that OPEC+ members are discussing a potential increase in production quotas.',
    url: '#',
    sentiment: 'negative'
  },
  {
    id: 4,
    headline: 'Retail Sales Data Shows Unexpected Decline in July',
    source: 'CNBC',
    date: new Date(2023, 7, 15, 7, 0),
    snippet: 'Retail sales fell 0.2% in July, contrary to economist expectations of a 0.3% increase, raising concerns about consumer spending.',
    url: '#',
    sentiment: 'negative'
  },
  {
    id: 5,
    headline: 'New AI Chip from Nvidia Exceeds Performance Expectations',
    source: 'TechCrunch',
    date: new Date(2023, 7, 14, 16, 30),
    snippet: 'Nvidia unveiled its latest AI processor, which early benchmarks show outperforms previous models by up to 70%.',
    url: '#',
    sentiment: 'positive'
  },
  {
    id: 6,
    headline: 'Housing Market Shows Signs of Cooling as Mortgage Rates Rise',
    source: 'Reuters',
    date: new Date(2023, 7, 14, 14, 20),
    snippet: 'Home sales declined for the third consecutive month as mortgage rates climbed to their highest level in over a decade.',
    url: '#',
    sentiment: 'neutral'
  }
];

const MarketNews = () => {
  const [news, setNews] = useState(mockNews);
  
  // Function to determine badge color based on sentiment
  const getSentimentBadge = (sentiment: string) => {
    switch(sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Market News
        </h2>
      </div>
      
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <a href={item.url}>{item.headline}</a>
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${getSentimentBadge(item.sentiment)}`}>
                {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
              </span>
            </div>
            
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>{item.source}</span>
              <span>•</span>
              <span>{format(item.date, 'h:mm a')}</span>
            </div>
            
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {item.snippet}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
          View all news →
        </a>
      </div>
    </div>
  );
};

export default MarketNews; 