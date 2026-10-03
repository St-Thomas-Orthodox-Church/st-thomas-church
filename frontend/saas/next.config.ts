import type { NextConfig } from 'next';

const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
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
        // 4. Allow Next.js to safely render images served from your live DotNest environment
        protocol: 'https',
        hostname: 'stthomasorthodoxchurch.dotnest.net',
        pathname: '/**',
      },
    ],
  },
};
 
export default nextConfig;
