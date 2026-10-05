/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:4000/api/:path*',
      },
      {
        source: '/admin',
        destination: 'http://127.0.0.1:4000/admin/index.html',
      },
      {
        source: '/admin/',
        destination: 'http://127.0.0.1:4000/admin/index.html',
      },
      {
        source: '/admin/:path*',
        destination: 'http://127.0.0.1:4000/admin/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://127.0.0.1:4000/uploads/:path*',
      },
      {
        source: '/public/:path*',
        destination: 'http://127.0.0.1:4000/public/:path*',
      },
      {
        source: '/',
        destination: '/index.html',
      },
      {
        source: '/services',
        destination: '/services.html',
      },
      {
        source: '/pricing',
        destination: '/pricing.html',
      },
      {
        source: '/careers',
        destination: '/careers.html',
      },
      {
        source: '/contact',
        destination: '/contact.html',
      },
      {
        source: '/coming-soon',
        destination: '/coming-soon.html',
      },
    ];
  },
};

export default nextConfig;
