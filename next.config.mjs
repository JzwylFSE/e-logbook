/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        port: "",
        pathname: "/favicon.ico",
      },
      // {
      //   protocol: "https",
      //   hostname: "wbckkgkyonodzqztlzwz.supabase.co",
      //   port: "",
      //   pathname: "/storage/v1/storage/buckets/avatars/**",
      // },
      {
      protocol: "https",
      hostname: "wbckkgkyonodzqztlzwz.supabase.co",
      port: "",
      pathname: "/storage/v1/object/sign/avatars/**",
    },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**", 
      },
    ],
  },
};

export default nextConfig; 
