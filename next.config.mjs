/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pg', 'drizzle-orm'],
  },
  transpilePackages: ['@shared'],
  webpack: (config) => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt')
    return config
  },
}

export default nextConfig