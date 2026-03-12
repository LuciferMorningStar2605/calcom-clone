/** @type {import('next').NextConfig} */ 
const nextConfig = { 
  images: { 
    domains: ['api.dicebear.com', 'avatars.githubusercontent.com'], 
  }, 
  async rewrites() { 
    return [ 
      { 
        source: '/api/:path*', 
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/:path*`, 
      }, 
    ]; 
  }, 
}; 

module.exports = nextConfig; 
