/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "www.google.com",
                port: "",
                pathname: "/favicon.ico"    
            }
        ]
    }
};

export default nextConfig;
