import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Babylon.js の二重初期化を防ぐ
  output: 'standalone',
};

export default nextConfig;
