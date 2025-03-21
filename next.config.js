/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.example.com', 'finnhub.io', 'api.polygon.io', 'finance.yahoo.com'],
    unoptimized: true, // This is needed for static export
  },
  // This is needed for Netlify deployment
  trailingSlash: true,
  // Modern Next.js static export configuration
  output: 'export',
  // Remove distDir as it could be causing conflicts
}

module.exports = nextConfig 