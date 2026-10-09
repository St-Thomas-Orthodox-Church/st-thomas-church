import type { NextConfig } from 'next';

const nextConfig = {
  // 1. Force the compiler to exclude jsdom from server-side bundling
  serverExternalPackages: ['jsdom'],
  typescript: {
    ignoreBuildErrors: true, // Speeds up the build and ignores type warnings
  },
  eslint: {
    ignoreDuringBuilds: true, // Prevents ESLint syntax checks from halting the build
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Change to 'https' if your Orchard is running on HTTPS
        hostname: 'localhost',
        port: '7199', // Match your Orchard port
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'stgstthomasorthodoxchurch.dotnest.net',
        pathname: '/**',
      },
      {
        // 4. Allow Next.js to safely render images served from your live DotNest environment
        protocol: 'https',
        hostname: 'stthomasorthodoxchurch.dotnest.net',
        pathname: '/**',
      },
        
    ],
  },
};
 
export default nextConfig;
