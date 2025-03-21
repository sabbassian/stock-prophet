/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.example.com', 'finnhub.io', 'api.polygon.io', 'finance.yahoo.com'],
    unoptimized: true, // This is needed for static export
  },
  // This is needed for Netlify deployment
  trailingSlash: true,
  // Disable image optimization for static export
  distDir: '.next',
}

module.exports = nextConfig 