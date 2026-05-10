import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : undefined;

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    deviceSizes: [320, 384, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [96, 128, 192, 256],
    qualities: [62, 68, 75],
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
