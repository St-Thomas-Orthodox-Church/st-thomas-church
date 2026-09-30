import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: false,
    clientSegmentCache: false,
    // 2. Force Next.js to use minimal CPU and RAM during compilation on Hostinger
    workerThreads: false,
    cpus: 1,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Change to 'https' if your Orchard is running on HTTPS
        hostname: 'localhost',
        port: '7199', // Match your Orchard port
        pathname: '/media/**',
      },
      {
        // 4. Allow Next.js to safely render images served from your live DotNest environment
        protocol: 'https',
        hostname: '**.dotnest.com',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
