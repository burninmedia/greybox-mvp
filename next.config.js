/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/greybox-mvp",
  assetPrefix: "/greybox-mvp",
  images: {
    unoptimized: true,
  },
  // Skip API routes during static export — GitHub Pages has no server.
  // The real API runs on Vercel. These stubs return 404 so links to
  // /api/* gracefully fail instead of causing build errors.
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
