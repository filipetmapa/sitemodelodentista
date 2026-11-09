/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Exportação estática opcional (usada apenas para gerar prévias offline).
  ...(isStaticExport ? { output: "export", trailingSlash: false } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: isStaticExport,
  },
};

export default nextConfig;
