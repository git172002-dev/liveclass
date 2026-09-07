/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: isGithubPages ? 'export' : undefined,
  basePath: isGithubPages ? '/liveclass' : '',
  assetPrefix: isGithubPages ? '/liveclass/' : '',
  trailingSlash: isGithubPages ? true : false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
