/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
          {
            source: '/:audience',
            destination: '/[audience]',
          },
        ];
      }
  };
  
  export default nextConfig;
  