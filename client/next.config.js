/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    wsurl: 'ws://localhost:5001',
  }
}

module.exports = nextConfig
