// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,
  //output: 'export',
  images: {
    unoptimized: true,
    domains: ['raw.githubusercontent.com'],
  },
  //basePath: '/pokemon-app-sigurddam',
  //assetPrefix: '/pokemon-app-sigurddam',
};


export default nextConfig;
