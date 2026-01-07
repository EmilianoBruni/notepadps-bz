/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    distDir: "notepadps-bz",
    basePath: "/notepadps-bz",
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
