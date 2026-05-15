import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/chatbots",
        destination: "http://localhost:4000/chatbots",
      },
      {
        source: "/upload/:path*",
        destination: "http://localhost:4000/upload/:path*",
      },
      {
        source: "/chat",
        destination: "http://localhost:4000/chat",
      },
    ];
  },
};

export default nextConfig;
