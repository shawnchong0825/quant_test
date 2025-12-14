import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@meme-lord/shared', '@meme-lord/data-ops'],
};

export default nextConfig;
