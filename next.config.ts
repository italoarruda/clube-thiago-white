import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  // Disable static export since the app requires Supabase at runtime
  generateBuildId: async () => 'build',
}

export default nextConfig
