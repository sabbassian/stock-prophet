import React, { useState, useRef, useEffect } from 'react';

interface StockSearchProps {
  onSelect: (symbol: string) => void;
}

// Mocked stock data - this would be replaced with API calls in a real implementation
const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms, Inc.' },
  { symbol: 'TSLA', name: 'Tesla, Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' }
];

const StockSearch: React.FC<StockSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ symbol: string; name: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter stocks based on search query
  useEffect(() => {
    if (query.length > 0) {
      const filteredStocks = popularStocks.filter(
        stock => 
          stock.symbol.toLowerCase().includes(query.toLowerCase()) || 
          stock.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredStocks);
      setIsOpen(true);
    } else {
      setResults(popularStocks);
    }
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (symbol: string) => {
    onSelect(symbol);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="w-full" ref={wrapperRef}>
      <div className="card">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Search Stocks
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Lookup any stock symbol or company name
          </p>
        </div>
        
        <div className="relative">
          <div className="flex items-center border-2 rounded-lg border-gray-300 dark:border-gray-700 focus-within:border-primary-500 dark:focus-within:border-primary-500 bg-white dark:bg-gray-800 px-3 py-2">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="w-full ml-2 outline-none bg-transparent text-gray-700 dark:text-white"
              placeholder="Search for a stock symbol or company name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
            />
          </div>
          
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
              {results.length > 0 ? (
                <ul className="py-1">
                  {results.map((stock) => (
                    <li 
                      key={stock.symbol}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center"
                      onClick={() => handleSelect(stock.symbol)}
                    >
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">{stock.symbol}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</p>
                      </div>
                      <svg className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">No results found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockSearch; 