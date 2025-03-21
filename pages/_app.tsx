import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Stock Prophet | AI-Powered Stock Predictions</title>
        <meta name="description" content="Get daily stock picks with AI-powered predictions and real-time market data" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${inter.className} min-h-screen`}>
        <Component {...pageProps} />
      </main>
    </>
  );
} 