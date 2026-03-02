import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/menu", destination: "/#menu", permanent: true },
      { source: "/schedule", destination: "/#schedule", permanent: true },
      { source: "/teachers", destination: "/faculty", permanent: true },
      { source: "/contact", destination: "/", permanent: true },
    ];
  },
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
