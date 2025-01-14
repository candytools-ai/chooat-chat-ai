import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: false,
    images: {
        unoptimized: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    // Configure `pageExtensions` to include MDX files
    pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
    transpilePackages: ['next-mdx-remote'],
};

export default withNextIntl(nextConfig);
