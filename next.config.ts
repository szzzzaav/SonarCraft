import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 图像优化配置
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 启用压缩
  compress: true,

  // 启用webpack优化
  webpack: (config, { dev, isServer }) => {
    // 生产环境下的优化
    if (!dev) {
      // 优化CSS
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        styles: {
          name: "styles",
          test: /\.(css|scss)$/,
          chunks: "all",
          enforce: true,
        },
      };
    }

    return config;
  },

  // 国际化配置
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  // 启用实验性的应用目录功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // 页面生成性能优化
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,

  // 提高构建性能
  onDemandEntries: {
    // 页面保持在内存中的时间（毫秒）
    maxInactiveAge: 60 * 1000,
    // 同时保持在内存中的页面数
    pagesBufferLength: 5,
  },
};

export default nextConfig;
