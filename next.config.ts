import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - allowedDevOrigins is top level in Next.js 16 but might lack types
  allowedDevOrigins: ['192.168.2.103'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
