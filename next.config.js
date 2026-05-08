/** @type {import('next').NextConfig} */
const repoName = "fullstack-brandkit";
const isProd =
  process.env.NODE_ENV === "production" ||
  process.env.GITHUB_ACTIONS === "true";
const basePath = isProd ? "/" + repoName : "";
const assetPrefix = isProd ? "/" + repoName + "/" : "";

const nextConfig = {
  output: "export",
  basePath: basePath,
  assetPrefix: assetPrefix,
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
