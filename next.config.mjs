/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        port: "",
        pathname: "/favicon.ico",
      },
      {
        protocol: "https",
        hostname: "wbckkgkyonodzqztlzwz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
        //pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
