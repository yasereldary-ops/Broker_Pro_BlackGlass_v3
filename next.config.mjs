/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // نحافظ على الـ app router بدون مشاكل
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // نوقف الـ SSR بشكل عملي لكل الصفحات
  compiler: {
    emotion: true,
    styledComponents: true,
  },

  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
};

export default nextConfig;
