import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Scrawll',
    short_name: 'Scrawll',
    description: 'A Note Taking App built with Next.js',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [
      {
        src: '/public/icons/128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/public/icons/512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}