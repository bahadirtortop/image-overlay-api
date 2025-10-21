/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@napi-rs/canvas'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('@napi-rs/canvas');
    }
    return config;
  },
};

export default nextConfig;