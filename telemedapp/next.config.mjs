/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},   // required for Next 16 when webpack config exists

  async rewrites() {
    return [
      {
        source: "/login",
        destination:
          "https://telemedicine-pilot-d2anbuaxedbfdba9.southafricanorth-01.azurewebsites.net/login",
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;