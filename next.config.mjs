/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
let basePath = '';
let assetPrefix = '';

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')?.[1] || '';
  basePath = `/${repo}`;
  assetPrefix = `/${repo}/`;
}

const nextConfig = {
  experimental: { appDir: true },
  output: 'export',
  images: { unoptimized: true },
  basePath,
  assetPrefix,
};
export default nextConfig;
