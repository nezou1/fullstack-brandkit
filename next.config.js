/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repoName = "fullstack-brandkit";
const basePath = isProd ? `/${repoName}` : "";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: isProd ? `/${repoName}/` : "",
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
