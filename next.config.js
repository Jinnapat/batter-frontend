/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lislkdrqthbcxlhuqbzw.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
