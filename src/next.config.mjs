/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    basePath: "/erflow",
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
