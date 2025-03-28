import React, { useState, useRef, useEffect } from 'react';
import { searchStocks, StockSearchResult } from '../lib/api';

interface StockSearchProps {
  onSelect: (symbol: string) => void;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Search for stocks when query changes
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // If empty query, get popular stocks
    if (query.length === 0) {
      const fetchPopularStocks = async () => {
        try {
          const popularResults = await searchStocks('');
          setResults(popularResults);
        } catch (err) {
          console.error('Error fetching popular stocks:', err);
        }
      };
      
      fetchPopularStocks();
      return;
    }

    // Set a small delay to avoid making too many API calls while typing
    setLoading(true);
    timeoutRef.current = setTimeout(async () => {
      setError(null);
      
      try {
        const searchResults = await searchStocks(query);
        setResults(searchResults);
        setIsOpen(true);
      } catch (err) {
        console.error('Error searching stocks:', err);
        setError('Failed to search stocks. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 500);

    // Clean up timeout on unmount or when query changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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
            {loading && (
              <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>
          
          {isOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
              {error ? (
                <div className="px-4 py-3 text-sm text-red-500 dark:text-red-400">{error}</div>
              ) : results.length > 0 ? (
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
                <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                  {loading ? 'Searching...' : 'No results found. Try a different search term.'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockSearch; 