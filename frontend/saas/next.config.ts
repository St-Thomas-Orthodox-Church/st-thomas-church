import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    clientSegmentCache: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Change to 'https' if your Orchard is running on HTTPS
        hostname: 'localhost',
        port: '7199', // Match your Orchard port
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
