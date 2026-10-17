import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'

export default (phase: any) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig: NextConfig = {
    /* config options here */
    cacheComponents: true,
    partialPrefetching: true,
    turbopack: {
      rules: {
        "*.css": {
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
      },
    },
    output: "export",
    images: { unoptimized: true },
    assetPrefix: isDev ? undefined : '/gcg',
  };
  return nextConfig
}
