import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Configure headers for Sitecore embedding
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM https://*.sitecorecloud.io",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://*.sitecorecloud.io https://*.sitecore.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
