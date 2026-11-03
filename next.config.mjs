// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,
  //output: 'export',
  images: {
    unoptimized: true,
    domains: ['raw.githubusercontent.com', 'play.pokemonshowdown.com',],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "play.pokemonshowdown.com",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
  //basePath: '/pokemon-app-sigurddam',
  //assetPrefix: '/pokemon-app-sigurddam',
};


export default nextConfig;
