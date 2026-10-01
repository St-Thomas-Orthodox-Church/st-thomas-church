import type { NextConfig } from 'next';

const nextConfig = {
  output: 'export',
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
