/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "static",
    distDir: "notepadps-bz",
    webpack: (config, options) => {
        // per verificare che watch guardi le directory giuste
        // strace -fe inotify_add_watch npm run dev
        // remove node_modules
        config.watchOptions.ignored.push("**/node_modules");
        // don't know why but it try to watch /ws/folder_name/ws/foldername too
        config.watchOptions.ignored.push("**/ws");
        // don't know but it watch .. too so don't create app in /first_level dir
        // /app is bad
        return config;
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
