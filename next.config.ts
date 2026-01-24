import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.siprep.org",
        pathname: "/uploaded/**",
      },
    ],
  },
};

export default nextConfig;
