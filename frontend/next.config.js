/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
    return [{ source: "/api/:path*", destination: `${api}/:path*` }];
  },
  images: { domains: ["images.unsplash.com"] }
};
module.exports = nextConfig;
