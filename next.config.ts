import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveExtensions: [".ts", ".tsx", ".js", ".jsx"]
    }
  }
};

export default nextConfig;
