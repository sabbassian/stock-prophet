import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StockPicks from '@/components/StockPicks';
import TrendingStocks from '@/components/TrendingStocks';
import MarketNews from '@/components/MarketNews';
import StockSearch from '@/components/StockSearch';
import StockDetail from '@/components/StockDetail';
import Footer from '@/components/Footer';

export default function Home() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Daily Stock Picks
                <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                  Updated every 30 seconds
                </span>
              </h1>
              
              {selectedStock ? (
                <StockDetail 
                  symbol={selectedStock} 
                  onBack={() => setSelectedStock(null)}
                />
              ) : (
                <>
                  <div className="mb-6">
                    <StockSearch onSelect={(symbol) => setSelectedStock(symbol)} />
                  </div>
                  
                  <div className="mb-8">
                    <StockPicks onSelect={(symbol) => setSelectedStock(symbol)} />
                  </div>
                  
                  <div className="mb-8">
                    <TrendingStocks onSelect={(symbol) => setSelectedStock(symbol)} />
                  </div>
                </>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <MarketNews />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 