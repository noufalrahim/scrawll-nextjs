import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Scrawll',
    short_name: 'Scrawll',
    description: 'A Note Taking App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}