import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg 
                className="h-8 w-8 text-primary-600"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 20V10" />
                <path d="M18 20V4" />
                <path d="M6 20v-6" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Stock Prophet</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-10">
            <Link href="/" className="text-base font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/predictions" className="text-base font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Predictions
            </Link>
            <Link href="/analysis" className="text-base font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              Analysis
            </Link>
            <Link href="/news" className="text-base font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 transition-colors">
              News
            </Link>
          </nav>

          <div className="flex items-center">
            <button
              type="button"
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md text-sm font-medium hidden md:block"
            >
              Get Premium
            </button>
            
            {/* Mobile menu button */}
            <button 
              type="button" 
              className="md:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link href="/" className="block py-2 text-base font-medium text-gray-900 dark:text-white">
              Dashboard
            </Link>
            <Link href="/predictions" className="block py-2 text-base font-medium text-gray-900 dark:text-white">
              Predictions
            </Link>
            <Link href="/analysis" className="block py-2 text-base font-medium text-gray-900 dark:text-white">
              Analysis
            </Link>
            <Link href="/news" className="block py-2 text-base font-medium text-gray-900 dark:text-white">
              News
            </Link>
            <button
              type="button"
              className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md text-sm font-medium"
            >
              Get Premium
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 